<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        $this->actingAs(User::factory()->create());
    }

    private function validData(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Weather App',
            'categories' => ['web'],
            'description' => 'Shows the forecast for any city using a public API.',
            'tech_stack' => 'Laravel, React',
            'project_url' => 'https://example.com',
            'image' => UploadedFile::fake()->create('cover.png', 100, 'image/png'),
            'image_alt' => 'Weather app home screen showing a sunny forecast',
            'date_completed' => '2025-05-01',
            'display_order' => 7,
        ], $overrides);
    }

    private function makeProject(array $overrides = []): Project
    {
        return Project::create(array_merge([
            'title' => 'FitPass',
            'categories' => ['mobile'],
            'description' => 'A gym app that tracks member attendance.',
            'tech_stack' => 'Figma, Flutter',
            'image' => 'projects/fitpass.png',
            'image_alt' => 'FitPass welcome screen with a weightlifter',
            'date_completed' => '2025-03-01',
            'display_order' => 1,
        ], $overrides));
    }

    public function test_pages_load(): void
    {
        $project = $this->makeProject();

        $this->get('/')->assertOk();
        $this->get('/projects')->assertOk();
        $this->get('/projects/create')->assertOk();
        $this->get("/projects/{$project->id}/edit")->assertOk();
    }

    public function test_valid_project_is_created_with_success_message(): void
    {
        $this->post('/projects', $this->validData())
            ->assertRedirect('/projects')
            ->assertSessionHas('success', 'Project "Weather App" was added.');

        $project = Project::firstWhere('title', 'Weather App');
        $this->assertNotNull($project);
        Storage::disk('public')->assertExists($project->image);
    }

    public function test_empty_form_shows_required_errors(): void
    {
        $this->post('/projects', [])->assertSessionHasErrors([
            'title', 'categories', 'description', 'tech_stack', 'image', 'image_alt', 'date_completed', 'display_order',
        ]);
        $this->assertSame(0, Project::count());
    }

    public function test_title_longer_than_60_characters_fails(): void
    {
        $this->post('/projects', $this->validData(['title' => str_repeat('a', 61)]))
            ->assertSessionHasErrors('title');
    }

    public function test_wrong_types_and_formats_fail(): void
    {
        $this->post('/projects', $this->validData([
            'project_url' => 'not a link',
            'display_order' => 'abc',
            'categories' => ['games'],
            'date_completed' => now()->addMonth()->toDateString(),
        ]))->assertSessionHasErrors([
            'project_url' => 'The project link must be a full web address starting with http:// or https://.',
            'display_order',
            'categories.0' => 'That category does not exist.',
            'date_completed' => 'The completion date cannot be in the future.',
        ]);
    }

    public function test_duplicate_title_fails_with_custom_message(): void
    {
        $this->makeProject(['title' => 'Weather App']);

        $this->post('/projects', $this->validData())
            ->assertSessionHasErrors(['title' => 'You already have a project with this title.']);
    }

    public function test_update_without_changing_title_still_saves(): void
    {
        $project = $this->makeProject();

        $this->put("/projects/{$project->id}", $this->validData([
            'title' => 'FitPass',          // same title as before
            'image' => null,                // keep the current image
            'description' => 'Updated description for the FitPass gym app.',
        ]))->assertRedirect('/projects')->assertSessionHasNoErrors();

        $project->refresh();
        $this->assertSame('Updated description for the FitPass gym app.', $project->description);
        $this->assertSame('projects/fitpass.png', $project->image);
    }

    public function test_new_image_replaces_the_old_file(): void
    {
        Storage::disk('public')->put('projects/fitpass.png', 'x');
        $project = $this->makeProject();

        $this->put("/projects/{$project->id}", $this->validData(['title' => 'FitPass']))
            ->assertRedirect('/projects')
            ->assertSessionHasNoErrors();

        $project->refresh();
        $this->assertNotSame('projects/fitpass.png', $project->image);
        Storage::disk('public')->assertExists($project->image);
        Storage::disk('public')->assertMissing('projects/fitpass.png');
    }

    public function test_update_without_new_image_keeps_the_file(): void
    {
        Storage::disk('public')->put('projects/fitpass.png', 'x');
        $project = $this->makeProject();

        $this->put("/projects/{$project->id}", $this->validData(['title' => 'FitPass', 'image' => null]))
            ->assertSessionHasNoErrors();

        Storage::disk('public')->assertExists('projects/fitpass.png');
    }

    public function test_portfolio_lists_projects_by_display_order(): void
    {
        $this->makeProject(['title' => 'Second', 'display_order' => 2]);
        $this->makeProject(['title' => 'First', 'display_order' => 1]);

        $this->get('/')->assertInertia(fn ($page) => $page
            ->component('Portfolio')
            ->where('projects.0.title', 'First')
            ->where('projects.1.title', 'Second'));
    }

    public function test_non_image_and_oversized_image_fail(): void
    {
        $this->post('/projects', $this->validData([
            'image' => UploadedFile::fake()->create('notes.pdf', 50, 'application/pdf'),
        ]))->assertSessionHasErrors(['image' => 'The file must be an image.']);

        $this->post('/projects', $this->validData([
            'image' => UploadedFile::fake()->create('huge.png', 3000, 'image/png'),
        ]))->assertSessionHasErrors(['image' => 'The image must be 2 MB or smaller.']);
    }

    public function test_project_is_deleted_with_its_image(): void
    {
        Storage::disk('public')->put('projects/fitpass.png', 'x');
        $project = $this->makeProject();

        $this->delete("/projects/{$project->id}")
            ->assertRedirect('/projects')
            ->assertSessionHas('success', 'Project "FitPass" was deleted.');

        $this->assertModelMissing($project);
        Storage::disk('public')->assertMissing('projects/fitpass.png');
    }
}

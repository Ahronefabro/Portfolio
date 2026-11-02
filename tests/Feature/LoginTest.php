<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    private function makeProject(): Project
    {
        return Project::create([
            'title' => 'FitPass',
            'categories' => ['mobile'],
            'description' => 'A gym app that tracks member attendance.',
            'tech_stack' => 'Figma, Flutter',
            'image' => 'projects/fitpass.png',
            'image_alt' => 'FitPass welcome screen with a weightlifter',
            'date_completed' => '2025-03-01',
            'display_order' => 1,
        ]);
    }

    public function test_guests_can_see_the_portfolio_and_login_page(): void
    {
        $this->get('/')->assertOk();
        $this->get('/login')->assertOk()->assertInertia(fn ($page) => $page->component('Login'));
    }

    public function test_guests_cannot_use_any_project_route(): void
    {
        $project = $this->makeProject();

        $this->get('/projects')->assertRedirect('/login');
        $this->get('/projects/create')->assertRedirect('/login');
        $this->get("/projects/{$project->id}/edit")->assertRedirect('/login');
        $this->post('/projects', ['title' => 'Hacked'])->assertRedirect('/login');
        $this->put("/projects/{$project->id}", ['title' => 'Hacked'])->assertRedirect('/login');
        $this->delete("/projects/{$project->id}")->assertRedirect('/login');

        $this->assertSame('FitPass', $project->refresh()->title);
        $this->assertSame(1, Project::count());
    }

    public function test_correct_password_logs_in_and_continues_to_projects(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);

        $this->get('/projects');

        $this->post('/login', ['email' => $user->email, 'password' => 'correct-password'])
            ->assertRedirect('/projects');
        $this->assertAuthenticatedAs($user);
    }

    public function test_wrong_password_is_rejected(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);

        $this->post('/login', ['email' => $user->email, 'password' => 'wrong-password'])
            ->assertSessionHasErrors(['email' => 'That email and password do not match.']);
        $this->assertGuest();
    }

    public function test_login_attempts_are_limited(): void
    {
        $user = User::factory()->create(['password' => 'correct-password']);

        foreach (range(1, 5) as $attempt) {
            $this->post('/login', ['email' => $user->email, 'password' => 'wrong-password']);
        }

        $this->post('/login', ['email' => $user->email, 'password' => 'correct-password'])
            ->assertStatus(429);
        $this->assertGuest();
    }

    public function test_logout_ends_the_session(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/logout')->assertRedirect('/');
        $this->assertGuest();
    }

    public function test_admin_create_command_makes_a_working_login(): void
    {
        $this->artisan('admin:create', ['email' => 'owner@example.com'])
            ->expectsQuestion('Password (at least 8 characters)', 'long-enough-password')
            ->assertSuccessful();

        $this->assertTrue(Auth::attempt(['email' => 'owner@example.com', 'password' => 'long-enough-password']));
    }

    public function test_admin_create_command_rejects_a_short_password(): void
    {
        $this->artisan('admin:create', ['email' => 'owner@example.com'])
            ->expectsQuestion('Password (at least 8 characters)', 'short')
            ->assertFailed();

        $this->assertSame(0, User::count());
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * List every project for the management page.
     */
    public function index()
    {
        return Inertia::render('Projects/Index', [
            'projects' => Project::orderBy('display_order')->orderBy('title')->get(),
        ]);
    }

    /**
     * Show the empty form.
     */
    public function create()
    {
        return Inertia::render('Projects/Create', [
            'categories' => Project::CATEGORIES,
            'nextOrder' => (Project::max('display_order') ?? 0) + 1,
        ]);
    }

    /**
     * Validate and save a new project.
     */
    public function store(Request $request)
    {
        $data = $request->validate($this->rules(), $this->messages());

        $data['image'] = $request->file('image')->store('projects', 'public');

        Project::create($data);

        return redirect()->route('projects.index')
            ->with('success', "Project \"{$data['title']}\" was added.");
    }

    /**
     * Show the form filled with the project's current values.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'categories' => Project::CATEGORIES,
        ]);
    }

    /**
     * Validate and save changes to a project.
     */
    public function update(Request $request, Project $project)
    {
        $data = $request->validate($this->rules($project), $this->messages());

        $oldImage = $project->image;

        // Keep the old image unless a new one was uploaded
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('projects', 'public');
        } else {
            unset($data['image']);
        }

        $project->update($data);

        // Only remove the old file once the new one is saved, so a failure can't leave a broken image
        if ($project->image !== $oldImage) {
            Storage::disk('public')->delete($oldImage);
        }

        return redirect()->route('projects.index')
            ->with('success', "Project \"{$project->title}\" was updated.");
    }

    /**
     * Delete a project and its image file.
     */
    public function destroy(Project $project)
    {
        $project->delete();
        Storage::disk('public')->delete($project->image);

        return redirect()->route('projects.index')
            ->with('success', "Project \"{$project->title}\" was deleted.");
    }

    /**
     * Rules shared by store and update. On update, $project is passed so the
     * unique title check ignores this record and the image becomes optional.
     */
    private function rules(?Project $project = null): array
    {
        return [
            'title' => [
                'required', 'string', 'min:3', 'max:60',
                Rule::unique('projects', 'title')->ignore($project),
            ],
            'categories' => ['required', 'array', 'min:1'],
            'categories.*' => ['distinct', Rule::in(Project::CATEGORIES)],
            'description' => ['required', 'string', 'min:20', 'max:300'],
            'tech_stack' => ['required', 'string', 'max:120'],
            'project_url' => ['nullable', 'url:http,https', 'max:255'],
            'image' => [$project ? 'nullable' : 'required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'image_alt' => ['required', 'string', 'min:10', 'max:200'],
            'date_completed' => ['required', 'date', 'before_or_equal:today'],
            'display_order' => ['required', 'integer', 'between:1,99'],
        ];
    }

    /**
     * Custom error messages, written for the person filling in the form.
     */
    private function messages(): array
    {
        return [
            'title.unique' => 'You already have a project with this title.',
            'categories.required' => 'Pick at least one category.',
            'categories.min' => 'Pick at least one category.',
            'categories.*.in' => 'That category does not exist.',
            'description.min' => 'The description should be at least 20 characters so visitors know what the project is.',
            'project_url.url' => 'The project link must be a full web address starting with http:// or https://.',
            'image.required' => 'Upload a screenshot or cover image for the project.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'The image must be a JPG, PNG or WEBP file.',
            'image.max' => 'The image must be 2 MB or smaller.',
            'image_alt.required' => 'Describe the image for visitors who use a screen reader.',
            'date_completed.before_or_equal' => 'The completion date cannot be in the future.',
            'display_order.between' => 'The display order must be a number from 1 to 99.',
        ];
    }
}

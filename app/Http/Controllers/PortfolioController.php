<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * The public portfolio page. Projects come from the database;
     * every other section is still written directly in the React page.
     */
    public function index()
    {
        return Inertia::render('Portfolio', [
            'projects' => Project::orderBy('display_order')->orderBy('title')->get(),
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProjectSeeder extends Seeder
{
    /**
     * Load the six projects from the original static portfolio.
     * Images are copied from database/seeders/images into storage/app/public/projects.
     */
    public function run(): void
    {
        // NOTE: the dates below are placeholders. Edit them to the real completion dates.
        $projects = [
            [
                'title' => 'FitPass',
                'project_url' => 'https://www.figma.com/design/gFRXRVFWnld8DEilXeXRnT/FITPASS?node-id=0-1&t=Pl0ljTmVQp0ltlcZ-1',
                'categories' => ['mobile', 'design'],
                'description' => 'A gym app that tracks member attendance through check-ins and visit logs.',
                'tech_stack' => 'Figma, Flutter',
                'image' => 'fitpass.png',
                'image_alt' => 'FitPass mobile app welcome screen: a weightlifter in a gym behind the headline Train Hard, Be Stronger and Get Started and Log In buttons',
                'date_completed' => '2025-03-01',
            ],
            [
                'title' => 'Sole Society',
                'project_url' => 'https://www.figma.com/design/OMcjWJkwqLyfveJqN6DYOa/Sole-Society?node-id=0-1&t=EDmVYHRDYNUwDcV6-1',
                'categories' => ['mobile', 'design'],
                'description' => 'An e-commerce app for browsing and buying all kinds of shoes.',
                'tech_stack' => 'Figma, Flutter',
                'image' => 'sole-society.jpg',
                'image_alt' => 'Sole Society splash screen: a tennis player mid-swing in teal smoke with the Sole Society wordmark across the centre',
                'date_completed' => '2025-04-01',
            ],
            [
                'title' => 'Laya',
                'project_url' => 'https://www.figma.com/design/wsqsrPkrYQKcKDSIcxUZ1n/Untitled?node-id=0-1&t=S6FB7QwWBbinXawA-1',
                'categories' => ['mobile', 'design'],
                'description' => 'A GCash-style e-wallet app for sending money, paying bills, buying load, and scanning QR codes.',
                'tech_stack' => 'Figma, Flutter',
                'image' => 'laya.png',
                'image_alt' => 'Laya mobile app splash screen: a white circle logo above the Laya wordmark on a magenta to deep purple gradient',
                'date_completed' => '2025-05-01',
            ],
            [
                'title' => 'aPay-aya',
                'project_url' => 'https://www.figma.com/design/Aq2w4N1VGPoA4U03W68lvX/Final-Project-Design-Proposal?node-id=0-1&t=PMqDxxhUDiWUk3Zj-1',
                'categories' => ['mobile', 'design'],
                'description' => 'An e-wallet app with secure OTP registration, money transfers, bill payments, and a built-in shop.',
                'tech_stack' => 'Figma, Flutter',
                'image' => 'ap-wallet.png',
                'image_alt' => 'aPay-aya mobile wallet app splash screen: a green and blue AP monogram inside a silver and gold ring on a light grey background',
                'date_completed' => '2025-06-01',
            ],
            [
                'title' => 'Thorz Garage',
                'project_url' => 'https://www.figma.com/design/WFFun4Jba05VgZZYbtSjpO/MOTOCARE?node-id=0-1&t=AkNyv0h8Kf5GXvFY-1',
                'categories' => ['web', 'design'],
                'description' => 'A motorcycle service booking system with a customer booking flow and an admin dashboard for managing bookings, customers, services, and the calendar.',
                'tech_stack' => 'Figma, Laravel',
                'image' => 'thorz-garage.png',
                'image_alt' => 'Thorz Garage website home page: a mechanic working on a motorcycle behind the headline Your Bike, Our Expertise with Book Service and View Service buttons',
                'date_completed' => '2025-09-01',
            ],
            [
                'title' => 'This portfolio',
                'project_url' => 'https://www.figma.com/design/LmhZ3LxQQ68g699mvI8JoG/Ahrone-Fabro-%E2%80%93-Portfolio?node-id=0-1&t=C8n1qtAozRLbd6TZ-1',
                'categories' => ['web', 'school'],
                'description' => 'The site you’re on. Rebuilt with Laravel, Inertia and React: the projects below come from a database and are managed through forms, with dark mode, scroll-reveal animations and filterable cards.',
                'tech_stack' => 'Laravel, Inertia, React, Tailwind',
                'image' => 'portfolio.png',
                'image_alt' => 'This portfolio site: the hero section with the name Ahrone B. Fabro beside a profile.json code card',
                'date_completed' => '2026-10-01',
            ],
        ];

        foreach ($projects as $i => $project) {
            $path = 'projects/'.$project['image'];
            Storage::disk('public')->put($path, file_get_contents(__DIR__.'/images/'.$project['image']));

            Project::updateOrCreate(
                ['title' => $project['title']],
                [...$project, 'image' => $path, 'display_order' => $i + 1],
            );
        }
    }
}

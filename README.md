# Ahrone B. Fabro — Portfolio (Laravel + Inertia.js + React)

My personal portfolio converted to Laravel 12, Inertia.js and React, with the **Projects** section managed through a full CRUD with server-side validation.

## Run it locally

Requires PHP 8.2+, Composer and Node.js.

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed     # answer "yes" to create the SQLite database; loads the 6 projects
php artisan storage:link       # makes uploaded images public
php artisan admin:create you@example.com   # creates the login; asks for a password
npm run build                  # or: npm run dev (keep it running)
php artisan serve
```

- Portfolio: http://127.0.0.1:8000
- Manage projects (login required): http://127.0.0.1:8000/projects

Run `php artisan admin:create` again with the same email to change the password.

## Tests

```bash
php artisan test
```

## Improvements and open items

See [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md), including what to do before putting the site online.

## Where things are

| Part | File |
|---|---|
| Migration | `database/migrations/2026_10_21_121541_create_projects_table.php` |
| Model | `app/Models/Project.php` |
| Controller + validation | `app/Http/Controllers/ProjectController.php` |
| Public page controller | `app/Http/Controllers/PortfolioController.php` |
| Routes | `routes/web.php` |
| CRUD pages | `resources/js/Pages/Projects/Index.jsx`, `Create.jsx`, `Edit.jsx` |
| Public page | `resources/js/Pages/Portfolio.jsx` |
| Components | `resources/js/Components/` (ProjectForm, FormField, ProjectCard, Navbar, Footer, SectionTitle, …) |
| Seed data | `database/seeders/ProjectSeeder.php` |
| Validation tests | `tests/Feature/ProjectCrudTest.php` |

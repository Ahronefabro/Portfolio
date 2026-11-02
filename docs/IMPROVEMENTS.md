# Portfolio improvements

Review date: 2 November 2026. The first section lists what changed in the code. The second lists what still needs a decision or your input.

## Changes made

### 1. A failed save now takes you to the first error

**Problem:** the submit button is at the bottom of a long form, while errors can appear at the top. On the Edit page the scroll position is kept, so a failed save could look like nothing happened.

**Now:** the page scrolls to the first invalid field and focuses it, including the category checkboxes. Screen readers also read out that field's error.

File: `resources/js/Components/ProjectForm.jsx`

### 2. A failed save or delete can't leave a broken image

**Problem:** the old image file was deleted before the new image and database change were saved. If a later step failed, the project pointed to a file that no longer existed.

**Now:** the old file is removed only after the database update or delete succeeds.

File: `app/Http/Controllers/ProjectController.php`

### 3. Smaller additions

- **Link previews:** added Open Graph tags, so shared links can show your name, description and photo (`resources/views/app.blade.php`). Previews only work once the site is on a public URL.
- **Skip link:** the management pages now have the "Skip to content" link the public page already had (`resources/js/Layouts/AdminLayout.jsx`).
- **Tests:** added three tests, covering image replacement, keeping the image when none is uploaded, and project order on the public page (`tests/Feature/ProjectCrudTest.php`).

### 4. The project pages now require a login

**Problem:** anyone could open `/projects` and add, edit or delete projects or upload files, and the public footer linked there.

**Now:** every project route redirects visitors to `/login`, and the footer link is gone. There is no sign-up page. Login attempts are limited to 5 a minute, and the management pages have a "Log out" button.

**Setup:** run `php artisan admin:create you@example.com` and choose a password. Run it again with the same email to change the password, and run it once on any new server. Anyone reviewing the CRUD pages, such as a teacher, needs a login from you.

Files: `app/Http/Controllers/LoginController.php`, `resources/js/Pages/Login.jsx`, `routes/web.php`, `routes/console.php`, `bootstrap/app.php`, `resources/js/Components/Footer.jsx`, `resources/js/Layouts/AdminLayout.jsx`, `tests/Feature/LoginTest.php`

### Tried and reverted

- **Page splitting:** loading each page as a separate file barely helped: a portfolio visitor's download went from 151.44 kB to about 151.0 kB gzipped, because React and Inertia make up nearly all of it. It also added extra requests, so the code stays as it was.
- **Contact form:** a version that opened the visitor's email app was added, then undone at the owner's request. The form is back to its original behaviour (see "Content only you can fix").

## How this was checked

- `php artisan test` passes all 21 tests (108 assertions) on the final code.
- `npm run build` succeeds on the final code.
- **Checked in Chrome on 2 November 2026, using a copy of the database:** the login page, wrong-password message, "Log out" button, skip link, focus on the first invalid field after a failed save, and the 12 form tests in `docs/Midterm-Laboratory-2-Documentation.pdf`.
- **Not tested:** link previews, because they need a public URL.

## Still needs attention

### Before putting the site online: production settings

Set these in the server's `.env`:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.example
```

`APP_DEBUG=true` is fine locally, but on a live site it shows error details to visitors.

### Content only you can fix

- **Project dates:** the dates in `database/seeders/ProjectSeeder.php` are marked as placeholders, yet the cards show them as "Completed …". Update them on the management page if the database already has them; otherwise edit the seeder.
- **Skills:** React and Inertia are listed on the "This portfolio" project but not in the skills section.
- **Project links:** every "View project" link goes to Figma, including those for projects listing Flutter or Laravel. A GitHub repo or live demo for even one project would show your code as well as your designs.
- **Contact form:** the form says "Your message was submitted", but nothing is sent or stored, so you never receive these messages. Delivering them needs a Laravel endpoint with a mail service, spam protection and rate limiting.

### Small issues, not urgent

- Project titles are only unique when capitals match, so "fitpass" and "FitPass" can both exist.
- Repeating a tool, as in "Figma, Figma", shows it twice and triggers a React key warning in `ProjectCard.jsx`.
- The filter buttons are hardcoded in `ProjectsSection.jsx`, separately from `Project::CATEGORIES`, so a new category must be added in both. They also say "mobile" where the cards say "Mobile app".
- If a delete fails, the confirmation dialog closes without showing an error.
- Some seed images are large (`thorz-garage.png` is about 700 KB). Converting them to WebP would speed up the projects section.

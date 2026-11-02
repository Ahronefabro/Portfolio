<?php

use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:create {email}', function (string $email) {
    $password = (string) $this->secret('Password (at least 8 characters)');

    if (strlen($password) < 8) {
        $this->error('The password must be at least 8 characters.');

        return 1;
    }

    User::updateOrCreate(['email' => $email], ['name' => 'Admin', 'password' => $password]);
    $this->info("{$email} can now log in at /login.");
})->purpose('Create the login for the project pages, or change its password');

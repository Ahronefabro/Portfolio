<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;

// Public portfolio
Route::get('/', [PortfolioController::class, 'index'])->name('portfolio');

// Login. Attempts are limited to 5 a minute to slow down password guessing.
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:5,1');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Project management: index, create, store, edit, update, destroy.
    // "show" is left out because each project is already shown in full on its card.
    Route::resource('projects', ProjectController::class)->except('show');
});

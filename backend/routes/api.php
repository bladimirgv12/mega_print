<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AboutSectionController;

/*
|--------------------------------------------------------------------------
| API Routes — MegaPrint
|--------------------------------------------------------------------------
*/

// ── Public Routes ──
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

// Products (public read)
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);

// Categories (public read)
Route::get('categories', [CategoryController::class, 'index']);

// Jobs (public read)
Route::get('jobs', [JobController::class, 'index']);
Route::get('jobs/{id}', [JobController::class, 'show']);

// Testimonials (public read + public create)
Route::get('testimonials', [TestimonialController::class, 'index']);
Route::post('testimonials', [TestimonialController::class, 'store']);

// About (public read)
Route::get('about', [AboutSectionController::class, 'index']);

// Contact (public create)
Route::post('contacts', [ContactController::class, 'store']);

// ── Protected Routes (Sanctum) ──
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Products CRUD (write)
    Route::post('products', [ProductController::class, 'store']);
    Route::post('products/{id}', [ProductController::class, 'update']); // POST with _method=PUT for FormData
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);

    // Categories CRUD (write)
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

    // Jobs CRUD (write)
    Route::post('jobs', [JobController::class, 'store']);
    Route::post('jobs/{id}', [JobController::class, 'update']);
    Route::put('jobs/{id}', [JobController::class, 'update']);
    Route::delete('jobs/{id}', [JobController::class, 'destroy']);

    // Testimonials (admin: approve + delete)
    Route::put('testimonials/{id}/approve', [TestimonialController::class, 'approve']);
    Route::delete('testimonials/{id}', [TestimonialController::class, 'destroy']);

    // Contacts (admin: list + delete)
    Route::get('contacts', [ContactController::class, 'index']);
    Route::delete('contacts/{id}', [ContactController::class, 'destroy']);

    // About (write)
    Route::post('about', [AboutSectionController::class, 'store']);
    Route::post('about/{id}', [AboutSectionController::class, 'update']);
    Route::put('about/{id}', [AboutSectionController::class, 'update']);
    Route::delete('about/{id}', [AboutSectionController::class, 'destroy']);
});

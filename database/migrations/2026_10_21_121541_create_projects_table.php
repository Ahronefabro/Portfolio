<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title', 60)->unique();      // card heading; unique so two cards can't share a name
            $table->json('categories');                  // e.g. ["mobile","design"], drives the filter buttons
            $table->text('description');                 // short summary shown on the card
            $table->string('tech_stack', 120);           // comma-separated tools, e.g. "Figma, Flutter"
            $table->string('project_url')->nullable();   // live site / Figma / repo link (optional)
            $table->string('image');                     // path inside storage/app/public
            $table->string('image_alt', 200);            // alt text so the image is described to screen readers
            $table->date('date_completed');
            $table->unsignedSmallInteger('display_order')->default(1); // lower number shows first
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

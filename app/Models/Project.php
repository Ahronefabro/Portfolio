<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    // The categories a project can be filed under (also the filter buttons on the portfolio)
    public const CATEGORIES = ['web', 'mobile', 'design', 'school'];

    // Only these columns can be filled from a form, so a request can't sneak in "id" or timestamps
    protected $fillable = [
        'title',
        'categories',
        'description',
        'tech_stack',
        'project_url',
        'image',
        'image_alt',
        'date_completed',
        'display_order',
        'repository_url', // Added repository_url to fillable
    ];

    // Sent to React along with the columns
    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'categories' => 'array',        // JSON column <-> PHP array
            'date_completed' => 'date:Y-m-d',
            'display_order' => 'integer',
        ];
    }

    // Public URL of the uploaded image (served through the storage:link folder)
    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn () => $this->image ? '/storage/'.$this->image : null);
    }
}

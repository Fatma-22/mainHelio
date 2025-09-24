<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PropertyImage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'property_id',
        'url',
        'thumbnail_url',
        'medium_url',
        'sort',
        'isfeatured',
        'alt_text',
        'caption',
        'file_size',
        'dimensions',
        'original_filename',
        'mime_type',
        'seo_keywords'
    ];

    protected $casts = [
        'dimensions' => 'array',
        'isfeatured' => 'boolean',
    ];

    // العلاقة مع العقار
    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title_ar',
        'title_en',
        'type',
        'description_ar',
        'description_en',
        'cover_url',
        'thumbnail_url',
        'medium_url',
        'altText',
        'caption',
        'file_size',
        'dimensions',
        'original_filename',
        'mime_type',
        'seo_keywords',
        'images_json', // احتفظ بهذا الحقل إذا كنت لا تزال تستخدمه
    ];

    protected $casts = [
        'images_json' => 'array',
        'dimensions' => 'array',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function decorRequests()
    {
        return $this->hasMany(DecorRequest::class, 'reference_item_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'entity_id')->where('entity_type', 'decor');
    }

    /**
     * Get the full URL for the cover image
     */
    public function getFullCoverUrlAttribute()
    {
        if (!$this->cover_url) return null;
        if (strpos($this->cover_url, 'http://') === 0 || strpos($this->cover_url, 'https://') === 0) {
            return $this->cover_url;
        }
        return url('storage/' . $this->cover_url);
    }

    /**
     * Get the full URL for the thumbnail image
     */
    public function getFullThumbnailUrlAttribute()
    {
        if (!$this->thumbnail_url) return null;
        if (strpos($this->thumbnail_url, 'http://') === 0 || strpos($this->thumbnail_url, 'https://') === 0) {
            return $this->thumbnail_url;
        }
        return url('storage/' . $this->thumbnail_url);
    }

    /**
     * Get the full URL for the medium image
     */
    public function getFullMediumUrlAttribute()
    {
        if (!$this->medium_url) return null;
        if (strpos($this->medium_url, 'http://') === 0 || strpos($this->medium_url, 'https://') === 0) {
            return $this->medium_url;
        }
        return url('storage/' . $this->medium_url);
    }
}
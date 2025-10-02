<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DecorRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'type',
        'details',
        'reference_item_id',
        'notes',
        'status',
        'assigned_to',
        'requested_by',
        'handled_by',
        'image',
        'thumbnail_url',
        'medium_url',
        'alt_text',
        'caption',
        'file_size',
        'dimensions',
        'original_filename',
        'mime_type',
        'seo_keywords',
    ];

    protected $casts = [
        'dimensions' => 'array',
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function assignee()
    {
        return $this->belongsTo(Staff::class, 'assigned_to');
    }

    public function referenceItem()
    {
        return $this->belongsTo(PortfolioItem::class, 'reference_item_id');
    }
    
    public function requestedBy()
    {
        return $this->belongsTo(Customer::class, 'requested_by');
    }
    
    public function handledBy()
    {
        return $this->belongsTo(Staff::class, 'handled_by');
    }

    /**
     * Get the full URL for the image
     */
    public function getFullImageUrlAttribute()
    {
        if (!$this->image) return null;
        if (strpos($this->image, 'http://') === 0 || strpos($this->image, 'https://') === 0) {
            return $this->image;
        }
        return url('storage/' . $this->image);
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
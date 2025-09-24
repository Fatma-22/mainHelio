<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Property extends Model
{
    use HasFactory;
    protected $fillable = [
        'title_ar',
        'title_en',
        'desc_ar',
        'desc_en',
        'price',
        'area',
        'bedrooms',
        'bathrooms',
        'type',
        'status',
        'lat',
        'lng',
        'address',
        'is_published',
        'is_listed',
        'created_by',
        'requested_by',
        'google_maps_url',
        'listing_end_date',
        'keywords',
        'listing_plan',
        'requested_at',
        'finish',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'area' => 'decimal:2',
        'lat' => 'decimal:8',
        'lng' => 'decimal:8',
        'is_published' => 'boolean',
        'listing_end_date' => 'date:Y-m-d',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'created_by');
    }

    public function requestedByCustomer() {
    return $this->belongsTo(Customer::class, 'requested_by');
   }
    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'property_amenities');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
     public function reviews()
        {
            return $this->hasMany(Review::class, 'entity_id')->where('entity_type', 'property');
        }
        public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Africa/Cairo')->format('Y-m-d H:i:s');
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Africa/Cairo')->format('Y-m-d H:i:s');
    }
    public function getRequestedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Africa/Cairo')->format('Y-m-d H:i:s');
    }
    
}
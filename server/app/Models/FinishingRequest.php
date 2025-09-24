<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinishingRequest extends Model
{
    use HasFactory;

    protected $fillable = [
    'customer_name',
    'phone',
    'email',
    'package',
    'type',
    'details',
    'notes',
    'status',
    'assigned_to',
    'created_at',
    'requested_by',
    'updated_at',
];


    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    public function assignee()
    {
        return $this->belongsTo(Staff::class, 'assigned_to');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'entity_id')->where('entity_type', 'finishing');
    }
}
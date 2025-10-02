<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'contact_time',
        'status',
        'handled_by',
        'type',
        'read',
        'notes',
        'created_at',
        'updated_at'
    ];

    public function handler()
    {
        return $this->belongsTo(Staff::class, 'handled_by');
    }
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Africa/Cairo')->format('Y-m-d H:i:s');
    }

    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->timezone('Africa/Cairo')->format('Y-m-d H:i:s');
    }
}
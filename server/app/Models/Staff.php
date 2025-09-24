<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class Staff extends Authenticatable
{
    use HasFactory, HasApiTokens,Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'status',
        'last_login_at',
        'updated_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime:Y-m-d H:i:s',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];

    // العلاقة مع العقارات التي أنشأها الموظف
    public function properties()
    {
        return $this->hasMany(Property::class, 'created_by');
    }

    // الجديد (كل staff ليه role واحد)
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
 public function interactions()
    {
        return $this->hasMany(CustomerInteraction::class, 'staff_id');
    }
    public function finishingRequests()
    {
        return $this->hasMany(FinishingRequest::class, 'assigned_to');
    }
    public function inquiries()
    {
        return $this->hasMany(Inquiry::class, 'handled_by');
    }
}
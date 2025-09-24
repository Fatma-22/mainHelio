<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_ar',
        'title_en',
        'content_ar',
        'content_en',
        'cover_url',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime:Y-m-d H:i:s',
        'created_at' => 'datetidatetime:Y-m-d H:i:sme',
        'updated_at' => 'datetime:Y-m-d H:i:s',
    ];
}
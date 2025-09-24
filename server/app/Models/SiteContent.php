<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    use HasFactory;

    protected $table = 'site_content';


    protected $fillable = [
        'heroTitle',
        'heroSubtitle',
        'aboutTitle',
        'aboutSubtitle',
        'aboutPoints',
        'servicesTitle',
        'services',
        'testimonialsTitle',
        'testimonials',
        'contactTitle',
        'contactSubtitle',
        'contactPhone',
        'contactEmail',
        'contactAddress',
        'workingHours',
        'socialLinks',
        'updated_by',
    ];

    protected $casts = [
        'aboutPoints' => 'array',
        'services' => 'array',
        'testimonials' => 'array',
        'socialLinks' => 'array',
    ];
}

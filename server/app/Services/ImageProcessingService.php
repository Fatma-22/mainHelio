<?php

namespace App\Services;

use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\PropertyImage;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;

class ImageProcessingService
{
    protected $cloudinary;
    protected $isCloudinaryConfigured = false;

    public function __construct()
    {
        // Don't initialize Cloudinary in constructor - do it lazily
    }

    /**
     * Initialize Cloudinary configuration
     */
    private function initializeCloudinary()
    {
        if ($this->isCloudinaryConfigured) {
            return;
        }

        $cloudName = config('services.cloudinary.cloud_name');
        $apiKey = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');
        
        // Debug: Log the configuration values (remove in production)
        \Log::info('Cloudinary Config Debug', [
            'cloud_name' => $cloudName ? 'SET' : 'NOT SET',
            'api_key' => $apiKey ? 'SET' : 'NOT SET',
            'api_secret' => $apiSecret ? 'SET' : 'NOT SET',
            'cloud_name_value' => $cloudName,
            'api_key_value' => $apiKey ? substr($apiKey, 0, 4) . '...' : 'NOT SET',
            'all_env_vars' => [
                'CLOUDINARY_CLOUD_NAME' => env('CLOUDINARY_CLOUD_NAME'),
                'CLOUDINARY_API_KEY' => env('CLOUDINARY_API_KEY') ? 'SET' : 'NOT SET',
                'CLOUDINARY_API_SECRET' => env('CLOUDINARY_API_SECRET') ? 'SET' : 'NOT SET'
            ]
        ]);
        
        if (!$cloudName || !$apiKey || !$apiSecret) {
            throw new \Exception('Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file. Current values: CloudName=' . ($cloudName ?: 'NULL') . ', ApiKey=' . ($apiKey ? 'SET' : 'NULL') . ', ApiSecret=' . ($apiSecret ? 'SET' : 'NULL'));
        }

        try {
            $this->cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => $cloudName,
                    'api_key' => $apiKey,
                    'api_secret' => $apiSecret,
                ],
                'url' => [
                    'secure' => true
                ]
            ]);
             
            $this->isCloudinaryConfigured = true;
        } catch (\Exception $e) {
            throw new \Exception('Failed to initialize Cloudinary: ' . $e->getMessage());
        }
    }

    // الأحجام المختلفة للصور
    protected $sizes = [
        'thumbnail' => [
            'width' => 150,
            'height' => 150,
            'quality' => 75,
        ],
        'medium' => [
            'width' => 500,
            'height' => 500,
            'quality' => 80,
        ],
        'large' => [
            'width' => 1200,
            'height' => 1200,
            'quality' => 85,
        ],
    ];

    /**
     * معالجة الصورة وإنشاء الأحجام المختلفة
     */
    public function processAndStoreImage($file, $propertyId, $imageData = [])
    {
        // Initialize Cloudinary
        $this->initializeCloudinary();

        // إنشاء اسم فريد للملف
        $originalName = $file->getClientOriginalName();
        $fileName = pathinfo($originalName, PATHINFO_FILENAME);
        $fileExtension = $file->getClientOriginalExtension();
        $uniqueName = 'property_' . $propertyId . '_' . uniqid();

        // معالجة الصورة الأساسية
        $image = Image::make($file);
        
        // الحصول على أبعاد الصورة الأصلية
        $originalWidth = $image->width();
        $originalHeight = $image->height();
        
        // رفع الصورة الأصلية إلى Cloudinary
        $originalUpload = $this->cloudinary->uploadApi()->upload(
            $file->getRealPath(),
            [
                'public_id' => $uniqueName . '_original',
                'folder' => 'properties/original',
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ]
        );
        
        // إنشاء URLs للأحجام المختلفة باستخدام Cloudinary transformations
        $urls = [
            'original' => $originalUpload['secure_url'],
            'thumbnail' => $this->cloudinary->image($originalUpload['public_id'])
                ->resize(\Cloudinary\Transformation\Resize::fill($this->sizes['thumbnail']['width'], $this->sizes['thumbnail']['height']))
                ->quality('auto')
                ->format('auto')
                ->toUrl(),
            'medium' => $this->cloudinary->image($originalUpload['public_id'])
                ->resize(\Cloudinary\Transformation\Resize::fill($this->sizes['medium']['width'], $this->sizes['medium']['height']))
                ->quality('auto')
                ->format('auto')
                ->toUrl(),
        ];
        
        // إنشاء نص بديل تلقائي للـ SEO إذا لم يتم توفيره
        $altText = $imageData['altText'] ?? $this->generateAltText($fileName);
        
        // إنشاء كلمات مفتاحية للـ SEO
        $seoKeywords = $this->generateSeoKeywords($imageData['caption'] ?? $fileName);
        
        // حفظ بيانات الصورة في قاعدة البيانات
        $propertyImage = PropertyImage::create([
            'property_id' => $propertyId,
            'url' => $urls['original'],
            'thumbnail_url' => $urls['thumbnail'],
            'medium_url' => $urls['medium'],
            'sort' => $imageData['sort'] ?? 0,
            'isfeatured' => $imageData['isFeatured'] ?? false,
            'altText' => $altText,
            'caption' => $imageData['caption'] ?? null,
            'file_size' => $file->getSize(),
            'dimensions' => [
                'width' => $originalWidth,
                'height' => $originalHeight,
            ],
            'original_filename' => $originalName,
            'mime_type' => $file->getMimeType(),
            'seo_keywords' => $seoKeywords,
        ]);
        
        return $propertyImage;
    }

    /**
     * إنشاء نص بديل تلقائي للـ SEO
     */
    private function generateAltText($fileName)
    {
        // إزالة الامتداد والأحرف الخاصة
        $cleanName = preg_replace('/[^A-Za-z0-9\s]/', '', $fileName);
        
        // تقسيم الاسم إلى كلمات
        $words = explode(' ', $cleanName);
        
        // تحويل الكلمات إلى حالة العنوان
        $formattedWords = array_map(function($word) {
            return ucfirst(strtolower($word));
        }, $words);
        
        // دمج الكلمات مع إضافة كلمات وصفية
        $altText = implode(' ', $formattedWords) . ' property image';
        
        return $altText;
    }

    /**
     * إنشاء كلمات مفتاحية للـ SEO
     */
    private function generateSeoKeywords($caption)
    {
        // قائمة الكلمات الشائعة في العقارات
        $propertyKeywords = [
            'property', 'real estate', 'home', 'house', 'apartment', 'villa', 'land',
            'commercial', 'residential', 'luxury', 'modern', 'spacious', 'furnished',
            'garden', 'pool', 'garage', 'balcony', 'view', 'location'
        ];
        
        // تنظيف النص وإزالة الكلمات الشائعة
        $cleanText = strtolower($caption);
        $cleanText = preg_replace('/[^\p{L}\p{N}\s]/u', '', $cleanText);
        
        // تقسيم النص إلى كلمات
        $words = explode(' ', $cleanText);
        
        // فلترة الكلمات القصيرة وإضافة الكلمات المفتاحية للعقارات
        $keywords = [];
        foreach ($words as $word) {
            if (strlen($word) > 3 && !in_array($word, $keywords)) {
                $keywords[] = $word;
            }
        }
        
        // إضافة بعض الكلمات المفتاحية للعقارات
        foreach ($propertyKeywords as $keyword) {
            if (!in_array($keyword, $keywords)) {
                $keywords[] = $keyword;
            }
        }
        
        // تحديد عدد الكلمات المفتاحية
        $keywords = array_slice($keywords, 0, 10);
        
        // دمج الكلمات المفتاحية
        return implode(',', $keywords);
    }

    /**
     * حذف الصورة وكل الأحجام المرتبطة بها
     */
    public function deleteImage($propertyImage)
    {
        // Initialize Cloudinary
        $this->initializeCloudinary();

        // حذف الصورة من Cloudinary
        if ($propertyImage->url) {
            // استخراج public_id من URL
            $publicId = $this->extractPublicIdFromUrl($propertyImage->url);
            if ($publicId) {
                try {
                    $this->cloudinary->uploadApi()->destroy($publicId);
                } catch (\Exception $e) {
                    // Log error but don't fail the deletion
                    \Log::error('Failed to delete image from Cloudinary: ' . $e->getMessage());
                }
            }
        }
        
        // حذف السجل نهائياً من قاعدة البيانات لضمان التزامن مع Cloudinary
        if (method_exists($propertyImage, 'forceDelete')) {
            $propertyImage->forceDelete();
        } else {
            $propertyImage->delete();
        }
    }

    /**
     * استخراج public_id من Cloudinary URL
     */
    private function extractPublicIdFromUrl($url)
    {
        if (strpos($url, 'cloudinary.com') === false) {
            return null;
        }

        // مثال URL:
        // https://res.cloudinary.com/<cloud>/image/upload/v1727282828/properties/original/property_123_abc_original.jpg
        // المطلوب: properties/original/property_123_abc_original

        $parsed = parse_url($url);
        if (!isset($parsed['path'])) {
            return null;
        }

        // إزالة البادئة حتى "/upload/"
        $path = $parsed['path'];
        $uploadPos = strpos($path, '/upload/');
        if ($uploadPos === false) {
            return null;
        }

        $afterUpload = substr($path, $uploadPos + strlen('/upload/'));

        // إزالة جزء الإصدار إن وجد (مثل v1727282828)
        $segments = array_values(array_filter(explode('/', $afterUpload)));
        if (isset($segments[0]) && preg_match('/^v\d+$/', $segments[0])) {
            array_shift($segments);
        }

        if (empty($segments)) {
            return null;
        }

        // آخر عنصر يحتوي الاسم مع الامتداد؛ نزيل الامتداد
        $filenameWithExt = array_pop($segments);
        $publicIdBase = pathinfo($filenameWithExt, PATHINFO_FILENAME);

        // أعد بناء المسار متضمناً المجلدات
        $publicId = implode('/', $segments);
        if (!empty($publicId)) {
            $publicId .= '/' . $publicIdBase;
        } else {
            $publicId = $publicIdBase;
        }

        return $publicId;
    }
    /**
 * Process and store portfolio image
 */
public function processAndStorePortfolioImage($file, $imageData = [])
{
    // Initialize Cloudinary
    $this->initializeCloudinary();

    // Create unique filename
    $originalName = $file->getClientOriginalName();
    $fileName = pathinfo($originalName, PATHINFO_FILENAME);
    $fileExtension = $file->getClientOriginalExtension();
    $uniqueName = 'portfolio_' . uniqid();

    // Process the main image
    $image = Image::make($file);
    
    // Get original dimensions
    $originalWidth = $image->width();
    $originalHeight = $image->height();
    
    // Upload original image to Cloudinary
    $originalUpload = $this->cloudinary->uploadApi()->upload(
        $file->getRealPath(),
        [
            'public_id' => $uniqueName . '_original',
            'folder' => 'portfolio/original',
            'quality' => 'auto',
            'fetch_format' => 'auto',
        ]
    );
    
    // Portfolio-specific sizes
    $portfolioSizes = [
        'thumbnail' => [
            'width' => 300,
            'height' => 300,
            'quality' => 80,
        ],
        'medium' => [
            'width' => 800,
            'height' => 800,
            'quality' => 85,
        ],
    ];
    
    // Create URLs for different sizes using Cloudinary transformations
    $urls = [
        'original' => $originalUpload['secure_url'],
    ];
    
    foreach ($portfolioSizes as $sizeName => $size) {
        $urls[$sizeName] = $this->cloudinary->image($originalUpload['public_id'])
            ->resize(\Cloudinary\Transformation\Resize::fill($size['width'], $size['height']))
            ->quality('auto')
            ->format('auto')
            ->toUrl();
    }
    
    // Generate alt text automatically if not provided
    $altText = $imageData['altText'] ?? $this->generatePortfolioAltText($fileName);
    
    // Generate SEO keywords
    $seoKeywords = $this->generatePortfolioSeoKeywords($imageData['caption'] ?? $fileName);
    
    // Return processed image data
    return (object)[
        'url' => $urls['original'],
        'thumbnail_url' => $urls['thumbnail'],
        'medium_url' => $urls['medium'],
        'altText' => $altText,
        'caption' => $imageData['caption'] ?? null,
        'file_size' => $file->getSize(),
        'dimensions' => [
            'width' => $originalWidth,
            'height' => $originalHeight,
        ],
        'original_filename' => $originalName,
        'mime_type' => $file->getMimeType(),
        'seo_keywords' => $seoKeywords,
    ];
}

/**
 * Delete portfolio image
 */
public function deletePortfolioImage($portfolioItem)
{
    // Initialize Cloudinary
    $this->initializeCloudinary();

    // Delete image from Cloudinary
    if ($portfolioItem->cover_url) {
        $publicId = $this->extractPublicIdFromUrl($portfolioItem->cover_url);
        if ($publicId) {
            try {
                $this->cloudinary->uploadApi()->destroy($publicId);
            } catch (\Exception $e) {
                \Log::error('Failed to delete portfolio image from Cloudinary: ' . $e->getMessage());
            }
        }
    }
}

/**
 * Generate alt text for portfolio images
 */
private function generatePortfolioAltText($fileName)
{
    // Clean the filename
    $cleanName = preg_replace('/[^A-Za-z0-9\s]/', '', $fileName);
    
    // Split into words
    $words = explode(' ', $cleanName);
    
    // Convert to title case
    $formattedWords = array_map(function($word) {
        return ucfirst(strtolower($word));
    }, $words);
    
    // Combine with descriptive words
    $altText = implode(' ', $formattedWords) . ' portfolio item';
    
    return $altText;
}

/**
 * Generate SEO keywords for portfolio images
 */
private function generatePortfolioSeoKeywords($caption)
{
    // Portfolio-specific keywords
    $portfolioKeywords = [
        'portfolio', 'art', 'decoration', 'canvas', 'sculpture', 'wall art',
        'interior design', 'home decor', 'luxury', 'modern', 'contemporary'
    ];
    
    // Clean the text
    $cleanText = strtolower($caption);
    $cleanText = preg_replace('/[^\p{L}\p{N}\s]/u', '', $cleanText);
    
    // Split into words
    $words = explode(' ', $cleanText);
    
    // Filter short words and add portfolio keywords
    $keywords = [];
    foreach ($words as $word) {
        if (strlen($word) > 3 && !in_array($word, $keywords)) {
            $keywords[] = $word;
        }
    }
    
    // Add portfolio keywords
    foreach ($portfolioKeywords as $keyword) {
        if (!in_array($keyword, $keywords)) {
            $keywords[] = $keyword;
        }
    }
    
    // Limit to 10 keywords
    $keywords = array_slice($keywords, 0, 10);
    
    return implode(',', $keywords);
}
/**
 * Process and store decor request image
 */
public function processAndStoreDecorRequestImage($file, $imageData = [])
{
    // Initialize Cloudinary
    $this->initializeCloudinary();

    // Create unique filename
    $originalName = $file->getClientOriginalName();
    $fileName = pathinfo($originalName, PATHINFO_FILENAME);
    $fileExtension = $file->getClientOriginalExtension();
    $uniqueName = 'decor_' . uniqid();

    // Process the main image
    $image = Image::make($file);
    
    // Get original dimensions
    $originalWidth = $image->width();
    $originalHeight = $image->height();
    
    // Upload original image to Cloudinary
    $originalUpload = $this->cloudinary->uploadApi()->upload(
        $file->getRealPath(),
        [
            'public_id' => $uniqueName . '_original',
            'folder' => 'decor-requests/original',
            'quality' => 'auto',
            'fetch_format' => 'auto',
        ]
    );
    
    // Decor request-specific sizes
    $decorSizes = [
        'thumbnail' => [
            'width' => 300,
            'height' => 300,
            'quality' => 80,
        ],
        'medium' => [
            'width' => 800,
            'height' => 800,
            'quality' => 85,
        ],
    ];
    
    // Create URLs for different sizes using Cloudinary transformations
    $urls = [
        'original' => $originalUpload['secure_url'],
    ];
    
    foreach ($decorSizes as $sizeName => $size) {
        $urls[$sizeName] = $this->cloudinary->image($originalUpload['public_id'])
            ->resize(\Cloudinary\Transformation\Resize::fill($size['width'], $size['height']))
            ->quality('auto')
            ->format('auto')
            ->toUrl();
    }
    
    // Generate alt text automatically if not provided
    $altText = $imageData['altText'] ?? $this->generateDecorRequestAltText($fileName);
    
    // Generate SEO keywords
    $seoKeywords = $this->generateDecorRequestSeoKeywords($imageData['caption'] ?? $fileName);
    
    // Return processed image data
    return (object)[
        'url' => $urls['original'],
        'thumbnail_url' => $urls['thumbnail'],
        'medium_url' => $urls['medium'],
        'altText' => $altText,
        'caption' => $imageData['caption'] ?? null,
        'file_size' => $file->getSize(),
        'dimensions' => [
            'width' => $originalWidth,
            'height' => $originalHeight,
        ],
        'original_filename' => $originalName,
        'mime_type' => $file->getMimeType(),
        'seo_keywords' => $seoKeywords,
    ];
}

/**
 * Delete decor request image
 */
public function deleteDecorRequestImage($decorRequest)
{
    // Initialize Cloudinary
    $this->initializeCloudinary();

    // Delete image from Cloudinary
    if ($decorRequest->image) {
        $publicId = $this->extractPublicIdFromUrl($decorRequest->image);
        if ($publicId) {
            try {
                $this->cloudinary->uploadApi()->destroy($publicId);
            } catch (\Exception $e) {
                \Log::error('Failed to delete decor request image from Cloudinary: ' . $e->getMessage());
            }
        }
    }
}

/**
 * Generate alt text for decor request images
 */
private function generateDecorRequestAltText($fileName)
{
    // Clean the filename
    $cleanName = preg_replace('/[^A-Za-z0-9\s]/', '', $fileName);
    
    // Split into words
    $words = explode(' ', $cleanName);
    
    // Convert to title case
    $formattedWords = array_map(function($word) {
        return ucfirst(strtolower($word));
    }, $words);
    
    // Combine with descriptive words
    $altText = implode(' ', $formattedWords) . ' decor request image';
    
    return $altText;
}

/**
 * Generate SEO keywords for decor request images
 */
private function generateDecorRequestSeoKeywords($caption)
{
    // Decor request-specific keywords
    $decorKeywords = [
        'decor', 'decoration', 'design', 'interior', 'home', 'house',
        'office', 'furniture', 'renovation', 'remodeling', 'style'
    ];
    
    // Clean the text
    $cleanText = strtolower($caption);
    $cleanText = preg_replace('/[^\p{L}\p{N}\s]/u', '', $cleanText);
    
    // Split into words
    $words = explode(' ', $cleanText);
    
    // Filter short words and add decor keywords
    $keywords = [];
    foreach ($words as $word) {
        if (strlen($word) > 3 && !in_array($word, $keywords)) {
            $keywords[] = $word;
        }
    }
    
    // Add decor keywords
    foreach ($decorKeywords as $keyword) {
        if (!in_array($keyword, $keywords)) {
            $keywords[] = $keyword;
        }
    }
    
    // Limit to 10 keywords
    $keywords = array_slice($keywords, 0, 10);
    
    return implode(',', $keywords);
}
}
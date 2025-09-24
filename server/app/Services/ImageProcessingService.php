<?php

namespace App\Services;

use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\PropertyImage;

class ImageProcessingService
{
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
        // إنشاء اسم فريد للملف
        $originalName = $file->getClientOriginalName();
        $fileName = pathinfo($originalName, PATHINFO_FILENAME);
        $fileExtension = $file->getClientOriginalExtension();
        $uniqueName = $fileName . '-' . uniqid() . '.' . $fileExtension;

        // معالجة الصورة الأساسية
        $image = Image::make($file);
        
        // الحصول على أبعاد الصورة الأصلية
        $originalWidth = $image->width();
        $originalHeight = $image->height();
        
        // ضغط الصورة مع الحفاظ على الجودة
        $image->encode($fileExtension, 85);
        
        // حفظ الصورة الأصلية
        $originalPath = $file->storeAs('properties/original', $uniqueName, 'public');
        
        // إنشاء الصور بحجم مختلف
        $paths = [
            'original' => $originalPath,
        ];
        
        foreach ($this->sizes as $sizeName => $size) {
            $resizedImage = Image::make($file);
            
            // الحفاظ على نسبة الأبعاد
            $resizedImage->resize($size['width'], $size['height'], function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            
            // ضغط الصورة
            $resizedImage->encode($fileExtension, $size['quality']);
            
            // حفظ الصورة
            $path = "properties/{$sizeName}/" . $uniqueName;
            Storage::disk('public')->put($path, $resizedImage);
            $paths[$sizeName] = $path;
        }
        
        // إنشاء نص بديل تلقائي للـ SEO إذا لم يتم توفيره
        $altText = $imageData['altText'] ?? $this->generateAltText($fileName);
        
        // إنشاء كلمات مفتاحية للـ SEO
        $seoKeywords = $this->generateSeoKeywords($imageData['caption'] ?? $fileName);
        
        // حفظ بيانات الصورة في قاعدة البيانات
        $propertyImage = PropertyImage::create([
            'property_id' => $propertyId,
            'url' => $paths['original'],
            'thumbnail_url' => $paths['thumbnail'],
            'medium_url' => $paths['medium'],
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
        // حذف الملفات من التخزين
        $paths = [
            $propertyImage->url,
            $propertyImage->thumbnail_url,
            $propertyImage->medium_url,
        ];
        
        foreach ($paths as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }
        
        // حذف السجل من قاعدة البيانات
        $propertyImage->delete();
    }
    /**
 * Process and store portfolio image
 */
public function processAndStorePortfolioImage($file, $imageData = [])
{
    // Create unique filename
    $originalName = $file->getClientOriginalName();
    $fileName = pathinfo($originalName, PATHINFO_FILENAME);
    $fileExtension = $file->getClientOriginalExtension();
    $uniqueName = $fileName . '-' . uniqid() . '.' . $fileExtension;

    // Process the main image
    $image = Image::make($file);
    
    // Get original dimensions
    $originalWidth = $image->width();
    $originalHeight = $image->height();
    
    // Compress the image while maintaining quality
    $image->encode($fileExtension, 85);
    
    // Save the original image
    $originalPath = $file->storeAs('portfolio/original', $uniqueName, 'public');
    
    // Create different sizes
    $paths = [
        'original' => $originalPath,
    ];
    
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
    
    foreach ($portfolioSizes as $sizeName => $size) {
        $resizedImage = Image::make($file);
        
        // Maintain aspect ratio
        $resizedImage->resize($size['width'], $size['height'], function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        
        // Compress the image
        $resizedImage->encode($fileExtension, $size['quality']);
        
        // Save the image
        $path = "portfolio/{$sizeName}/" . $uniqueName;
        Storage::disk('public')->put($path, $resizedImage);
        $paths[$sizeName] = $path;
    }
    
    // Generate alt text automatically if not provided
    $altText = $imageData['altText'] ?? $this->generatePortfolioAltText($fileName);
    
    // Generate SEO keywords
    $seoKeywords = $this->generatePortfolioSeoKeywords($imageData['caption'] ?? $fileName);
    
    // Return processed image data
    return (object)[
        'url' => $paths['original'],
        'thumbnail_url' => $paths['thumbnail'],
        'medium_url' => $paths['medium'],
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
    // Delete files from storage
    $paths = [
        $portfolioItem->cover_url,
        $portfolioItem->thumbnail_url,
        $portfolioItem->medium_url,
    ];
    
    foreach ($paths as $path) {
        if ($path) {
            Storage::disk('public')->delete($path);
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
    // Create unique filename
    $originalName = $file->getClientOriginalName();
    $fileName = pathinfo($originalName, PATHINFO_FILENAME);
    $fileExtension = $file->getClientOriginalExtension();
    $uniqueName = $fileName . '-' . uniqid() . '.' . $fileExtension;

    // Process the main image
    $image = Image::make($file);
    
    // Get original dimensions
    $originalWidth = $image->width();
    $originalHeight = $image->height();
    
    // Compress the image while maintaining quality
    $image->encode($fileExtension, 85);
    
    // Save the original image
    $originalPath = $file->storeAs('decor-requests/original', $uniqueName, 'public');
    
    // Create different sizes
    $paths = [
        'original' => $originalPath,
    ];
    
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
    
    foreach ($decorSizes as $sizeName => $size) {
        $resizedImage = Image::make($file);
        
        // Maintain aspect ratio
        $resizedImage->resize($size['width'], $size['height'], function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        
        // Compress the image
        $resizedImage->encode($fileExtension, $size['quality']);
        
        // Save the image
        $path = "decor-requests/{$sizeName}/" . $uniqueName;
        Storage::disk('public')->put($path, $resizedImage);
        $paths[$sizeName] = $path;
    }
    
    // Generate alt text automatically if not provided
    $altText = $imageData['altText'] ?? $this->generateDecorRequestAltText($fileName);
    
    // Generate SEO keywords
    $seoKeywords = $this->generateDecorRequestSeoKeywords($imageData['caption'] ?? $fileName);
    
    // Return processed image data
    return (object)[
        'url' => $paths['original'],
        'thumbnail_url' => $paths['thumbnail'],
        'medium_url' => $paths['medium'],
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
    // Delete files from storage
    $paths = [
        $decorRequest->image,
        $decorRequest->thumbnail_url,
        $decorRequest->medium_url,
    ];
    
    foreach ($paths as $path) {
        if ($path) {
            Storage::disk('public')->delete($path);
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
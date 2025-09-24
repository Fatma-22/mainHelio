<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Services\ImageProcessingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PortfolioController extends Controller
{
    protected $imageService;

    public function __construct(ImageProcessingService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index(Request $request)
    {
        $portfolioItems = PortfolioItem::all();
    
        $lastModified = $portfolioItems->max('updated_at') ?? now();
        $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // التحقق من If-Modified-Since
        $ifModifiedSince = $request->header('If-Modified-Since');
        if ($ifModifiedSince && strtotime($ifModifiedSince) >= strtotime($lastModified)) {
            return response()->noContent(304); // بيانات ما اتغيرتش
        }
    
        // تحويل روابط الصور
        $portfolioItems->transform(function ($item) {
            if ($item->cover_url) {
                $item->cover_url = $this->getFullImageUrl($item->cover_url);
                $item->thumbnail_url = $this->getFullImageUrl($item->thumbnail_url);
                $item->medium_url = $this->getFullImageUrl($item->medium_url);
            }
            return $item;
        });
    
        return response()->json($portfolioItems)
            ->header('Last-Modified', $lastModifiedGMT)
            ->header('Cache-Control', 'public, max-age=0');
    }

    public function show(Request $request, $id)
    {
        $portfolioItem = PortfolioItem::findOrFail($id);
        $lastModified = $portfolioItem->updated_at;
        $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        $ifModifiedSince = $request->header('If-Modified-Since');
        if ($ifModifiedSince && strtotime($ifModifiedSince) >= strtotime($lastModified)) {
            return response()->noContent(304);
        }
    
        // تحويل روابط الصور
        if ($portfolioItem->cover_url) {
            $portfolioItem->cover_url = $this->getFullImageUrl($portfolioItem->cover_url);
            $portfolioItem->thumbnail_url = $this->getFullImageUrl($portfolioItem->thumbnail_url);
            $portfolioItem->medium_url = $this->getFullImageUrl($portfolioItem->medium_url);
        }
    
        return response()->json($portfolioItem)
            ->header('Last-Modified', $lastModifiedGMT)
            ->header('Cache-Control', 'public, max-age=0');
    }

    /**
     * Store a newly created portfolio item with a single image.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'title_en' => 'sometimes|string|max:255',
            'type' => 'required|in:لوحات كانفس,تحف ديكورية,منحوتات جدارية,تشطيبات',
            'description' => 'required|string',
            'description_en' => 'sometimes|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'altText' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Handle image upload using the service
            $image = $request->file('image');
            $imageData = [
                'altText' => $request->altText,
                'caption' => $request->caption,
            ];
            
            // Process and store the image
            $processedImage = $this->imageService->processAndStorePortfolioImage($image, $imageData);

            $portfolioItem = PortfolioItem::create([
                'title_ar' => $request->title,
                'title_en' => $request->title_en,
                'type' => $request->type,
                'description_ar' => $request->description,
                'description_en' => $request->description_en,
                'cover_url' => $processedImage->url,
                'thumbnail_url' => $processedImage->thumbnail_url,
                'medium_url' => $processedImage->medium_url,
                'altText' => $processedImage->altText,
                'caption' => $processedImage->caption,
                'file_size' => $processedImage->file_size,
                'dimensions' => $processedImage->dimensions,
                'original_filename' => $processedImage->original_filename,
                'mime_type' => $processedImage->mime_type,
                'seo_keywords' => $processedImage->seo_keywords,
            ]);

            // Convert URLs to full URLs
            $portfolioItem->cover_url = $this->getFullImageUrl($portfolioItem->cover_url);
            $portfolioItem->thumbnail_url = $this->getFullImageUrl($portfolioItem->thumbnail_url);
            $portfolioItem->medium_url = $this->getFullImageUrl($portfolioItem->medium_url);

            return response()->json([
                'message' => 'تم إنشاء عنصر المعرض بنجاح',
                'portfolio_item' => $portfolioItem,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء إنشاء عنصر المعرض',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified portfolio item with a single image.
     */
    public function update(Request $request, $id)
    {
        $portfolioItem = PortfolioItem::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title_ar' => 'sometimes|required|string|max:255',
            'title_en' => 'sometimes|string|max:255',
            'type' => 'required|in:لوحات كانفس,تحف ديكورية,منحوتات جدارية,تشطيبات',
            'description_ar' => 'sometimes|required|string',
            'description_en' => 'sometimes|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:5120',
            'altText' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Handle image update
            if ($request->hasFile('image')) {
                // Delete old images using the service
                if ($portfolioItem->cover_url) {
                    $this->imageService->deletePortfolioImage($portfolioItem);
                }
            
                // Process and store the new image
                $image = $request->file('image');
                $imageData = [
                    'altText' => $request->altText ?? $portfolioItem->altText,
                    'caption' => $request->caption ?? $portfolioItem->caption,
                ];
                
                $processedImage = $this->imageService->processAndStorePortfolioImage($image, $imageData);
                
                // Update image fields
                $portfolioItem->cover_url = $processedImage->url;
                $portfolioItem->thumbnail_url = $processedImage->thumbnail_url;
                $portfolioItem->medium_url = $processedImage->medium_url;
                $portfolioItem->altText = $processedImage->altText;
                $portfolioItem->caption = $processedImage->caption;
                $portfolioItem->file_size = $processedImage->file_size;
                $portfolioItem->dimensions = $processedImage->dimensions;
                $portfolioItem->original_filename = $processedImage->original_filename;
                $portfolioItem->mime_type = $processedImage->mime_type;
                $portfolioItem->seo_keywords = $processedImage->seo_keywords;
            } else {
                // Update only alt text and caption if no new image
                $portfolioItem->altText = $request->altText ?? $portfolioItem->altText;
                $portfolioItem->caption = $request->caption ?? $portfolioItem->caption;
            }

            // Update text fields
            $portfolioItem->title_ar = $request->title_ar ?? $portfolioItem->title_ar;
            $portfolioItem->title_en = $request->title_en ?? $portfolioItem->title_en;
            $portfolioItem->type = $request->type ?? $portfolioItem->type;
            $portfolioItem->description_ar = $request->description_ar ?? $portfolioItem->description_ar;
            $portfolioItem->description_en = $request->description_en ?? $portfolioItem->description_en;

            $portfolioItem->save();

            // Convert URLs to full URLs
            $portfolioItem->cover_url = $this->getFullImageUrl($portfolioItem->cover_url);
            $portfolioItem->thumbnail_url = $this->getFullImageUrl($portfolioItem->thumbnail_url);
            $portfolioItem->medium_url = $this->getFullImageUrl($portfolioItem->medium_url);

            return response()->json([
                'message' => 'تم تحديث عنصر المعرض بنجاح',
                'portfolio_item' => $portfolioItem,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء تحديث عنصر المعرض',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified portfolio item and its image.
     */
    public function destroy($id)
    {
        $portfolioItem = PortfolioItem::findOrFail($id);
        
        try {
            // Delete image using the service
            if ($portfolioItem->cover_url) {
                $this->imageService->deletePortfolioImage($portfolioItem);
            }
            
            // Delete related records
            $portfolioItem->decorRequests()->delete();
            
            // Delete the item itself
            $portfolioItem->delete();
            
            // Update last modified time
            if (PortfolioItem::count() > 0) {
                $randomItem = PortfolioItem::inRandomOrder()->first();
                $randomItem->touch();
            }
            
            $portfolioItems = PortfolioItem::all();
            $lastModified = $portfolioItems->max('updated_at') ?? now();
            $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
            
            return response()->json([
                'message' => 'تم حذف عنصر المعرض بنجاح',
                'id' => $id
            ])
            ->header('Last-Modified', $lastModifiedGMT)
            ->header('Cache-Control', 'no-cache, must-revalidate');
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء حذف عنصر المعرض',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload a single image and return its URL.
     */
    public function uploadImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'altText' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $image = $request->file('image');
            $imageData = [
                'altText' => $request->altText,
                'caption' => $request->caption,
            ];
            
            // Process and store the image
            $processedImage = $this->imageService->processAndStorePortfolioImage($image, $imageData);
            
            // Convert URLs to full URLs
            $processedImage->url = $this->getFullImageUrl($processedImage->url);
            $processedImage->thumbnail_url = $this->getFullImageUrl($processedImage->thumbnail_url);
            $processedImage->medium_url = $this->getFullImageUrl($processedImage->medium_url);

            return response()->json([
                'message' => 'تم رفع الصورة بنجاح',
                'image' => $processedImage,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء رفع الصورة',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper function to get full image URL
     */
    private function getFullImageUrl($path)
    {
        if (!$path) return null;
        if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) return $path;
        
        return url('storage/' . $path);
    }
}
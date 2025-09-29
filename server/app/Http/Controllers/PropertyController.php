<?php
namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Amenity;
use App\Models\Staff;
use App\Services\ImageProcessingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller
{
    protected $imageService;

    public function __construct(ImageProcessingService $imageService)
    {
        $this->imageService = $imageService;
    }

        // دالة مساعدة لتحويل المسار الجزئي إلى رابط كامل
        private function getFullImageUrl($path)
        {
            if (!$path) return null;
            if (strpos($path, 'http://') === 0 || strpos($path, 'https://') === 0) return $path;
        
            // لا حاجة لتعديل المسار لأننا نخزن المسار الكامل بالفعل
            return url('storage/' . $path);
        }
        
    public function index(Request $request)
    {
        $query = Property::with(['images', 'amenities', 'staff'])
            ->where('is_published', true);
    
        // filters
        if ($request->has('type')) $query->where('type', $request->type);
        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('finish')) $query->where('finish', $request->finish);
        if ($request->has('min_price')) $query->where('price', '>=', $request->min_price);
        if ($request->has('max_price')) $query->where('price', '<=', $request->max_price);
        if ($request->has('bedrooms')) $query->where('bedrooms', $request->bedrooms);
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title_ar', 'like', "%$search%")
                  ->orWhere('title_en', 'like', "%$search%")
                  ->orWhere('desc_ar', 'like', "%$search%")
                  ->orWhere('desc_en', 'like', "%$search%");
            });
        }
    
        $properties = $query->get();
    
        // ⬇️ آخر تعديل لأي property
        $lastModified = $properties->max('updated_at');
        $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // ⬇️ لو العميل بعت If-Modified-Since و الداتا ما اتغيرتش → رجّع 304
        if ($request->headers->has('If-Modified-Since')) {
            $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
            if (strtotime($lastModified) <= $ifModifiedSince) {
                return response()->noContent(304);
            }
        }
     
        $properties->transform(function ($property) {
            if ($property->images) {
                $property->images->transform(function ($image) {
                    $image->url = $this->getFullImageUrl($image->url);
                    $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
                    $image->medium_url = $this->getFullImageUrl($image->medium_url);
                    return $image;
                });
            }
            return $property;
        });
    
        return response()->json($properties)
            ->header('Last-Modified', $lastModifiedHeader)
            ->header('Cache-Control', 'public, max-age=0');
    }

    public function show(Request $request, $id)
    {
        $property = Property::with(['images', 'amenities', 'staff', 'reviews'])
            ->where('is_published', true)
            ->findOrFail($id);
    
        $lastModified = $property->updated_at;
        $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // نفس فكرة 304
        if ($request->headers->has('If-Modified-Since')) {
            $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
            if (strtotime($lastModified) <= $ifModifiedSince) {
                return response()->noContent(304);
            }
        }

        if ($property->images) {
            $property->images->transform(function ($image) {
                $image->url = $this->getFullImageUrl($image->url);
                $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
                $image->medium_url = $this->getFullImageUrl($image->medium_url);
                return $image;
            });
        }
        
        return response()->json($property)
            ->header('Last-Modified', $lastModifiedHeader)
            ->header('Cache-Control', 'public, max-age=0');
    }

    public function store(Request $request)
    {
        $staff = Auth::guard('staff')->user();
        if (!$staff) return response()->json(['message' => 'Unauthorized - Staff access required'], 401);
        // 🟢 حوّل كل isFeatured لـ Boolean قبل الفاليديشن
        if ($request->has('imagesData')) {
                        $imagesData = $request->input('imagesData');
                        foreach ($imagesData as $key => $imageData) {
                            if (isset($imageData['isFeatured'])) {
                                $imagesData[$key]['isFeatured'] = filter_var($imageData['isFeatured'], FILTER_VALIDATE_BOOLEAN);
                            }
                        }
                        $request->merge(['imagesData' => $imagesData]);
            }


        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'title_en' => 'sometimes|string|max:255',
            'description' => 'required|string',
            'desc_en' => 'sometimes|string',
            'price' => 'required|numeric|min:0',
            'area' => 'sometimes|numeric|min:0',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'type' => 'required|in:شقة,فيلا,ارض,تجاري',
            'status' => 'sometimes|required|in:للبيع,للإيجار,مباع,مؤجر',
            'finish' => 'nullable|in:تشطيب كامل,نص تشطيب,على الطوب',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'address' => 'required|string|max:255',
            'is_listed' => 'sometimes|boolean',
            'listing_end_date' => 'sometimes|date',
            'google_maps_url' => 'nullable|string|max:255',
            'amenities' => 'nullable|array',
            'amenities.*' => 'exists:amenities,id',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,bmp,webp|max:5120', // زيادة الحد الأقصى للحجم
            'imagesData' => 'nullable|array',
            'imagesData.*.sort' => 'nullable|integer',
            'imagesData.*.isFeatured' => 'nullable|boolean',
            'imagesData.*.altText' => 'nullable|string|max:255',
            'imagesData.*.caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $property = Property::create([
            'title_ar' => $request->title,
            'title_en' => $request->title_en,
            'desc_ar' => $request->description,
            'desc_en' => $request->desc_en,
            'price' => $request->price,
            'area' => $request->area,
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'type' => $request->type,
            'status' => $request->status ?? 'للبيع',
            'finish' => $request->finish,
            'lat' => $request->latitude,
            'lng' => $request->longitude,
            'address' => $request->address,
            'is_published' => true,
            'is_listed' => filter_var($request->isListed, FILTER_VALIDATE_BOOLEAN),
            'listing_end_date' => $request->listingEndDate,
            'google_maps_url' => $request->googleMapsUrl,
            'created_by' => $staff->id,
            'created_at' => now(),
        ]);

        if ($request->has('amenities')) $property->amenities()->sync($request->amenities);

        // رفع الصور مباشرة للـ admin أو صاحب العقار
        if ($request->hasFile('images')) {
            $imagesData = $request->input('imagesData', []);
            
            foreach ($request->file('images') as $index => $image) {
                // الحصول على بيانات الصورة المرتبطة
                $imageData = $imagesData[$index] ?? [];
                
                // معالجة الصورة وحفظها باستخدام الخدمة
                $this->imageService->processAndStoreImage($image, $property->id, $imageData);
            }
        }

        // تحميل جميع الصور وتحويلها
        $property->load('images');
        if ($property->images) {
            $property->images->transform(function ($image) {
                $image->url = $this->getFullImageUrl($image->url);
                $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
                $image->medium_url = $this->getFullImageUrl($image->medium_url);
                return $image;
            });
        }

        return response()->json([
            'message' => 'Property created successfully',
            'property' => $property->load('amenities'),
        ], 201);
    }

    public function update(Request $request, $id)
{
    $property = Property::findOrFail($id);
    $staff = Auth::guard('staff')->user();
    if (!$staff) return response()->json(['message' => 'Unauthorized - Staff access required'], 401);
    if ($property->created_by !== $staff->id && $staff->role_id !== 1) {
        return response()->json(['message' => 'Unauthorized - You can only edit your own properties'], 403);
    }
    
    // تحويل isFeatured و _destroy إلى boolean قبل الفاليديشن
    if ($request->has('imagesData')) {
        $imagesData = $request->input('imagesData');
        if (is_array($imagesData)) {
            foreach ($imagesData as $key => $imageData) {
                if (isset($imageData['isFeatured'])) {
                    $imagesData[$key]['isFeatured'] = filter_var($imageData['isFeatured'], FILTER_VALIDATE_BOOLEAN);
                }
                if (isset($imageData['_destroy'])) {
                    $imagesData[$key]['_destroy'] = filter_var($imageData['_destroy'], FILTER_VALIDATE_BOOLEAN);
                }
            }
            $request->merge(['imagesData' => $imagesData]);
        }
    }
    
       $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'title_en' => 'sometimes|string|max:255',
        'description' => 'required|string',
        'desc_en' => 'sometimes|string',
        'price' => 'required|numeric|min:0',
        'area' => 'sometimes|numeric|min:0',
        'bedrooms' => 'nullable|integer|min:0',
        'bathrooms' => 'nullable|integer|min:0',
        'type' => 'required|in:شقة,فيلا,ارض,تجاري',
        'status' => 'sometimes|required|in:للبيع,للإيجار,مباع,مؤجر',
        'finish' => 'nullable|in:تشطيب كامل,نص تشطيب,على الطوب',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
        'address' => 'required|string|max:255',
        'is_published' => 'sometimes|boolean',
        'is_listed' => 'sometimes|boolean',
        'listing_end_date' => 'sometimes|date',
        'google_maps_url' => 'nullable|string|max:255',
        'amenities' => 'nullable|array',
        'amenities.*' => 'exists:amenities,id',
        'images' => 'nullable|array',
        'images.*' => 'image|mimes:jpeg,jpg,png,gif,bmp,webp|max:5120',
        'imagesData' => 'nullable|array',
        'imagesData.*.id' => 'nullable|integer', // تغيير إلى nullable
        'imagesData.*.sort' => 'nullable|integer',
        'imagesData.*.isFeatured' => 'nullable|boolean',
        'imagesData.*.altText' => 'nullable|string|max:255',
        'imagesData.*.caption' => 'nullable|string|max:255',
        'imagesData.*._destroy' => 'nullable|boolean', // تغيير إلى nullable
    ]);
    
    if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);
    
    $updateData = [
        'title_ar' => $request->title ?? $property->title_ar,
        'title_en' => $request->title_en ?? $property->title_en,
        'desc_ar' => $request->description ?? $property->desc_ar,
        'desc_en' => $request->desc_en ?? $property->desc_en,
        'price' => $request->price ?? $property->price,
        'area' => $request->area ?? $property->area,
        'bedrooms' => $request->bedrooms ?? $property->bedrooms,
        'bathrooms' => $request->bathrooms ?? $property->bathrooms,
        'type' => $request->type ?? $property->type,
        'status' => $request->status ?? $property->status,
        'finish' => $request->finish ?? $property->finish,
        'lat' => $request->latitude ?? $property->lat,
        'lng' => $request->longitude ?? $property->lng,
        'address' => $request->address ?? $property->address,
        'is_published' => $request->is_published ?? $property->is_published,
        'is_listed' => filter_var($request->isListed, FILTER_VALIDATE_BOOLEAN),
        'listing_end_date' => $request->listingEndDate ?? $property->listing_end_date,
        'google_maps_url' => $request->googleMapsUrl ?? $property->googleMapsUrl,
        'updated_by' => $staff->id,
    ];
    
    $property->update($updateData);
    
    // معالجة الصور الموجودة (تحديث أو حذف) + حذف الصور غير المستخدمة
    if ($request->has('imagesData')) {
        $imagesData = $request->input('imagesData');

        // 1) حدّث/احذف الصور المذكورة صراحة في imagesData
        foreach ($imagesData as $imageData) {
            // إذا كانت الصورة محذوفة
            if (isset($imageData['_destroy']) && $imageData['_destroy']) {
                if (isset($imageData['id'])) {
                    $image = PropertyImage::find($imageData['id']);
                    if ($image) {
                        $this->imageService->deleteImage($image);
                    }
                }
                continue;
            }

            // إذا كانت الصورة موجودة مسبقاً
            if (isset($imageData['id'])) {
                $image = PropertyImage::find($imageData['id']);
                if ($image) {
                    $image->update([
                        'sort' => $imageData['sort'] ?? 0,
                        'isfeatured' => filter_var($imageData['isFeatured'], FILTER_VALIDATE_BOOLEAN),
                        'altText' => $imageData['altText'] ?? '',
                        'caption' => $imageData['caption'] ?? '',
                    ]);
                }
            }
        }

        // 2) احذف أي صور موجودة في قاعدة البيانات وليست ضمن imagesData (غير مستخدمة)
        $keepIds = collect($imagesData)
            ->filter(function ($item) {
                return isset($item['id']) && empty($item['_destroy']);
            })
            ->pluck('id')
            ->all();

        $orphanImages = PropertyImage::where('property_id', $property->id)
            ->when(!empty($keepIds), function ($q) use ($keepIds) {
                $q->whereNotIn('id', $keepIds);
            }, function ($q) {
                // إذا لم توجد أي معرفات للحفظ، احذف كل الصور
                return $q; 
            })
            ->get();

        foreach ($orphanImages as $orphan) {
            $this->imageService->deleteImage($orphan);
        }
    }
    
    // رفع الصور الجديدة
    if ($request->hasFile('images')) {
        $imagesData = $request->input('imagesData', []);
        $newImagesIndex = 0; // مؤشر للصور الجديدة
        
        foreach ($request->file('images') as $image) {
            // الحصول على بيانات الصورة المرتبطة
            // نبحث عن أول عنصر في imagesData ليس له id (يعني أنه صورة جديدة)
            $imageData = null;
            for ($i = $newImagesIndex; $i < count($imagesData); $i++) {
                if (!isset($imagesData[$i]['id']) || empty($imagesData[$i]['id'])) {
                    $imageData = $imagesData[$i];
                    $newImagesIndex = $i + 1;
                    break;
                }
            }
            
            // إذا لم نجد بيانات للصورة، نستخدم بيانات فارغة
            if (!$imageData) {
                $imageData = [];
            }
            
            // معالجة الصورة وحفظها
            $this->imageService->processAndStoreImage($image, $property->id, $imageData);
        }
    }
    
    if ($request->has('amenities')) $property->amenities()->sync($request->amenities);
    
    // تحميل جميع الصور وتحويلها
    $property->load('images');
    if ($property->images) {
        $property->images->transform(function ($image) {
            $image->url = $this->getFullImageUrl($image->url);
            $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
            $image->medium_url = $this->getFullImageUrl($image->medium_url);
            return $image;
        });
    }

    return response()->json([
        'message' => 'Property updated successfully',
        'property' => $property->load('amenities'),
    ]);
}

    public function destroy($id)
    {
        try {
            $property = Property::findOrFail($id);
            $staff = Auth::guard('staff')->user();
            if (!$staff) {
                return response()->json(['message' => 'Unauthorized - Staff access required'], 401);
            }

            if ($property->created_by !== $staff->id && $staff->role_id !== 1) {
                return response()->json(['message' => 'Unauthorized - You can only delete your own properties'], 403);
            }

            // حذف الصور المرتبطة بالعقار باستخدام الخدمة
            if ($property->images) {
                foreach ($property->images as $image) {
                    $this->imageService->deleteImage($image);
                }
            }

            // حذف العلاقات مع المرافق
            $property->amenities()->detach();

            // حذف العقار نفسه
            $property->delete();

            // تحديث وقت التعديل لعقار عشوائي لتحديث الـ Last-Modified
            if (Property::count() > 0) {
                $randomProperty = Property::inRandomOrder()->first();
                $randomProperty->touch();
            }

            // جلب العقارات المتبقية بعد الحذف لتحديث الـ Last-Modified
            $properties = Property::all();
            $lastModified = $properties->max('updated_at') ?? now();
            $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';

            return response()->json([
                'message' => 'تم حذف العقار بنجاح',
                'id' => $id
            ])
            ->header('Last-Modified', $lastModifiedGMT)
            ->header('Cache-Control', 'no-cache, must-revalidate');

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء حذف العقار',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function uploadImages(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        $staff = Auth::guard('staff')->user();
        if (!$staff) return response()->json(['message' => 'Unauthorized - Staff access required'], 401);

        // Admin can upload to any property
        if ($property->created_by !== $staff->id && $staff->role_id !== 1 && !$staff->is_admin) {
            return response()->json(['message' => 'Unauthorized - You can only upload images to your own properties'], 403);
        }

        $validator = Validator::make($request->all(), [
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,bmp,webp|max:5120', // زيادة الحد الأقصى للحجم
            'imagesData' => 'required|array',
            'imagesData.*.sort' => 'nullable|integer',
            'imagesData.*.isFeatured' => 'nullable|boolean',
            'imagesData.*.altText' => 'nullable|string|max:255',
            'imagesData.*.caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $uploadedImages = [];
        $imagesData = $request->input('imagesData', []);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                // الحصول على بيانات الصورة المرتبطة
                $imageData = $imagesData[$index] ?? [];
                
                // معالجة الصورة وحفظها باستخدام الخدمة
                $propertyImage = $this->imageService->processAndStoreImage($image, $property->id, $imageData);
                
                // تحويل الروابط للصور
                $propertyImage->url = $this->getFullImageUrl($propertyImage->url);
                $propertyImage->thumbnail_url = $this->getFullImageUrl($propertyImage->thumbnail_url);
                $propertyImage->medium_url = $this->getFullImageUrl($propertyImage->medium_url);
                
                $uploadedImages[] = $propertyImage;
            }
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'images' => $uploadedImages,
        ], 201);
    }

    public function syncAmenities(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        $staff = Auth::guard('staff')->user();
        if (!$staff) return response()->json(['message' => 'Unauthorized - Staff access required'], 401);

        if ($property->created_by !== $staff->id && $staff->role_id !== 1 && !$staff->is_admin) {
            return response()->json(['message' => 'Unauthorized - You can only manage amenities of your own properties'], 403);
        }

        $validator = Validator::make($request->all(), [
            'amenities' => 'required|array',
            'amenities.*' => 'exists:amenities,id',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $property->amenities()->sync($request->amenities);

        // تحميل جميع الصور وتحويلها
        $property->load('images');
        if ($property->images) {
            $property->images->transform(function ($image) {
                $image->url = $this->getFullImageUrl($image->url);
                $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
                $image->medium_url = $this->getFullImageUrl($image->medium_url);
                return $image;
            });
        }

        return response()->json([
            'message' => 'Amenities synced successfully',
            'property' => $property->load('amenities'),
        ]);
    }
    
    public function updateImageMetadata(Request $request, $propertyId, $imageId)
    {
        $property = Property::findOrFail($propertyId);
        $staff = Auth::guard('staff')->user();
        if (!$staff) return response()->json(['message' => 'Unauthorized - Staff access required'], 401);

        if ($property->created_by !== $staff->id && $staff->role_id !== 1 && !$staff->is_admin) {
            return response()->json(['message' => 'Unauthorized - You can only edit your own properties'], 403);
        }

        $image = PropertyImage::where('property_id', $propertyId)->findOrFail($imageId);

        $validator = Validator::make($request->all(), [
            'sort' => 'nullable|integer',
            'isFeatured' => 'nullable|boolean',
            'altText' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

        $image->update([
            'sort' => $request->sort ?? $image->sort,
            'isfeatured' => $request->isFeatured ?? $image->isfeatured,
            'altText' => $request->altText ?? $image->alt_text,
            'caption' => $request->caption ?? $image->caption,
        ]);

        // تحويل جميع روابط الصور
        $image->url = $this->getFullImageUrl($image->url);
        $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
        $image->medium_url = $this->getFullImageUrl($image->medium_url);

        return response()->json([
            'message' => 'Image metadata updated successfully',
            'image' => $image,
        ]);
    }
    
    public function deleteImage($propertyId, $imageId)
    {
        $property = Property::findOrFail($propertyId);
        $staff = Auth::guard('staff')->user();
        if (!$staff) return response()->json(['message' => 'Unauthorized - Staff access required'], 401);

        if ($property->created_by !== $staff->id && $staff->role_id !== 1 && !$staff->is_admin) {
            return response()->json(['message' => 'Unauthorized - You can only edit your own properties'], 403);
        }

        $image = PropertyImage::where('property_id', $propertyId)->findOrFail($imageId);

        // حذف الصورة باستخدام الخدمة
        $this->imageService->deleteImage($image);

        return response()->json([
            'message' => 'Image deleted successfully',
            'id' => $imageId
        ]);
    }
}
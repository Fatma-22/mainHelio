<?php
// app/Http/Controllers/PropertyRequestController.php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Services\ImageProcessingService;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


class PropertyRequestController extends Controller
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
    private function getPropertyVideos($propertyId)
    {
        // جلب فيديوهات العقار من جدول property_videos
        return DB::table('property_videos')
            ->select('id', 'property_id', 'video_url', 'thumbnail_url')
            ->where('property_id', $propertyId)
            ->get()
            ->map(function ($video) {
                // thumbnail_url قد يكون null أو رابط نسبي
                if ($video->thumbnail_url && !preg_match('#^https?://#', $video->thumbnail_url)) {
                    $video->thumbnail_url = url('storage/' . $video->thumbnail_url);
                }
                return $video;
            })
            ->values();
    }


        public function index(Request $request)
    {
        // الحصول على آخر وقت تعديل للعقارات غير المنشورة
        $lastModified = Property::where('is_published', true)->max('updated_at');
        $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // التحقق إذا كان العميل لديه نسخة مخزنة
        if ($request->headers->has('If-Modified-Since')) {
            $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
            if (strtotime($lastModified) <= $ifModifiedSince) {
                return response()->noContent(304);
            }
        }
    
        $requests = Property::where('is_published', false)
            ->with(['requestedByCustomer:id,name,phone', 'images'])
            ->get();
        
       $requests->transform(function ($property) {
        $property->requesterName = $property->requestedByCustomer->name ?? null;
        $property->requesterPhone = $property->requestedByCustomer->phone ?? null;
        if ($property->images) {
            $property->images->transform(function ($image) {
                $image->url = $this->getFullImageUrl($image->url);
                $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
                $image->medium_url = $this->getFullImageUrl($image->medium_url);
                return $image;
            });
        }

        // إضافة الفيديوهات
        $property->videos = $this->getPropertyVideos($property->id);

        return $property;
    });

    
        return response()->json(['data' => $requests])
            ->header('Last-Modified', $lastModifiedHeader)
            ->header('Cache-Control', 'public, max-age=0');
    }
    // approve
public function approve($id)
{
    $property = Property::where('id', $id)
                        ->where('is_published', false)
                        ->firstOrFail();

    $property->update([
        'is_published' => true,
        'created_by' => auth()->id(),
        'created_at' => now(),
        'updated_at'=>now(),
    ]);

    // تحميل الصور وتحويل الروابط
    $property->load('images');
    if ($property->images) {
        $property->images->transform(function ($image) {
            $image->url = $this->getFullImageUrl($image->url);
            $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
            $image->medium_url = $this->getFullImageUrl($image->medium_url);
            return $image;
        });
    }
        // إضافة الفيديوهات
        $property->videos = $this->getPropertyVideos($property->id);

    return response()->json(['property' => $property]);
}
    
    

    // reject
  public function reject($id)
{
    try {
        $property = Property::where('id', $id)
                            ->where('is_published', false)
                            ->firstOrFail();

        // حذف الصور المرتبطة بالعقار باستخدام الخدمة
        if ($property->images) {
            foreach ($property->images as $image) {
                $this->imageService->deleteImage($image);
            }
        }

        // حذف العلاقات مع المرافق إذا وجدت
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
            'message' => 'تم رفض وحذف طلب العقار بنجاح',
            'id' => $id
        ])
        ->header('Last-Modified', $lastModifiedGMT)
        ->header('Cache-Control', 'no-cache, must-revalidate');

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'حدث خطأ أثناء رفض وحذف طلب العقار',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    // editAndPublish
  public function editAndPublish(Request $request, $id)
{
    $property = Property::where('id', $id)
                        ->where('is_published', false)
                        ->firstOrFail();

    $fieldMap = [
        'title' => 'title_ar',
        'description' => 'desc_ar',
        'price' => 'price',
        'address' => 'address',
        'type' => 'type',
        'status' => 'status',
        'finish' => 'finish',
        'latitude' => 'lat',
        'longitude' => 'lng',
        'isListed' => 'is_listed',
        'listingEndDate' => 'listing_end_date',
        'googleMapsUrl' => 'google_maps_url',
        'keywords'=>'keywords',
        'listingPlane'=>'listing_plan',
        'area'=>'area',
        'bedrooms'=>'bedrooms',
        'bathrooms'=>'bathrooms'
    ];

    $dataToUpdate = [];
    foreach ($fieldMap as $frontend => $dbColumn) {
        if ($request->has($frontend)) {
            $dataToUpdate[$dbColumn] = $request->input($frontend);
        }
    }

    $validated = validator($dataToUpdate, [
        'title_ar' => 'required|string|max:255',
        'desc_ar' => 'required|string',
        'price' => 'required|numeric|min:0',
        'address' => 'required|string|max:255',
        'type' => 'required|in:شقة,فيلا,ارض,تجاري',
        'status' => 'sometimes|required|in:للبيع,للإيجار,مباع,مؤجر,شراكة',
        'finish' => 'nullable|in:تشطيب كامل,نص تشطيب,على الطوب',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
        'is_listed' => 'sometimes|boolean',
        'listing_end_date' => 'nullable|date',
        'google_maps_url' => 'nullable|string|max:255',
        'keywords'=>'nullable|string',
        'listing_plan'=>'string|in:paid,commission',
        'area' => 'sometimes|numeric|min:0',
        'bedrooms' => 'nullable|integer|min:0',
        'bathrooms' => 'nullable|integer|min:0',
        // New videos field
        'videos' => 'nullable|array',
        'videos.*.video_url' => 'required_with:videos|string|max:255',
        'videos.*.thumbnail_url' => 'required_with:videos|string|max:255',
    ])->validate();

    $property->update(array_merge(
        $validated,
        [
            'is_published' => true,
            'created_by' => auth()->id(),
            'created_at' => now(),
            'updated_at'=>now(),
        ]
    ));

    // معالجة الصور إذا تم إرسالها
    if ($request->hasFile('images')) {
        $imagesData = $request->input('imagesData', []);
        
        foreach ($request->file('images') as $index => $image) {
            // الحصول على بيانات الصورة المرتبطة
            $imageData = $imagesData[$index] ?? [];
            
            // معالجة الصورة وحفظها باستخدام الخدمة
            $this->imageService->processAndStoreImage($image, $property->id, $imageData);
        }
    }

    // تحديث بيانات الصور الموجودة إذا تم إرسالها
    if ($request->has('existingImages')) {
        $existingImages = $request->input('existingImages', []);
        
        foreach ($existingImages as $imageData) {
            if (isset($imageData['id'])) {
                $image = PropertyImage::find($imageData['id']);
                if ($image && $image->property_id == $property->id) {
                    $image->update([
                        'sort' => $imageData['sort'] ?? $image->sort,
                        'isfeatured' => $imageData['isFeatured'] ?? $image->isfeatured,
                        'alt_text' => $imageData['altText'] ?? $image->alt_text,
                        'caption' => $imageData['caption'] ?? $image->caption,
                    ]);
                }
            }
        }
    }
    

    // تحديث الفيديوهات: احذف جميع الفيديوهات القديمة وأضف فقط الفيديوهات المرسلة مع الطلب
    if ($request->has('videos') && is_array($request->videos)) {
        // حذف جميع الفيديوهات القديمة لهذا العقار
        \DB::table('property_videos')->where('property_id', $property->id)->delete();

        // إضافة الفيديوهات الجديدة
        foreach ($request->videos as $video) {
            if (
                isset($video['video_url']) && !empty($video['video_url']) &&
                isset($video['thumbnail_url']) && !empty($video['thumbnail_url'])
            ) {
                \DB::table('property_videos')->insert([
                    'property_id' => $property->id,
                    'video_url' => $video['video_url'],
                    'thumbnail_url' => $video['thumbnail_url'],
                ]);
            }
        }
    }

    // تحميل الصور وتحويل الروابط
    $property->load('images');
    if ($property->images) {
        $property->images->transform(function ($image) {
            $image->url = $this->getFullImageUrl($image->url);
            $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
            $image->medium_url = $this->getFullImageUrl($image->medium_url);
            return $image;
        });
    } 

    // تحميل الفيديوهات من جدول property_videos
    $property->videos = $this->getPropertyVideos($property->id);
    return response()->json(['property' => $property]);
}


    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'description' => 'required|string',
        'price' => 'required|numeric|min:0',
        'area' => 'sometimes|numeric|min:0',
        'bedrooms' => 'nullable|integer|min:0',
        'bathrooms' => 'nullable|integer|min:0',
        'type' => 'required|in:شقة,فيلا,ارض,تجاري',
        'status' => 'sometimes|required|in:للبيع,للإيجار,مباع,مؤجر,شراكة',
        'finish' => 'nullable|in:تشطيب كامل,نص تشطيب,على الطوب',
        'address' => 'required|string|max:255',
        'listing_end_date' => 'nullable|date',
        'google_maps_url' => 'nullable|string|max:255',
        'listing_plan' => 'required|string|in:paid,commission',
        'keywords' => 'nullable|string',
        'ownerName' => 'required|string|max:255',
        'ownerPhone' => 'required|string|max:20',
        'ownerEmail' => 'nullable|email|max:255',
        'contactTime' => 'nullable|string|max:255|in:morning,afternoon,evening',
        'images' => 'nullable|array',
        'images.*' => 'image|mimes:jpeg,jpg,png,gif,bmp,webp|max:5120',
        'imagesData' => 'nullable|array',
        'imagesData.*.sort' => 'nullable|integer',
        'imagesData.*.isFeatured' => 'nullable|boolean',
        'imagesData.*.altText' => 'nullable|string|max:255',
        'imagesData.*.caption' => 'nullable|string|max:255',
        // New videos field
        'videos' => 'nullable|array',
        'videos.*.video_url' => 'required_with:videos|string|max:255',
        'videos.*.thumbnail_url' => 'required_with:videos|string|max:255',
    
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $customer = Customer::firstOrCreate(
        ['phone' => $request->ownerPhone],
        [
            'name' => $request->ownerName,
            'email' => $request->ownerEmail,
            'prefered_contact_times' => $request->contactTime,
            'type' => 'seller'
        ]
    );

    $fieldMap = [
        'description' => 'desc_ar',
        'price' => 'price',
        'area' => 'area',
        'bedrooms' => 'bedrooms',
        'bathrooms' => 'bathrooms',
        'type' => 'type',
        'status' => 'status',
        'finish' => 'finish',
        'address' => 'address',
        'mapLocation' => 'google_maps_url',
        'listingPlan' => 'listing_plan', 
        'keywords' => 'keywords',
    ];

    $propertyData = [];
    foreach ($fieldMap as $frontend => $dbColumn) {
        if ($request->has($frontend) && $request->input($frontend) !== null) {
            $propertyData[$dbColumn] = $request->input($frontend);
        }
    }

    $propertyData['title_ar'] = ($propertyData['type'] ?? 'عقار') . ' ' . ($request->keywords ?? '');
    $propertyData['requested_by'] = $customer->id;
    $propertyData['is_published'] = 0;
    $propertyData['is_listed'] = 1;
    $propertyData['requested_at'] = now();
    $propertyData['listing_end_date'] = Carbon::now()->addMonth();

    $validatedProperty = validator($propertyData, [
        'desc_ar' => 'required|string',
        'price' => 'required|numeric|min:0',
        'area' => 'sometimes|numeric|min:0',
        'bedrooms' => 'nullable|integer|min:0',
        'bathrooms' => 'nullable|integer|min:0',
        'type' => 'required|in:شقة,فيلا,ارض,تجاري',
        'status' => 'sometimes|in:للبيع,للإيجار,مباع,مؤجر',
        'finish' => 'nullable|in:تشطيب كامل,نص تشطيب,على الطوب',
        'address' => 'required|string|max:255',
        'listing_plan' => 'required|in:paid,commission',
        'google_maps_url' => 'nullable|string|max:255',
        'title_ar' => 'required|string|max:255',
        'requested_by' => 'required|exists:customers,id',
        'is_published' => 'required|boolean',
        'is_listed' => 'required|boolean',
        'requested_at' => 'required|date',
        'keywords' => 'nullable|string',
        'listing_end_date' => 'nullable|date'
                
    ])->validate();

    $property = Property::create($validatedProperty);

    // معالجة الصور إذا تم إرسالها
    if ($request->hasFile('images')) {
        $imagesData = $request->input('imagesData', []);
        
        foreach ($request->file('images') as $index => $image) {
            // الحصول على بيانات الصورة المرتبطة
            $imageData = $imagesData[$index] ?? [];
            
            // معالجة الصورة وحفظها باستخدام الخدمة
            $this->imageService->processAndStoreImage($image, $property->id, $imageData);
        }
    }

 
    // إضافة الفيديوهات إلى جدول property_videos
    if ($request->has('videos') && is_array($request->videos)) {
        foreach ($request->videos as $video) {
            // تأكد من وجود الحقول المطلوبة
            if (
                isset($video['video_url']) && !empty($video['video_url']) &&
                isset($video['thumbnail_url']) && !empty($video['thumbnail_url'])
            ) {
                \DB::table('property_videos')->insert([
                    'property_id' => $property->id,
                    'video_url' => $video['video_url'],
                    'thumbnail_url' => $video['thumbnail_url'], 
                ]);
            }
        }
    }

            // تحميل الصور وتحويل الروابط
    $property->load('images');
    if ($property->images) {
        $property->images->transform(function ($image) {
            $image->url = $this->getFullImageUrl($image->url);
            $image->thumbnail_url = $this->getFullImageUrl($image->thumbnail_url);
            $image->medium_url = $this->getFullImageUrl($image->medium_url);
            return $image;
        });
    }
    // تحميل الفيديوهات من جدول property_videos
    $property->videos = $this->getPropertyVideos($property->id);

    return response()->json([
        'message' => 'Property request created successfully',
        'property' => $property,
        'customer' => $customer,
    ], 201);
}


 public function uploadImages(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,jpg,png,gif,bmp,webp|max:5120', // زيادة الحد الأقصى للحجم
            'imagesData' => 'required|array',
            'imagesData.*.sort' => 'nullable|integer',
            'imagesData.*.isFeatured' => 'nullable|boolean',
            'imagesData.*.altText' => 'nullable|string|max:255',
            'imagesData.*.caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $uploadedImages = [];
        $imagesData = $request->input('imagesData', []);

        foreach ($request->file('images') as $index => $image) {
            // الحصول على بيانات الصورة المرتبطة
            $imageData = $imagesData[$index] ?? [];
            
            // معالجة الصورة وحفظها
            $propertyImage = $this->imageService->processAndStoreImage($image, $property->id, $imageData);
            
            // تحويل الروابط للصور
            $propertyImage->url = $this->getFullImageUrl($propertyImage->url);
            $propertyImage->thumbnail_url = $this->getFullImageUrl($propertyImage->thumbnail_url);
            $propertyImage->medium_url = $this->getFullImageUrl($propertyImage->medium_url);
            
            $uploadedImages[] = $propertyImage;
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'images' => $uploadedImages,
        ], 201);
    }
    
    

public function updateImageMetadata(Request $request, $propertyId, $imageId)
{
    $property = Property::findOrFail($propertyId);
    
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
        'alt_text' => $request->altText ?? $image->alt_text,
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
        $image = PropertyImage::where('property_id', $propertyId)->findOrFail($imageId);

        // حذف الصورة باستخدام الخدمة
        $this->imageService->deleteImage($image);

        return response()->json([
            'message' => 'Image deleted successfully',
            'id' => $imageId
        ]);
    }

}

<?php
namespace App\Http\Controllers;

use App\Models\DecorRequest;
use App\Models\Customer;
use App\Services\ImageProcessingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class DecorRequestController extends Controller
{
    protected $imageService;

    public function __construct(ImageProcessingService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index(Request $request)
    {
        // الحصول على آخر وقت تعديل لطلبات الديكور
        $lastModified = DecorRequest::max('updated_at');
        $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // التحقق إذا كان العميل لديه نسخة مخزنة
        if ($request->headers->has('If-Modified-Since')) {
            $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
            if (strtotime($lastModified) <= $ifModifiedSince) {
                return response()->noContent(304);
            }
        }
    
        $requests = DecorRequest::all();
        $data = $requests->map(function ($req) {
            $customer = Customer::find($req->requested_by);
                
            $image = null;
            $thumbnail_url = null;
            $medium_url = null;
            $alt_text = null;
            $caption = null; 

            if ($req->reference_item_id) {
                $referenceItem = $req->referenceItem;
                if ($referenceItem) { 
                    $image =  $referenceItem->cover_url;
                    $thumbnail_url =  $referenceItem->thumbnail_url;
                    $medium_url =  $referenceItem->medium_url;
                    $alt_text =  $referenceItem->altText;
                    $caption =  $referenceItem->caption; 
                }
            }
            return [
                'id' => $req->id,
                'title' => $req->title,
                'description' => $req->description,
                'status' => $req->status,
                'type' => $req->type,
                'details' => $req->details,
                'notes' => $req->notes,
                'image' => $image ?? $req->full_image_url,
                'thumbnail_url' => $thumbnail_url ?? $req->full_thumbnail_url,
                'medium_url' => $medium_url ?? $req->full_medium_url,
                'alt_text' => $alt_text ?? $req->alt_text,
                'caption' =>$caption ??  $req->caption,

                'created_at' => $req->created_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
                'updated_at' => $req->updated_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
                'name' => $customer?->name ?? '',
                'email' => $customer?->email ?? '',
                'phone' => $customer?->phone ?? '',
                'reference_item_id' => $req->reference_item_id, 
            ];
        });
    
        return response()->json($data)
            ->header('Last-Modified', $lastModifiedHeader)
            ->header('Cache-Control', 'public, max-age=0');
    }
    
    public function show(Request $request, $id)
    {
        $requestModel = DecorRequest::findOrFail($id);
        $customer = Customer::find($requestModel->requested_by);
        
        // حساب آخر وقت تعديل مع مراعاة كل من الطلب والعميل
        $lastModified = max(
            $requestModel->updated_at,
            $customer ? $customer->updated_at : $requestModel->updated_at
        );
        $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // التحقق إذا كان العميل لديه نسخة مخزنة
        if ($request->headers->has('If-Modified-Since')) {
            $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
            if (strtotime($lastModified) <= $ifModifiedSince) {
                return response()->noContent(304);
            }
        }
        
        
        $image = null;
        $thumbnail_url = null;
        $medium_url = null;
        $alt_text = null;
        $caption = null; 

        if ($requestModel->reference_item_id) {
            $referenceItem = $requestModel->referenceItem;
            if ($referenceItem) { 
                $image =  $referenceItem->cover_url;
                $thumbnail_url =  $referenceItem->thumbnail_url;
                $medium_url =  $referenceItem->medium_url;
                $alt_text =  $referenceItem->altText;
                $caption =  $referenceItem->caption; 
            }
        }
        
        return response()->json([
            'id' => $requestModel->id,
            'title' => $requestModel->title,
            'description' => $requestModel->description,
            'status' => $requestModel->status,
            'type' => $requestModel->type,
            'details' => $requestModel->details,
            'notes' => $requestModel->notes,
            
            'image' => $image ?? $requestModel->full_image_url,
            'thumbnail_url' => $thumbnail_url ?? $requestModel->full_thumbnail_url,
            'medium_url' => $medium_url ?? $requestModel->full_medium_url,
            'alt_text' => $alt_text ?? $requestModel->alt_text,
            'caption' =>$caption ??  $requestModel->caption,

            'created_at' => $requestModel->created_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
            'updated_at' => $requestModel->updated_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
            'name' => $customer?->name ?? '',
            'email' => $customer?->email ?? '',
            'phone' => $customer?->phone ?? '',
            
            'reference_item_id' => $requestModel->reference_item_id, 
            'cover_url' =>  $image,
                    ])
        ->header('Last-Modified', $lastModifiedHeader)
        ->header('Cache-Control', 'public, max-age=0');
    }

    public function store(Request $request)
    {
  
        $validator = Validator::make($request->all(), [
            'clientPhone' => 'required|string|max:20',
            'clientName' => 'nullable|string|max:255',
            'type' => 'required|string',
            'details' => 'required|string',


            'reference_item_id' => 'nullable|exists:portfolio_items,id',
            // OR
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,bmp,webp|max:5120',
            'altText' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);


        // تحقق من أن أحدهما موجود: إما صورة أو reference_item_id
        $hasReference = $request->filled('reference_item_id');
        $hasImage = $request->hasFile('image');
        if (!$hasReference && !$hasImage) {
            return response()->json([
                'errors' => [
                    'image' => ['يجب رفع صورة إذا لم يتم اختيار عنصر مرجعي.'],
                    'reference_item_id' => ['يجب اختيار عنصر مرجعي إذا لم يتم رفع صورة.'],
                ]
            ], 422);
        }

        // البحث عن العميل أو إنشاؤه
        $customer = Customer::where('phone', $request->clientPhone)->first();
        if (!$customer) {
            $customer = Customer::create([
                'name' => $request->clientName ?? '',
                'phone' => $request->clientPhone,
            ]);
        }
 
        $imagePath = null;
        $thumbnailUrl = null;
        $mediumUrl = null;
        $altText = null;
        $caption = null;
        $fileSize = null;
        $dimensions = null;
        $originalFilename = null;
        $mimeType = null;
        $seoKeywords = null;

        if ($hasImage) {
            $image = $request->file('image');
            $imageData = [
                'altText' => $request->altText,
                'caption' => $request->caption,
            ];

            // Process and store the image using the service (always upload a new image for this request)
            $processedImage = $this->imageService->processAndStoreDecorRequestImage($image, $imageData);

            $imagePath = $processedImage->url;
            $thumbnailUrl = $processedImage->thumbnail_url;
            $mediumUrl = $processedImage->medium_url;
            $altText = $processedImage->altText;
            $caption = $processedImage->caption;
            $fileSize = $processedImage->file_size;
            $dimensions = $processedImage->dimensions;
            $originalFilename = $processedImage->original_filename;
            $mimeType = $processedImage->mime_type;
            $seoKeywords = $processedImage->seo_keywords;
        }
        //  elseif ($hasReference) {
        //     // إذا كان هناك عنصر مرجعي ولم يتم رفع صورة، انسخ صورة العنصر المرجعي كصورة منفصلة لهذا الطلب
        //     $referenceItem = \App\Models\PortfolioItem::find($request->reference_item_id);
        //     if ($referenceItem && $referenceItem->image) {
        //         // استخدم خدمة الصور لنسخ الصورة إلى مكان جديد لهذا الطلب
        //         $copiedImage = $this->imageService->copyReferenceItemImageForDecorRequest($referenceItem, [
        //             'altText' => $request->altText ?? $referenceItem->alt_text,
        //             'caption' => $request->caption ?? $referenceItem->caption,
        //         ]);
        //         $imagePath = $copiedImage->url;
        //         $thumbnailUrl = $copiedImage->thumbnail_url;
        //         $mediumUrl = $copiedImage->medium_url;
        //         $altText = $copiedImage->alt_text;
        //         $caption = $copiedImage->caption;
        //         $fileSize = $copiedImage->file_size;
        //         $dimensions = $copiedImage->dimensions;
        //         $originalFilename = $copiedImage->original_filename;
        //         $mimeType = $copiedImage->mime_type;
        //         $seoKeywords = $copiedImage->seo_keywords;
        //     }
        // }

        // إنشاء طلب الديكور
        $decorRequest = DecorRequest::create([
            'requested_by' => $customer->id,
            'type' => $request->type,
            'details' => $request->details,
            'reference_item_id' => $request->reference_item_id,
            'image' => $imagePath,
            'thumbnail_url' => $thumbnailUrl,
            'medium_url' => $mediumUrl,
            'alt_text' => $altText,
            'caption' => $caption,
            'file_size' => $fileSize,
            'dimensions' => $dimensions,
            'original_filename' => $originalFilename,
            'mime_type' => $mimeType,
            'seo_keywords' => $seoKeywords,
            'status' => 'جديد'
        ]);

        return response()->json([
            'message' => 'Request created successfully',
            'request' => [
                'id' => $decorRequest->id,
                'type' => $decorRequest->type,
                'details' => $decorRequest->details,
                'image' => $decorRequest->full_image_url,
                'thumbnail_url' => $decorRequest->full_thumbnail_url,
                'medium_url' => $decorRequest->full_medium_url,
                'status' => $decorRequest->status,
                'created_at' => $decorRequest->created_at->format('Y-m-d H:i:s'),
            ],
            'customer' => [
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
            ]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $decorRequest = DecorRequest::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:جديد,تم التواصل,قيد التنفيذ,مكتمل,ملغي',
            'assigned_to' => 'nullable|exists:staff,id',
            'notes' => 'nullable|string',
            'image' => 'sometimes|image|mimes:jpeg,jpg,png,gif,bmp,webp|max:5120',
            'altText' => 'nullable|string|max:255',
            'caption' => 'nullable|string|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $dataToUpdate = $request->except(['image', 'altText', 'caption']);
        $dataToUpdate['handled_by'] = auth()->id();
        
        // Handle image update
        if ($request->hasFile('image')) {
            // Delete old image using the service
            if ($decorRequest->image) {
                $this->imageService->deleteDecorRequestImage($decorRequest);
            }
            
            // Process and store the new image
            $image = $request->file('image');
            $imageData = [
                'altText' => $request->altText ?? $decorRequest->alt_text,
                'caption' => $request->caption ?? $decorRequest->caption,
            ];
            
            $processedImage = $this->imageService->processAndStoreDecorRequestImage($image, $imageData);
            
            // Update image fields
            $dataToUpdate['image'] = $processedImage->url;
            $dataToUpdate['thumbnail_url'] = $processedImage->thumbnail_url;
            $dataToUpdate['medium_url'] = $processedImage->medium_url;
            $dataToUpdate['alt_text'] = $processedImage->altText;
            $dataToUpdate['caption'] = $processedImage->caption;
            $dataToUpdate['file_size'] = $processedImage->file_size;
            $dataToUpdate['dimensions'] = $processedImage->dimensions;
            $dataToUpdate['original_filename'] = $processedImage->original_filename;
            $dataToUpdate['mime_type'] = $processedImage->mime_type;
            $dataToUpdate['seo_keywords'] = $processedImage->seo_keywords;
        } else {
            // Update only alt text and caption if no new image
            $dataToUpdate['alt_text'] = $request->altText ?? $decorRequest->alt_text;
            $dataToUpdate['caption'] = $request->caption ?? $decorRequest->caption;
        }
        
        $decorRequest->update($dataToUpdate);
        
        return response()->json([
            'message' => 'Decor request updated successfully',
            'decor_request' => $decorRequest->load(['assignee', 'referenceItem', 'requestedBy']),
        ]);
    }

    public function destroy($id)
    {
        $decorRequest = DecorRequest::findOrFail($id);
        
        try {
            // Delete image using the service
            if ($decorRequest->image) {
                $this->imageService->deleteDecorRequestImage($decorRequest);
            }
            
            // Delete the request
            $decorRequest->delete();
            
            return response()->json([
                'message' => 'Decor request deleted successfully',
                'id' => $id
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'حدث خطأ أثناء حذف طلب الديكور',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
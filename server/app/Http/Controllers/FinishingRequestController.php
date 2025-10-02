<?php
namespace App\Http\Controllers;

use App\Models\FinishingRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FinishingRequestController extends Controller
{
        public function index(Request $request)
    {
    // Get last modification time from finishing requests
    $lastModified = FinishingRequest::max('updated_at');
    $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
    // Check if client has cached version
    if ($request->headers->has('If-Modified-Since')) {
    $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
    if (strtotime($lastModified) <= $ifModifiedSince) {
    return response()->noContent(304);
    }
    }
    
    $finishingRequests = FinishingRequest::with('assignee')->get();
    $data = $finishingRequests->map(function ($req) {
    $customer = Customer::find($req->requested_by);
    return [
    'id' => $req->id,
    'title' => $req->title,
    'description' => $req->description,
    'status' => $req->status,
    'type' => $req->type,
    'details' => $req->details,
    'notes'=>$req->notes,
    'created_at' => $req->created_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
    'updated_at' => $req->updated_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
    'name' => $customer?->name ?? '',
    'email' => $customer?->email ?? '',
    'phone' => $customer?->phone ?? '',
    ];
    });
    
    return response()->json($data)
    ->header('Last-Modified', $lastModifiedHeader)
    ->header('Cache-Control', 'public, max-age=0');
    }
    
    public function show(Request $request, $id)
    {
    $finishingRequest = FinishingRequest::with('assignee')->findOrFail($id);
    $customer = Customer::find($finishingRequest->requested_by);
    
    // Get last modification time (considering both request and customer)
    $lastModified = max(
    $finishingRequest->updated_at,
    $customer ? $customer->updated_at : $finishingRequest->updated_at
    );
    $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
    // Check if client has cached version
    if ($request->headers->has('If-Modified-Since')) {
    $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
    if (strtotime($lastModified) <= $ifModifiedSince) {
    return response()->noContent(304);
    }
    }
    
    return response()->json([
    'id' => $finishingRequest->id,
    'title' => $finishingRequest->title,
    'description' => $finishingRequest->description,
    'status' => $finishingRequest->status,
    'type' => $finishingRequest->type,
    'details' => $finishingRequest->details,
    'notes'=>$finishingRequest->notes,
    'created_at' => $finishingRequest->created_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
    'updated_at' => $finishingRequest->updated_at->timezone('Africa/Cairo')->format('Y-m-d H:i:s'),
    'name' => $customer?->name ?? '',
    'email' => $customer?->email ?? '',
    'phone' => $customer?->phone ?? '',
    ])
    ->header('Last-Modified', $lastModifiedHeader)
    ->header('Cache-Control', 'public, max-age=0');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'clientName' => 'required|string|max:255',
            'clientPhone' => 'required|string|max:20',
            'type' => 'required|string|in:استشارة وتصور,تصميم ثلاثي الأبعاد,تنفيذ وإشراف',
            'details' => 'required|string',
            'notes' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // البحث عن العميل أو إنشاؤه
        $customer = Customer::where('phone', $request->clientPhone)->first();
        if (!$customer) {
            $customer = Customer::create([
                'name' => $request->clientName,
                'phone' => $request->clientPhone,
            ]);
        }
        
        // إنشاء طلب التشطيب
        $finishingRequest = FinishingRequest::create([
            'requested_by' => $customer->id,
            'type' => $request->type,
            'details' => $request->details,
            'notes' => $request->notes,
            'status' => 'جديد'
        ]);
        
        return response()->json([
            'message' => 'Finishing request created successfully',
            'request' => [
                'id' => $finishingRequest->id,
                'type' => $finishingRequest->type,
                'details' => $finishingRequest->details,
                'status' => $finishingRequest->status,
                'created_at' => $finishingRequest->created_at->format('Y-m-d H:i:s'),
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
        $finishingRequest = FinishingRequest::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:جديد,تم التواصل,قيد التنفيذ,مكتمل,ملغي',
            'assigned_to' => 'nullable|exists:staff,id',
            'notes' => 'nullable|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $dataToUpdate = $request->all();
        $dataToUpdate['handled_by'] = auth()->id();
        
        $finishingRequest->update($dataToUpdate);
        
        return response()->json([
            'message' => 'Finishing request updated successfully',
            'finishing_request' => $finishingRequest->load(['assignee']),
        ]);
    }
}
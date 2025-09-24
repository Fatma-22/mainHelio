<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InquiryController extends Controller
{
            public function index(Request $request)
        {
            // الحصول على آخر وقت تعديل للاستفسارات
            $lastModified = Inquiry::max('updated_at');
            $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
        
            // التحقق إذا كان العميل لديه نسخة مخزنة
            if ($request->headers->has('If-Modified-Since')) {
                $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
                if (strtotime($lastModified) <= $ifModifiedSince) {
                    return response()->noContent(304);
                }
            }
        
            $inquiries = Inquiry::with('handler')->get();
        
            return response()->json($inquiries)
                ->header('Last-Modified', $lastModifiedHeader)
                ->header('Cache-Control', 'public, max-age=0');
        }
        
        public function show(Request $request, $id)
        {
            $inquiry = Inquiry::with('handler')->findOrFail($id);
            
            // حساب آخر وقت تعديل مع مراعاة الاستفسار والمعالج
            $lastModified = $inquiry->updated_at;
            if ($inquiry->handler) {
                $lastModified = max($lastModified, $inquiry->handler->updated_at);
            }
            $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
        
            // التحقق إذا كان العميل لديه نسخة مخزنة
            if ($request->headers->has('If-Modified-Since')) {
                $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
                if (strtotime($lastModified) <= $ifModifiedSince) {
                    return response()->noContent(304);
                }
            }
        
            return response()->json($inquiry)
                ->header('Last-Modified', $lastModifiedHeader)
                ->header('Cache-Control', 'public, max-age=0');
        }
    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'required|string',
            'contact_time'=>'nullable|string|in:afternoon,morning,evening'
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        $inquiry = Inquiry::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'message' => $request->message,
            'status' => 'جديد',
            'type'=>'تواصل عام',
            'contact_time'=>$request->contact_time
        ]);
    
        return response()->json([
            'message' => 'Inquiry created successfully',
            'inquiry' => $inquiry,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:جديد,تم التواصل,قيد المتابعة,مغلق',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // الحصول على جميع البيانات التي تم التحقق من صحتها من الطلب
        $validatedData = $validator->validated();
        
        // إضافة حقل handled_by إلى البيانات التي سيتم تحديثها
        $validatedData['handled_by'] = auth()->id();

        // تحديث السجل باستخدام البيانات المدمجة
        $inquiry->update($validatedData);

        return response()->json([
            'message' => 'Inquiry updated successfully',
            'inquiry' => $inquiry->load('handler'),
        ]);
    }
}
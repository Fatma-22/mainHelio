<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerInteraction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerController extends Controller
{
            public function index(Request $request)
        {
            // الحصول على آخر وقت تعديل للعملاء
            $lastModified = Customer::max('updated_at');
            $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
        
            // التحقق إذا كان العميل لديه نسخة مخزنة
            if ($request->headers->has('If-Modified-Since')) {
                $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
                if (strtotime($lastModified) <= $ifModifiedSince) {
                    return response()->noContent(304);
                }
            }
        
            $customers = Customer::with('interactions')->get();
        
            return response()->json($customers)
                ->header('Last-Modified', $lastModifiedHeader)
                ->header('Cache-Control', 'public, max-age=0');
        }
        
        public function show(Request $request, $id)
        {
            $customer = Customer::with('interactions')->findOrFail($id);
            
            // حساب آخر وقت تعديل مع مراعاة العميل وتفاعلاته
            $lastModified = $customer->updated_at;
            if ($customer->interactions->isNotEmpty()) {
                $lastInteractionUpdate = $customer->interactions->max('updated_at');
                $lastModified = $lastModified > $lastInteractionUpdate ? $lastModified : $lastInteractionUpdate;
            }
            $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
        
            // التحقق إذا كان العميل لديه نسخة مخزنة
            if ($request->headers->has('If-Modified-Since')) {
                $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
                if (strtotime($lastModified) <= $ifModifiedSince) {
                    return response()->noContent(304);
                }
            }
        
            return response()->json($customer)
                ->header('Last-Modified', $lastModifiedHeader)
                ->header('Cache-Control', 'public, max-age=0');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'type' => 'required|in:buyer,seller,finishing,decor',
            'notes' => 'nullable|string',
            'prefered_contact_times'=>'nullable|string|morning,afternoon,evening'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer = Customer::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'type' => $request->type,
            'notes' => $request->notes,
            'prefered_contact_times'=>$request->contactTime,
        ]);

        return response()->json([
            'message' => 'Customer created successfully',
            'customer' => $customer,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'type' => 'sometimes|required|in:buyer,seller,finishing,decor',
            'notes' => 'nullable|string',
            'prefered_contact_times'=>'required|string|in:صباحا,ظهرا,مساء',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $customer->update($request->all());

        return response()->json([
            'message' => 'Customer updated successfully',
            'customer' => $customer,
        ]);
    }

   public function destroy($id)
{
    try {
        // حذف التفاعلات المرتبطة بالعميل
        CustomerInteraction::where('customer_id', $id)->delete();
        
        // حذف العميل نفسه
        $customer = Customer::findOrFail($id);
        $customer->delete();
        
        // تحديث وقت التعديل لعميل عشوائي لتحديث الـ Last-Modified
        // هذا أفضل من تحديث جميع العملاء من حيث الأداء
        if (Customer::count() > 0) {
            $randomCustomer = Customer::inRandomOrder()->first();
            $randomCustomer->touch(); // هذا يحدث الـ updated_at للعميل
        }
        
        // جلب العملاء المتبقين بعد الحذف لتحديث الـ Last-Modified
        $customers = Customer::all();
        $lastModified = $customers->max('updated_at') ?? now();
        $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
        
        return response()->json([
            'message' => 'تم حذف العميل بنجاح',
            'id' => $id
        ])
        ->header('Last-Modified', $lastModifiedGMT)
        ->header('Cache-Control', 'no-cache, must-revalidate');
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'حدث خطأ أثناء حذف العميل',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function indexInteractions($customerId)
    {
        $interactions = CustomerInteraction::with('staff')
            ->where('customer_id', $customerId)
            ->paginate(10);
        
        return response()->json($interactions);
    }

    public function storeInteraction(Request $request, $customerId)
    {
        $validator = Validator::make($request->all(), [
            'channel' => 'required|in:phone,email,whatsapp,in_person',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $interaction = CustomerInteraction::create([
            'customer_id' => $customerId,
            'staff_id' => $request->user()->id,
            'channel' => $request->channel,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => 'Interaction created successfully',
            'interaction' => $interaction->load('staff'),
        ], 201);
    }
}
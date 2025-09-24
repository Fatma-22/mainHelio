<?php

namespace App\Http\Controllers;
use App\Models\Property;
use App\Models\Staff;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
    {public function index(Request $request)
    {
        // الحصول على آخر وقت تعديل للموظفين فقط (بدون النظر للأدوار)
        $lastModified = Staff::max('updated_at');
        $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // التحقق إذا كان العميل لديه نسخة مخزنة
        if ($request->headers->has('If-Modified-Since')) {
            $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
            if (strtotime($lastModified) <= $ifModifiedSince) {
                return response()->noContent(304);
            }
        }
    
        $staff = Staff::with('role')->get();
    
        return response()->json($staff)
            ->header('Last-Modified', $lastModifiedHeader)
            ->header('Cache-Control', 'public, max-age=0');
    }
    
    public function show(Request $request, $id)
    {
        $staff = Staff::with('role')->findOrFail($id);
        
        // حساب آخر وقت تعديل مع مراعاة الموظف ودوره
        $lastModified = $staff->updated_at;
        if ($staff->role) {
            $lastModified = max($lastModified, $staff->role->updated_at);
        }
        $lastModifiedHeader = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
    
        // التحقق إذا كان العميل لديه نسخة مخزنة
        if ($request->headers->has('If-Modified-Since')) {
            $ifModifiedSince = strtotime($request->header('If-Modified-Since'));
            if (strtotime($lastModified) <= $ifModifiedSince) {
                return response()->noContent(304);
            }
        }
    
        return response()->json($staff)
            ->header('Last-Modified', $lastModifiedHeader)
            ->header('Cache-Control', 'public, max-age=0');
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:staff',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $staff = Staff::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 'active',
            'role_id' => $request->role_id,
        ]);

        return response()->json([
            'message' => 'Staff created successfully',
            'staff' => $staff->load('role'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $staff = Staff::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:staff,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role_id' => 'required|exists:roles,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['name','email','phone','role_id']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        } else {
            $data['password'] = $staff->password;
        }

        $staff->update($data);

        return response()->json([
            'message' => 'Staff updated successfully',
            'staff' => $staff->load('role'),
        ]);
    }

   public function destroy($id)
{
    try {
        // العثور على الموظف
        $staff = Staff::findOrFail($id);
        
        // حذف السجلات المرتبطة بالموظف
        $staff->interactions()->delete();
        $staff->finishingRequests()->delete();
        $staff->inquiries()->delete();
        
        // تحديث العقارات التي أنشأها الموظف لإزالة الارتباط
        Property::where('created_by', $staff->id)->update(['created_by' => null]);
        
        // حذف الموظف نفسه
        $staff->delete();
        
        // تحديث وقت التعديل لموظف عشوائي لتحديث الـ Last-Modified
        // هذا أفضل من تحديث جميع الموظفين من حيث الأداء
        if (Staff::count() > 0) {
            $randomStaff = Staff::inRandomOrder()->first();
            $randomStaff->touch(); // هذا يحدث الـ updated_at للموظف
        }
        
        // جلب الموظفين المتبقين بعد الحذف لتحديث الـ Last-Modified
        $staffMembers = Staff::all();
        $lastModified = $staffMembers->max('updated_at') ?? now();
        $lastModifiedGMT = gmdate('D, d M Y H:i:s', strtotime($lastModified)) . ' GMT';
        
        return response()->json([
            'message' => 'تم حذف الموظف بنجاح',
            'id' => $id
        ])
        ->header('Last-Modified', $lastModifiedGMT)
        ->header('Cache-Control', 'no-cache, must-revalidate');
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'حدث خطأ أثناء حذف الموظف',
            'error' => $e->getMessage(),
        ], 500);
    }
}

}
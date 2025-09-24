<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Staff;

class StaffMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // تحقق من وجود staff عن طريق الـ authenticated user ID
        $user = $request->user(); // ده المستخدم اللي عامل login
        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        // لو المستخدم مش موجود في جدول staff يبقى ممنوع
        $staff = Staff::find($user->id);
        if (!$staff) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // كده المستخدم موجود كـ staff
        return $next($request);
    }
}

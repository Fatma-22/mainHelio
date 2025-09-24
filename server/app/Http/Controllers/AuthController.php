<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PragmaRX\Google2FAQRCode\Google2FA;
use Carbon\Carbon;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'status' => 'active',
        ]);
        $user->notify(new \Illuminate\Auth\Notifications\VerifyEmail());
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // محاولة إيجاد user
        $user = User::where('email', $credentials['email'])->first();
        if ($user && Hash::check($credentials['password'], $user->password)) {
            // تحقق من 2FA لو مفعل
            if ($user->two_factor_secret) {
                if (!$request->has('two_factor_code')) {
                    return response()->json([
                        'message' => 'Two-factor authentication required',
                        'requires_two_factor' => true,
                    ], 202);
                }

                $google2fa = new Google2FA();
                if (!$google2fa->verifyKey($user->two_factor_secret, $request->two_factor_code)) {
                    return response()->json(['message' => 'Invalid two-factor code'], 422);
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $user->last_login_at = Carbon::now();
            $user->save();
            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
                'user_type' => 'user',
            ]);
        }

        // نفس الشيء للـ staff
        $staff = Staff::where('email', $credentials['email'])->first();
        if ($staff && Hash::check($credentials['password'], $staff->password)) {
            if ($staff->two_factor_secret) {
                if (!$request->has('two_factor_code')) {
                    return response()->json([
                        'message' => 'Two-factor authentication required',
                        'requires_two_factor' => true,
                    ], 202);
                }

                $google2fa = new Google2FA();
                if (!$google2fa->verifyKey($staff->two_factor_secret, $request->two_factor_code)) {
                    return response()->json(['message' => 'Invalid two-factor code'], 422);
                }
            }

            $token = $staff->createToken('auth_token')->plainTextToken;
            $staff->last_login_at = Carbon::now();
            $staff->save();
            return response()->json([
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $staff,
                'user_type' => 'staff',
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'phone']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }

    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = User::find($id);
        
        if (!$user || !hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        if ($user->markEmailAsVerified()) {
            event(new \Illuminate\Auth\Events\Verified($user));
        }

        return response()->json(['message' => 'Email verified successfully']);
    }

    public function resendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'تم التحقق من البريد الإلكتروني مسبقاً']);
        }

        try {
            $request->user()->sendEmailVerificationNotification();
            return response()->json(['message' => 'تم إرسال رابط التحقق إلى بريدك الإلكتروني']);
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
            return response()->json(['message' => 'فشل إرسال البريد الإلكتروني. يرجى المحاولة لاحقاً.'], 500);
        }
    }
    
}
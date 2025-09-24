<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use PragmaRX\Google2FAQRCode\Google2FA;
use Illuminate\Support\Facades\Hash;

class TwoFactorAuthController extends Controller
{
    public function enable(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->password, $user->password_hash)) {
            return response()->json(['message' => 'كلمة المرور غير صحيحة'], 422);
        }

        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $user->two_factor_secret = $secret;
        $user->two_factor_recovery_codes = $this->generateRecoveryCodes();
        $user->save();

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
            'recovery_codes' => $user->two_factor_recovery_codes,
        ]);
    }

    public function disable(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->password, $user->password_hash)) {
            return response()->json(['message' => 'كلمة المرور غير صحيحة'], 422);
        }

        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        return response()->json(['message' => 'تم تعطيل المصادقة الثنائية بنجاح']);
    }

    public function verify(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey($user->two_factor_secret, $request->code);

        if ($valid) {
            $user->two_factor_confirmed_at = now();
            $user->save();

            return response()->json(['message' => 'تم التحقق من الرمز بنجاح']);
        }

        return response()->json(['message' => 'الرمز غير صحيح'], 422);
    }

    public function regenerateRecoveryCodes(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!Hash::check($request->password, $user->password_hash)) {
            return response()->json(['message' => 'كلمة المرور غير صحيحة'], 422);
        }

        $user->two_factor_recovery_codes = $this->generateRecoveryCodes();
        $user->save();

        return response()->json([
            'recovery_codes' => $user->two_factor_recovery_codes,
        ]);
    }

    public function verifyRecoveryCode(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'recovery_code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $recoveryCodes = $user->two_factor_recovery_codes;

        if (in_array($request->recovery_code, $recoveryCodes)) {
            // إزالة كود الاستعادة المستخدم
            $recoveryCodes = array_diff($recoveryCodes, [$request->recovery_code]);
            $user->two_factor_recovery_codes = $recoveryCodes;
            $user->save();

            return response()->json(['message' => 'تم التحقق من كود الاستعادة بنجاح']);
        }

        return response()->json(['message' => 'كود الاستعادة غير صحيح'], 422);
    }

    protected function generateRecoveryCodes()
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = implode('-', [
                bin2hex(random_bytes(2)),
                bin2hex(random_bytes(2)),
                bin2hex(random_bytes(2)),
                bin2hex(random_bytes(2)),
            ]);
        }
        return $codes;
    }
}
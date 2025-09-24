<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorEnabled
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if ($user->two_factor_secret && !$user->two_factor_confirmed_at) {
            return response()->json(['message' => 'Two-factor authentication must be confirmed.'], 403);
        }

        return $next($request);
    }
}
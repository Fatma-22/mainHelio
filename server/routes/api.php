<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PropertyRequestController;
use App\Http\Controllers\FinishingRequestController;
use App\Http\Controllers\DecorRequestController;
use App\Http\Controllers\SiteContentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\TwoFactorAuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\VimeoController;

// Debug route for Cloudinary configuration
Route::get('/debug/cloudinary', function () {
    return [
        'cloud_name' => config('services.cloudinary.cloud_name'),
        'api_key' => config('services.cloudinary.api_key') ? 'SET' : 'NOT SET',
        'api_secret' => config('services.cloudinary.api_secret') ? 'SET' : 'NOT SET',
        'env_vars' => [
            'CLOUDINARY_CLOUD_NAME' => env('CLOUDINARY_CLOUD_NAME'),
            'CLOUDINARY_API_KEY' => env('CLOUDINARY_API_KEY') ? 'SET' : 'NOT SET',
            'CLOUDINARY_API_SECRET' => env('CLOUDINARY_API_SECRET') ? 'SET' : 'NOT SET'
        ]
    ];
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);



// Password Reset
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);




/*
|--------------------------------------------------------------------------
| Protected Routes (Auth required)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/profile', [AuthController::class, 'profile']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Two Factor Authentication
    Route::post('/two-factor/enable', [TwoFactorAuthController::class, 'enable']);
    Route::post('/two-factor/disable', [TwoFactorAuthController::class, 'disable']);
    Route::post('/two-factor/verify', [TwoFactorAuthController::class, 'verify']);
    Route::post('/two-factor/recovery-codes', [TwoFactorAuthController::class, 'regenerateRecoveryCodes']);
    Route::post('/two-factor/verify-recovery', [TwoFactorAuthController::class, 'verifyRecoveryCode']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Subscriptions
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::put('/subscriptions/{id}', [SubscriptionController::class, 'update']);
    Route::delete('/subscriptions/{id}', [SubscriptionController::class, 'destroy']);

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | Staff Only Routes
    |--------------------------------------------------------------------------
    */
    Route::middleware('staff')->group(function () {

        // Staff Management
        Route::apiResource('staff', StaffController::class);
        Route::post('/staff/{id}/roles', [StaffController::class, 'assignRoles']);

        // Roles
        Route::apiResource('roles', RoleController::class);
         // Property Requests
        Route::get('/properties/requests', [PropertyRequestController::class, 'index']);
        Route::put('/properties/requests/{id}/approve', [PropertyRequestController::class, 'approve']);
        Route::put('/properties/requests/{id}/reject', [PropertyRequestController::class, 'reject']);
        Route::put('/properties/requests/{id}/edit-publish', [PropertyRequestController::class, 'editAndPublish']);

        // Properties Management
        Route::post('/properties', [PropertyController::class, 'store']);
        Route::put('/properties/{id}', [PropertyController::class, 'update']);
        Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
        Route::post('/properties/{id}/images', [PropertyController::class, 'uploadImages']);
        Route::post('/properties/{id}/amenities', [PropertyController::class, 'syncAmenities']);
        //inquiries
        Route::get('/inquiries', [InquiryController::class, 'index']);
        Route::get('/inquiries/{id}', [InquiryController::class, 'show']);
        Route::put('/inquiries/{id}', [InquiryController::class, 'update']);
        // Amenities
        Route::apiResource('amenities', AmenityController::class);

        // Portfolio
        Route::apiResource('portfolio-items', PortfolioController::class);

       
        // Finishing Requests
        Route::get('/finishing-requests', [FinishingRequestController::class, 'index']);
        Route::get('/finishing-requests/{id}', [FinishingRequestController::class, 'show']);
        Route::put('/finishing-requests/{id}', [FinishingRequestController::class, 'update']);

      // Decor Requests
        Route::get('/decor-requests', [DecorRequestController::class, 'index']);
        Route::get('/decor-requests/{id}', [DecorRequestController::class, 'show']);
        Route::post('/decor-requests', [DecorRequestController::class, 'store']); // 🟢 جديد
        Route::put('/decor-requests/{id}', [DecorRequestController::class, 'update']);
        Route::delete('/decor-requests/{id}', [DecorRequestController::class, 'destroy']); // 🟢 جديد
        

       // Site Content
        Route::get('/site-content', [SiteContentController::class, 'index']);
        Route::post('/site-content', [SiteContentController::class, 'store']);
        Route::put('/site-content', [SiteContentController::class, 'update']);  // حذف الـ {key}
        Route::patch('/site-content', [SiteContentController::class, 'update']); // اختياري
        Route::delete('/site-content', [SiteContentController::class, 'destroy']); // حذف الـ {key}



        // Blog
        Route::apiResource('blog-posts', BlogController::class)->except(['index','show']);

        // CRM
        Route::apiResource('customers', CustomerController::class);
        Route::get('/customer-interactions', [CustomerController::class, 'indexInteractions']);
        Route::post('/customer-interactions', [CustomerController::class, 'storeInteraction']);

        // Notifications
        Route::apiResource('notifications', NotificationController::class)->except(['index','show']);
        Route::get('/notifications', [NotificationController::class, 'index']);

        // Plans
        Route::apiResource('plans', PlanController::class);

        // Uploads
        Route::apiResource('uploads', UploadController::class)->except(['index','show']);
        Route::get('/uploads', [UploadController::class, 'index']);

        // Vimeo Video Management
        Route::prefix('vimeo')->group(function () {
            Route::get('/test', [VimeoController::class, 'testConnection']);
            Route::get('/user-info', [VimeoController::class, 'getUserInfo']);
            Route::get('/quota', [VimeoController::class, 'getUploadQuota']);
            Route::get('/videos', [VimeoController::class, 'getUserVideos']);
            Route::post('/videos/upload', [VimeoController::class, 'uploadVideo']);
            Route::get('/videos/{videoId}', [VimeoController::class, 'getVideo']);
            Route::put('/videos/{videoId}', [VimeoController::class, 'updateVideo']);
            Route::delete('/videos/{videoId}', [VimeoController::class, 'deleteVideo']);
            Route::get('/videos/{videoId}/stats', [VimeoController::class, 'getVideoStats']);
            Route::get('/videos/{videoId}/embed', [VimeoController::class, 'generateEmbedHtml']);
        });

    });  
});
// Public requests
Route::post('/finishing-requests', [FinishingRequestController::class, 'store']);
Route::post('/decor-requests', [DecorRequestController::class, 'store']);
Route::post('/inquiries', [InquiryController::class, 'store']);
//property_request
Route::post('/properties/requests', [PropertyRequestController::class, 'store']);
Route::post('/properties/requests/{id}/images', [PropertyRequestController::class, 'uploadImages']);
// Public properties
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);


// Public portfolio
Route::get('/portfolio-items', [PortfolioController::class, 'index']);
Route::get('/portfolio-items/{id}', [PortfolioController::class, 'show']);

//decore-request
Route::post('/decor-requests', [DecorRequestController::class, 'store']); // 🟢 جديد

// Public blog
Route::get('/blog-posts', [BlogController::class, 'index']);
Route::get('/blog-posts/{id}', [BlogController::class, 'show']);
// User-related extra routes
Route::apiResource('users', UserController::class);
Route::get('/site-content', [SiteContentController::class, 'show']);


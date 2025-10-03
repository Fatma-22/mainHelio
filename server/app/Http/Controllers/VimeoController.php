<?php

namespace App\Http\Controllers;

use App\Services\VimeoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class VimeoController extends Controller
{
    protected $vimeoService;

    public function __construct(VimeoService $vimeoService)
    {
        $this->vimeoService = $vimeoService;
    }

    /**
     * Test Vimeo API connection
     */
    public function testConnection(): JsonResponse
    {
        $result = $this->vimeoService->testConnection();
        
        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Vimeo API connection successful' : 'Vimeo API connection failed',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    /**
     * Get user information
     */
    public function getUserInfo(): JsonResponse
    {
        $result = $this->vimeoService->getUserInfo();
        
        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'User info retrieved successfully' : 'Failed to retrieve user info',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    /**
     * Upload a video
     */
    public function uploadVideo(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'video' => 'required|file|mimes:mp4,mov,avi,wmv,flv,webm|max:500000', // 500MB max
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'privacy' => 'nullable|string|in:nobody,anybody,contacts,password,disable,unlisted',
            'allow_download' => 'nullable|boolean',
            'allow_embed' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $videoFile = $request->file('video');
        $options = [];

        // Prepare upload options
        if ($request->filled('name')) {
            $options['name'] = $request->input('name');
        }

        if ($request->filled('description')) {
            $options['description'] = $request->input('description');
        }

        if ($request->filled('privacy')) {
            $options['privacy'] = ['view' => $request->input('privacy')];
        }

        if ($request->has('allow_download')) {
            $options['allow_downloads'] = $request->boolean('allow_download');
        }

        if ($request->has('allow_embed')) {
            $options['embed'] = [
                'buttons' => ['embed' => $request->boolean('allow_embed')]
            ];
        }

        $result = $this->vimeoService->uploadVideo($videoFile, $options);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Video uploaded successfully' : 'Video upload failed',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 201 : 500);
    }

    /**
     * Get video details
     */
    public function getVideo(Request $request, string $videoId): JsonResponse
    {
        $result = $this->vimeoService->getVideo($videoId);
        
        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Video details retrieved successfully' : 'Failed to retrieve video details',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 404);
    }

    /**
     * Update video details
     */
    public function updateVideo(Request $request, string $videoId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
            'privacy' => 'nullable|string|in:nobody,anybody,contacts,password,disable,unlisted',
            'allow_download' => 'nullable|boolean',
            'allow_embed' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = [];

        if ($request->filled('name')) {
            $data['name'] = $request->input('name');
        }

        if ($request->filled('description')) {
            $data['description'] = $request->input('description');
        }

        if ($request->filled('privacy')) {
            $data['privacy'] = ['view' => $request->input('privacy')];
        }

        if ($request->has('allow_download')) {
            $data['allow_downloads'] = $request->boolean('allow_download');
        }

        if ($request->has('allow_embed')) {
            $data['embed'] = [
                'buttons' => ['embed' => $request->boolean('allow_embed')]
            ];
        }

        if (empty($data)) {
            return response()->json([
                'success' => false,
                'message' => 'No data provided for update'
            ], 422);
        }

        $result = $this->vimeoService->updateVideo($videoId, $data);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Video updated successfully' : 'Failed to update video',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    /**
     * Delete a video
     */
    public function deleteVideo(Request $request, string $videoId): JsonResponse
    {
        $result = $this->vimeoService->deleteVideo($videoId);
        
        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Video deleted successfully' : 'Failed to delete video',
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    /**
     * Get user's videos
     */
    public function getUserVideos(Request $request): JsonResponse
    {
        $page = $request->input('page', 1);
        $perPage = min($request->input('per_page', 25), 100); // Max 100 per page

        $result = $this->vimeoService->getUserVideos($page, $perPage);
        
        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Videos retrieved successfully' : 'Failed to retrieve videos',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    /**
     * Generate embed HTML for a video
     */
    public function generateEmbedHtml(Request $request, string $videoId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'width' => 'nullable|integer|min:100|max:1920',
            'height' => 'nullable|integer|min:100|max:1080',
            'autoplay' => 'nullable|boolean',
            'loop' => 'nullable|boolean',
            'muted' => 'nullable|boolean',
            'responsive' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $options = $request->only(['width', 'height', 'autoplay', 'loop', 'muted', 'responsive']);
        $result = $this->vimeoService->generateEmbedHtml($videoId, $options);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Embed HTML generated successfully' : 'Failed to generate embed HTML',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    /**
     * Get upload quota information
     */
    public function getUploadQuota(): JsonResponse
    {
        $result = $this->vimeoService->getUploadQuota();
        
        return response()->json([
            'success' => $result['success'],
            'message' => $result['success'] ? 'Upload quota retrieved successfully' : 'Failed to retrieve upload quota',
            'data' => $result['data'] ?? null,
            'error' => $result['error'] ?? null
        ], $result['success'] ? 200 : 500);
    }

    /**
     * Get video statistics (if available)
     */
    public function getVideoStats(Request $request, string $videoId): JsonResponse
    {
        try {
            $result = $this->vimeoService->getVideo($videoId);
            
            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to retrieve video',
                    'error' => $result['error']
                ], 404);
            }

            $videoData = $result['data'];
            $stats = [
                'views' => $videoData['stats']['plays'] ?? 0,
                'likes' => $videoData['metadata']['connections']['likes']['total'] ?? 0,
                'comments' => $videoData['metadata']['connections']['comments']['total'] ?? 0,
                'duration' => $videoData['duration'] ?? 0,
                'created_time' => $videoData['created_time'] ?? null,
                'modified_time' => $videoData['modified_time'] ?? null
            ];

            return response()->json([
                'success' => true,
                'message' => 'Video statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to get video stats for {$videoId}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve video statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

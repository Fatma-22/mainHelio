<?php

namespace App\Services;

use Vimeo\Vimeo;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Exception;

class VimeoService
{
    protected $vimeo;
    protected $config;

    public function __construct()
    {
        $this->config = config('vimeo');
        
        $this->vimeo = new Vimeo(
            $this->config['client_id'],
            $this->config['client_secret'],
            $this->config['access_token']
        );
    }

    /**
     * Test the Vimeo API connection
     */
    public function testConnection()
    {
        try {
            $response = $this->vimeo->request('/tutorial');
            return [
                'success' => true,
                'data' => $response
            ];
        } catch (Exception $e) {
            Log::error('Vimeo API connection test failed: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get user information
     */
    public function getUserInfo()
    {
        try {
            $response = $this->vimeo->request('/me');
            return [
                'success' => true,
                'data' => $response['body']
            ];
        } catch (Exception $e) {
            Log::error('Failed to get user info: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Upload a video to Vimeo
     */
    public function uploadVideo(UploadedFile $file, array $options = [])
    {
        try {
            // Validate file
            if (!$this->validateVideoFile($file)) {
                return [
                    'success' => false,
                    'error' => 'Invalid video file format or size'
                ];
            }

            // Prepare upload options
            $uploadOptions = array_merge([
                'name' => $file->getClientOriginalName(),
                'description' => 'Uploaded via OnlyHelio Property Management System',
                'privacy' => [
                    'view' => $this->config['default_privacy'],
                    'embed' => $this->config['default_embed']
                ],
                'embed' => [
                    'buttons' => [
                        'like' => true,
                        'watchlater' => true,
                        'share' => true,
                        'embed' => $this->config['default_allow_embed']
                    ],
                    'logos' => [
                        'vimeo' => false
                    ],
                    'title' => [
                        'name' => 'hide',
                        'owner' => 'hide',
                        'portrait' => 'hide'
                    ]
                ],
                'review_link' => false,
                'allow_downloads' => $this->config['default_allow_download'],
                'allow_adds' => $this->config['default_allow_adds']
            ], $options);

            // Start upload
            $uri = $this->vimeo->upload($file->getRealPath(), $uploadOptions);

            if ($uri) {
                // Get video details
                $videoDetails = $this->vimeo->request($uri);
                
                return [
                    'success' => true,
                    'data' => [
                        'uri' => $uri,
                        'video_id' => $this->extractVideoId($uri),
                        'embed_url' => $videoDetails['body']['embed']['html'],
                        'link' => $videoDetails['body']['link'],
                        'player_embed_url' => $videoDetails['body']['player_embed_url'],
                        'details' => $videoDetails['body']
                    ]
                ];
            }

            return [
                'success' => false,
                'error' => 'Upload failed - no URI returned'
            ];

        } catch (Exception $e) {
            Log::error('Video upload failed: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get video details by ID
     */
    public function getVideo($videoId)
    {
        try {
            $response = $this->vimeo->request("/videos/{$videoId}");
            return [
                'success' => true,
                'data' => $response['body']
            ];
        } catch (Exception $e) {
            Log::error("Failed to get video {$videoId}: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Update video details
     */
    public function updateVideo($videoId, array $data)
    {
        try {
            $response = $this->vimeo->request("/videos/{$videoId}", $data, 'PATCH');
            return [
                'success' => true,
                'data' => $response['body']
            ];
        } catch (Exception $e) {
            Log::error("Failed to update video {$videoId}: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete a video
     */
    public function deleteVideo($videoId)
    {
        try {
            $response = $this->vimeo->request("/videos/{$videoId}", [], 'DELETE');
            return [
                'success' => true,
                'data' => $response
            ];
        } catch (Exception $e) {
            Log::error("Failed to delete video {$videoId}: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Get user's videos
     */
    public function getUserVideos($page = 1, $perPage = 25)
    {
        try {
            $response = $this->vimeo->request('/me/videos', [
                'page' => $page,
                'per_page' => $perPage,
                'sort' => 'date',
                'direction' => 'desc'
            ]);
            
            return [
                'success' => true,
                'data' => $response['body']
            ];
        } catch (Exception $e) {
            Log::error('Failed to get user videos: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Generate embed HTML for a video
     */
    public function generateEmbedHtml($videoId, array $options = [])
    {
        try {
            $video = $this->getVideo($videoId);
            
            if (!$video['success']) {
                return [
                    'success' => false,
                    'error' => $video['error']
                ];
            }

            $embedOptions = array_merge([
                'width' => 640,
                'height' => 360,
                'autoplay' => false,
                'loop' => false,
                'muted' => false,
                'responsive' => true
            ], $options);

            $embedHtml = $video['data']['embed']['html'];
            
            // Customize embed HTML with options
            if ($embedOptions['responsive']) {
                $embedHtml = str_replace(
                    'width="640" height="360"',
                    'width="' . $embedOptions['width'] . '" height="' . $embedOptions['height'] . '" style="width: 100%; height: auto;"',
                    $embedHtml
                );
            }

            return [
                'success' => true,
                'data' => [
                    'embed_html' => $embedHtml,
                    'video_url' => $video['data']['link'],
                    'thumbnail_url' => $video['data']['pictures']['sizes'][3]['link'] ?? $video['data']['pictures']['sizes'][0]['link']
                ]
            ];
        } catch (Exception $e) {
            Log::error("Failed to generate embed HTML for video {$videoId}: " . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Validate video file
     */
    protected function validateVideoFile(UploadedFile $file)
    {
        // Check file size
        if ($file->getSize() > $this->config['max_file_size']) {
            return false;
        }

        // Check file extension
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, $this->config['allowed_formats'])) {
            return false;
        }

        return true;
    }

    /**
     * Extract video ID from Vimeo URI
     */
    protected function extractVideoId($uri)
    {
        return basename($uri);
    }

    /**
     * Get upload quota information
     */
    public function getUploadQuota()
    {
        try {
            $response = $this->vimeo->request('/me');
            return [
                'success' => true,
                'data' => [
                    'upload_quota' => $response['body']['upload_quota']
                ]
            ];
        } catch (Exception $e) {
            Log::error('Failed to get upload quota: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}

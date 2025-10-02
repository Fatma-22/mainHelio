<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Vimeo API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Vimeo API integration
    |
    */

    'client_id' => env('VIMEO_CLIENT_ID'),
    'client_secret' => env('VIMEO_CLIENT_SECRET'),
    'access_token' => env('VIMEO_ACCESS_TOKEN'),
    
    /*
    |--------------------------------------------------------------------------
    | Default Settings
    |--------------------------------------------------------------------------
    |
    | Default settings for video uploads and operations
    |
    */
    
    'default_privacy' => 'nobody', // nobody, anybody, contacts, password, disable, unlisted
    'default_embed' => 'private', // private, public
    'default_allow_download' => false,
    'default_allow_embed' => true,
    'default_allow_adds' => false,
    
    /*
    |--------------------------------------------------------------------------
    | Upload Settings
    |--------------------------------------------------------------------------
    |
    | Settings for video uploads
    |
    */
    
    'upload_chunk_size' => 8 * 1024 * 1024, // 8MB chunks
    'max_file_size' => 500 * 1024 * 1024, // 500MB max file size
    'allowed_formats' => ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
];

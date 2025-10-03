# Vimeo API Integration for OnlyHelio

This document explains the complete Vimeo API integration setup for the OnlyHelio property management system.

## Overview

The integration allows you to:

-   Upload property videos to Vimeo
-   Manage video metadata and privacy settings
-   Generate embed codes for property listings
-   Track video statistics and analytics
-   Manage video library through the admin panel

## Setup Components

### 1. Dependencies

-   **Vimeo PHP SDK**: Added to `composer.json`
-   **Configuration**: `config/vimeo.php`
-   **Service Class**: `app/Services/VimeoService.php`
-   **Controller**: `app/Http/Controllers/VimeoController.php`
-   **API Routes**: Added to `routes/api.php`

### 2. Your Vimeo App Credentials

```
App Name: onlyhelio
Client ID: 6d55246f7ee387c6787daf13be2417cc1483bcb3
Client Secret: J0VYil2wYCvxNtXGgOKK5xcV/BmtyGWWSesGXw8oyhbn9nEEuI1kTQChJj7RfpY62CdeIpc1usu0CJQ8+Fbl8smHccxmHR6Du9D9yHexbv50VQE82upSUmck30TWCSXU
Access Token: ad76cc811004cd9676f7aa142c3ed3f7
```

## API Endpoints

All endpoints require authentication (staff middleware).

### Test Connection

```
GET /api/vimeo/test
```

Tests the Vimeo API connection.

### User Information

```
GET /api/vimeo/user-info
```

Gets your Vimeo account information and upload quota.

### Upload Video

```
POST /api/vimeo/videos/upload
Content-Type: multipart/form-data

Parameters:
- video: File (required) - Video file to upload
- name: String (optional) - Video title
- description: String (optional) - Video description
- privacy: String (optional) - Privacy setting (nobody, anybody, contacts, password, disable, unlisted)
- allow_download: Boolean (optional) - Allow downloads
- allow_embed: Boolean (optional) - Allow embedding
```

### Get User Videos

```
GET /api/vimeo/videos?page=1&per_page=25
```

Retrieves your uploaded videos with pagination.

### Get Video Details

```
GET /api/vimeo/videos/{videoId}
```

Gets detailed information about a specific video.

### Update Video

```
PUT /api/vimeo/videos/{videoId}
Content-Type: application/json

Parameters:
- name: String (optional)
- description: String (optional)
- privacy: String (optional)
- allow_download: Boolean (optional)
- allow_embed: Boolean (optional)
```

### Delete Video

```
DELETE /api/vimeo/videos/{videoId}
```

Deletes a video from Vimeo.

### Generate Embed HTML

```
GET /api/vimeo/videos/{videoId}/embed?width=640&height=360&responsive=true
```

Generates embed HTML for a video with customizable options.

### Get Video Statistics

```
GET /api/vimeo/videos/{videoId}/stats
```

Gets video statistics (views, likes, comments, etc.).

### Get Upload Quota

```
GET /api/vimeo/quota
```

Gets your current upload quota information.

## Configuration

The Vimeo configuration is stored in `config/vimeo.php`:

```php
return [
    'client_id' => env('VIMEO_CLIENT_ID', '6d55246f7ee387c6787daf13be2417cc1483bcb3'),
    'client_secret' => env('VIMEO_CLIENT_SECRET', 'J0VYil2wYCvxNtXGgOKK5xcV/BmtyGWWSesGXw8oyhbn9nEEuI1kTQChJj7RfpY62CdeIpc1usu0CJQ8+Fbl8smHccxmHR6Du9D9yHexbv50VQE82upSUmck30TWCSXU'),
    'access_token' => env('VIMEO_ACCESS_TOKEN', 'ad76cc811004cd9676f7aa142c3ed3f7'),

    'default_privacy' => 'nobody',
    'default_embed' => 'private',
    'default_allow_download' => false,
    'default_allow_embed' => true,
    'default_allow_adds' => false,

    'upload_chunk_size' => 8 * 1024 * 1024, // 8MB
    'max_file_size' => 500 * 1024 * 1024, // 500MB
    'allowed_formats' => ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'],
];
```

## Environment Variables

Add these to your `.env` file (optional, defaults are already set):

```env
VIMEO_CLIENT_ID=6d55246f7ee387c6787daf13be2417cc1483bcb3
VIMEO_CLIENT_SECRET=J0VYil2wYCvxNtXGgOKK5xcV/BmtyGWWSesGXw8oyhbn9nEEuI1kTQChJj7RfpY62CdeIpc1usu0CJQ8+Fbl8smHccxmHR6Du9D9yHexbv50VQE82upSUmck30TWCSXU
VIMEO_ACCESS_TOKEN=ad76cc811004cd9676f7aa142c3ed3f7
```

## Usage Examples

### 1. Test the Integration

```bash
php test_vimeo.php
```

### 2. Upload a Video via API

```bash
curl -X POST "http://your-domain.com/api/vimeo/videos/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@property_video.mp4" \
  -F "name=Property Tour Video" \
  -F "description=Beautiful property tour for luxury apartment" \
  -F "privacy=nobody"
```

### 3. Get Embed HTML for Property Page

```bash
curl -X GET "http://your-domain.com/api/vimeo/videos/123456789/embed?responsive=true" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Integration with Property Management

### Frontend Integration

You can use the Vimeo embed codes in your property listings:

```javascript
// Fetch embed HTML for a property video
const response = await fetch(
    "/api/vimeo/videos/" + videoId + "/embed?responsive=true",
    {
        headers: {
            Authorization: "Bearer " + token,
        },
    }
);
const data = await response.json();

// Use the embed HTML
document.getElementById("video-container").innerHTML = data.data.embed_html;
```

### Admin Panel Integration

Staff can manage videos through the admin panel:

1. Upload property videos
2. Set privacy and embedding options
3. Generate embed codes for property listings
4. Monitor video statistics

## Security Considerations

1. **Access Token**: Keep your access token secure and never expose it in frontend code
2. **File Validation**: The system validates file types and sizes before upload
3. **Privacy Settings**: Videos are set to private by default
4. **Staff Only**: All Vimeo endpoints require staff authentication

## Error Handling

The system includes comprehensive error handling:

-   API connection failures
-   Invalid file formats
-   Upload quota exceeded
-   Invalid video IDs
-   Network timeouts

All errors are logged and return appropriate HTTP status codes.

## Testing

Run the test script to verify everything works:

```bash
cd server
php test_vimeo.php
```

## Support

If you encounter any issues:

1. Check the Laravel logs in `storage/logs/`
2. Verify your Vimeo credentials
3. Ensure you have sufficient upload quota
4. Check file size and format restrictions

## Next Steps

1. Install dependencies: `composer install`
2. Test the connection: `php test_vimeo.php`
3. Start using the API endpoints
4. Integrate with your property management frontend
5. Set up video management in your admin panel

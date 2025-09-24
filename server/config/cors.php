<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'auth/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://onlyhelio.com','https://dashboard.onlyhelio.com'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Africa's Talking Credentials
    |--------------------------------------------------------------------------
    |
    | username: use 'sandbox' for testing, your AT username for production
    | api_key:  from your Africa's Talking dashboard
    | sender_id: optional branded sender name (requires AT approval for live)
    |
    */

    'username'  => env('AT_USERNAME', 'sandbox'),
    'api_key'   => env('AT_API_KEY', ''),
    'sender_id' => env('AT_SENDER_ID', null),
];

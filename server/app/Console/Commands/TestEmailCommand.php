<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailCommand extends Command
{
    protected $signature = 'email:test';
    protected $description = 'Test email sending';

    public function handle()
    {
        try {
            Mail::raw('This is a test email', function ($message) {
                $message->to('fatma.gamal.shams@gmail.com')
                        ->subject('Test Email');
            });
            
            $this->info('Email sent successfully!');
        } catch (\Exception $e) {
            $this->error('Error sending email: ' . $e->getMessage());
        }
        
        return 0;
    }
}
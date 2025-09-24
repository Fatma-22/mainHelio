<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;

class VerifyEmail extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        try {
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes(60),
                ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())]
            );

            return (new MailMessage)
                ->subject('تحقق من عنوان بريدك الإلكتروني - Helio API')
                ->line('يرجى النقر على الزر أدناه للتحقق من عنوان بريدك الإلكتروني.')
                ->action('تحقق من البريد الإلكتروني', $verificationUrl)
                ->line('إذا لم تقم بإنشاء حساب، فلا يلزم اتخاذ أي إجراء آخر.');
        } catch (\Exception $e) {
            Log::error('Failed to create verification email: ' . $e->getMessage());
            throw $e;
        }
    }
}
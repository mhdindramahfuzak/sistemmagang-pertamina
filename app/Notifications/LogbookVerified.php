<?php

namespace App\Notifications;

use App\Models\Logbook;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LogbookVerified extends Notification
{
    use Queueable;

    protected $logbook;

    public function __construct(Logbook $logbook)
    {
        $this->logbook = $logbook;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // Kirim via email dan simpan ke DB
    }

    public function toMail(object $notifiable): MailMessage
    {
        $statusText = $this->logbook->status === 'verified' ? 'disetujui' : 'ditolak';
        $url = route('logbooks.index'); // Link ke halaman logbook

        return (new MailMessage)
                    ->subject('Status Logbook Anda Diperbarui')
                    ->greeting('Halo ' . $notifiable->name . ',')
                    ->line("Logbook Anda untuk tanggal {$this->logbook->date} telah {$statusText} oleh pembimbing.")
                    ->line("Judul: " . $this->logbook->title)
                    ->line("Komentar: " . ($this->logbook->supervisor_comment ?: '-'))
                    ->action('Lihat Logbook', $url)
                    ->line('Terima kasih telah menggunakan aplikasi SIMAGANG.');
    }

    public function toArray(object $notifiable): array
    {
        $statusText = $this->logbook->status === 'verified' ? 'disetujui' : 'ditolak';
        return [
            'logbook_id' => $this->logbook->id,
            'title' => "Logbook {$this->logbook->date} telah {$statusText}.",
            'url' => route('logbooks.index'),
        ];
    }
}
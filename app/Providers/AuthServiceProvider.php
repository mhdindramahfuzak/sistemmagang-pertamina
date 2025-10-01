<?php

namespace App\Providers;

use App\Models\Logbook; 
use App\Policies\LogbookPolicy; 
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Logbook::class => LogbookPolicy::class, // <-- Tambahkan baris ini
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Gate::define('verify-logbooks', function ($user) {
        return $user->hasRole('supervisor');
    });
    }
}
<?php

namespace App\Http\Controllers\Concerns;

trait AuthorizesDisposisi
{
    protected function authorizeDisposisi(): void
    {
        abort_unless(auth()->user()?->canCreateDisposisi(), 403, 'Unauthorized');
    }
}

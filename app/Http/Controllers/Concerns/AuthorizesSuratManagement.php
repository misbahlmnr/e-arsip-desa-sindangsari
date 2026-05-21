<?php

namespace App\Http\Controllers\Concerns;

trait AuthorizesSuratManagement
{
    protected function authorizeSuratManagement(): void
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Unauthorized');
    }
}

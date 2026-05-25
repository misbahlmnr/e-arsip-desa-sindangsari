<?php

namespace App\Http\Requests\Disposisi;

use App\Models\Disposisi;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFromSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canCreateDisposisi() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'kepada' => ['required', 'string', Rule::in(Disposisi::TUJUAN_OPTIONS)],
            'catatan' => ['required', 'string', 'max:500'],
        ];
    }
}

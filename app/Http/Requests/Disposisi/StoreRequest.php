<?php

namespace App\Http\Requests\Disposisi;

use App\Models\Disposisi;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
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
            'surat_masuk_id' => ['required', 'integer', 'exists:surat_masuk,id'],
            'kepada' => ['required', 'string', Rule::in(Disposisi::TUJUAN_OPTIONS)],
            'catatan' => ['required', 'string', 'max:500'],
            'tanggal' => ['required', 'date'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'surat_masuk_id' => 'surat',
            'kepada' => 'tujuan',
            'catatan' => 'catatan',
            'tanggal' => 'tanggal',
        ];
    }
}

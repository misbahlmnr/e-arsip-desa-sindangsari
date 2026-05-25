<?php

namespace App\Http\Requests\Disposisi;

use App\Models\Disposisi;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
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
            'status' => ['required', 'string', Rule::in([
                Disposisi::STATUS_DIPROSES,
                Disposisi::STATUS_SELESAI,
            ])],
        ];
    }
}

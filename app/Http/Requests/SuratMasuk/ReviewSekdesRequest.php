<?php

namespace App\Http\Requests\SuratMasuk;

use App\Models\SuratMasuk;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewSekdesRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user?->isSekdes()) {
            return false;
        }

        /** @var SuratMasuk|null $surat */
        $surat = $this->route('surat_masuk');

        return $surat instanceof SuratMasuk && $surat->canReviewBySekdes();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'tingkat' => ['required', Rule::in(SuratMasuk::TINGKAT_OPTIONS)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'tingkat' => 'tingkat surat',
        ];
    }
}

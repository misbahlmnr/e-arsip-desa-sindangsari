<?php

namespace App\Http\Requests\Disposisi;

use App\Models\SuratMasuk;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFromSuratRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        /** @var SuratMasuk|null $surat */
        $surat = $this->route('surat_masuk');

        if (! $user || ! $surat instanceof SuratMasuk) {
            return false;
        }

        return $surat->canCreateDisposisi($user);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'jabatan_tujuan_id' => [
                'required',
                'integer',
                Rule::exists('jabatan_tujuan_disposisi', 'id')->where('is_active', true),
            ],
            'catatan' => ['required', 'string', 'max:500'],
        ];
    }
}

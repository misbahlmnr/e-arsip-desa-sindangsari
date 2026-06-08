<?php

namespace App\Http\Requests\Disposisi;

use App\Models\SuratMasuk;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user?->isSekdes() && ! $user?->isKades()) {
            return false;
        }

        $suratId = $this->input('surat_masuk_id');
        if (! $suratId) {
            return true;
        }

        $surat = SuratMasuk::query()->find($suratId);

        return $surat instanceof SuratMasuk && $surat->canCreateDisposisi($user);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'surat_masuk_id' => ['required', 'integer', 'exists:surat_masuk,id'],
            'jabatan_tujuan_id' => [
                'required',
                'integer',
                Rule::exists('jabatan_tujuan_disposisi', 'id')->where('is_active', true),
            ],
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
            'jabatan_tujuan_id' => 'tujuan',
            'catatan' => 'catatan',
            'tanggal' => 'tanggal',
        ];
    }
}

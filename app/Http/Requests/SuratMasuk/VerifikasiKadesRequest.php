<?php

namespace App\Http\Requests\SuratMasuk;

use App\Models\SuratMasuk;
use Illuminate\Foundation\Http\FormRequest;

class VerifikasiKadesRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        if (! $user?->isKades()) {
            return false;
        }

        /** @var SuratMasuk|null $surat */
        $surat = $this->route('surat_masuk');

        return $surat instanceof SuratMasuk && $surat->canVerifyByKades();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}

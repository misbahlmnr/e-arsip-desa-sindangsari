<?php

namespace App\Http\Requests\SuratMasuk;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    use NormalizesSuratMasukInput;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizeSuratMasukAliases();

        if (! $this->filled('status')) {
            $this->merge(['status' => 'belum_diproses']);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'no_surat' => ['required', 'string', 'max:120', Rule::unique('surat_masuk', 'no_surat')],
            'tanggal_terima' => ['required', 'date'],
            'tanggal_surat' => ['required', 'date'],
            'pengirim' => ['required', 'string', 'max:120'],
            'perihal' => ['required', 'string', 'max:250'],
            'catatan' => ['nullable', 'string', 'max:5000'],
            'status' => ['required', 'in:belum_diproses,sedang_diproses,selesai'],
            'tujuan' => ['nullable', 'string', 'max:191'],
            'file' => ['nullable', 'file', 'mimes:pdf,jpeg,jpg,png,doc,docx', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'no_surat' => 'nomor surat',
            'tanggal_terima' => 'tanggal diterima',
            'tanggal_surat' => 'tanggal surat',
        ];
    }
}

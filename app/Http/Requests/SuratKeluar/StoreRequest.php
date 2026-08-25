<?php

namespace App\Http\Requests\SuratKeluar;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    use NormalizesSuratKeluarInput;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->normalizeSuratKeluarAliases();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'no_surat' => 'required|string|unique:surat_keluar,no_surat',
            'tanggal_kirim' => 'required|date',
            'tujuan' => 'required|string',
            'perihal' => 'required|string',
            'catatan' => 'nullable|string',
            'status' => 'required|in:draft,terkirim',
            'file' => 'required|file|mimes:pdf,doc,docx',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'no_surat' => 'nomor surat',
            'tanggal_kirim' => 'tanggal kirim',
            'tujuan' => 'tujuan',
            'perihal' => 'perihal',
            'catatan' => 'catatan',
            'status' => 'status',
            'file' => 'lampiran',
        ];
    }
}

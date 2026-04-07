<?php

namespace App\Http\Requests\SuratMasuk;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "nomor_registrasi" => "required|string|unique:letters,nomor_registrasi",
            "no_surat" => "required|string|unique:letters,no_surat",
            "tanggal_terima" => "required|date",
            "pengirim" => "required|string",
            "perihal" => "required|string",
            "status" => "required|in:belum_diproses,sedang_diproses,selesai",
            "tujuan" => "nullable|string",
            "file" => "required|file|mimes:pdf,doc,docx",
        ];
    }
}

<?php

namespace App\Http\Requests\SuratKeluar;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
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
            "no_surat" => [
                "required",
                "string",
                Rule::unique("letters", "no_surat")->ignore($this->route("surat_keluar")),
            ],
            "tanggal_kirim" => ["required", "date"],
            "tujuan" => ["required", "string"],
            "perihal" => ["required", "string"],
            "file" => ["nullable", "file", "mimes:pdf,doc,docx"],
        ];
    }
}

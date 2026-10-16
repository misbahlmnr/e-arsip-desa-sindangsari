<?php

namespace App\Http\Requests;

use App\Services\SupportingDocumentService;
use Illuminate\Database\Eloquent\Model;

trait ValidatesSupportingDocuments
{
    /**
     * @return array<string, mixed>
     */
    protected function supportingDocumentRules(bool $withRemoval = false): array
    {
        $rules = [
            'supporting_files' => ['nullable', 'array', 'max:'.SupportingDocumentService::MAX_PER_LETTER],
            'supporting_files.*' => ['file', 'mimes:pdf,doc,docx,jpg,jpeg,png', 'max:5120'],
        ];

        if ($withRemoval) {
            $rules['remove_supporting_ids'] = ['nullable', 'array'];
            $rules['remove_supporting_ids.*'] = ['integer'];
        }

        return $rules;
    }

    protected function assertSupportingDocumentLimits($validator, Model $letter): void
    {
        $validator->after(function ($validator) use ($letter) {
            $removeIds = collect($this->input('remove_supporting_ids', []))
                ->filter(fn ($id) => $id !== null && $id !== '')
                ->map(fn ($id) => (int) $id)
                ->unique()
                ->values();

            if ($removeIds->isNotEmpty()) {
                $owned = $letter->supportingDocuments()->whereIn('id', $removeIds)->count();

                if ($owned !== $removeIds->count()) {
                    $validator->errors()->add(
                        'remove_supporting_ids',
                        'Dokumen pendukung tidak ditemukan pada surat ini.',
                    );
                }
            }

            $newFiles = $this->file('supporting_files') ?? [];
            $newCount = is_array($newFiles) ? count(array_filter($newFiles)) : 0;
            $existing = $letter->supportingDocuments()->count();

            if (($existing - $removeIds->count() + $newCount) > SupportingDocumentService::MAX_PER_LETTER) {
                $validator->errors()->add(
                    'supporting_files',
                    'Maksimal 10 dokumen pendukung untuk satu surat.',
                );
            }
        });
    }
}

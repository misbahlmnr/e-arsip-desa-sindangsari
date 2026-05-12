<?php

namespace App\Http\Requests\SuratKeluar;

trait NormalizesSuratKeluarInput
{
    /**
     * Map field names from the form desain (UI) ke kolom database.
     */
    protected function normalizeSuratKeluarAliases(): void
    {
        if ($this->filled('nomor_surat') && ! $this->filled('no_surat')) {
            $this->merge(['no_surat' => $this->input('nomor_surat')]);
        }

        if ($this->input('tujuan') === '' || $this->input('tujuan') === null) {
            $this->merge(['tujuan' => '-']);
        }

        foreach (['tanggal_kirim'] as $key) {
            if ($this->has($key) && $this->input($key) === '') {
                $this->merge([$key => null]);
            }
        }
    }
}

<?php

namespace App\Http\Requests\SuratMasuk;

trait NormalizesSuratMasukInput
{
    /**
     * Map field names from the form desain (UI) ke kolom database.
     */
    protected function normalizeSuratMasukAliases(): void
    {
        if ($this->filled('nomor_surat') && ! $this->filled('no_surat')) {
            $this->merge(['no_surat' => $this->input('nomor_surat')]);
        }

        if ($this->has('tanggal_diterima') && ! $this->filled('tanggal_terima')) {
            $this->merge(['tanggal_terima' => $this->input('tanggal_diterima')]);
        }

        if ($this->input('tujuan') === '' || $this->input('tujuan') === null) {
            $this->merge(['tujuan' => '-']);
        }

        foreach (['tanggal_surat'] as $key) {
            if ($this->has($key) && $this->input($key) === '') {
                $this->merge([$key => null]);
            }
        }
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    protected $fillable = [
        'nomor_registrasi',
        'no_surat',
        'tanggal_terima',
        'pengirim',
        'perihal',
        'status',
        'tujuan',
        'file',
    ];
}

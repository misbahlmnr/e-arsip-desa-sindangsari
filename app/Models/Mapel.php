<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $table = 'mapel';
    protected $fillable = ['nama', 'kelas_id'];

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    public function gurus()
    {
        return $this->belongsToMany(User::class, 'guru_mapel', 'mapel_id', 'guru_id');
    }

    public function jadwal()
    {
        return $this->hasMany(Jadwal::class);
    }

    public function materi()
    {
        return $this->hasMany(Materi::class);
    }

    public function tugas()
    {
        return $this->hasMany(Tugas::class);
    }

    public function adaptiveRules()
    {
        return $this->hasMany(AdaptiveRule::class);
    }
}

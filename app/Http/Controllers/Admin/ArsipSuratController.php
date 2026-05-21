<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArsipSuratController extends Controller
{
    /**
     * @var list<string>
     */
    private const SORTABLE = ['no_surat', 'tanggal_surat', 'diarsipkan_at'];

    public function index(Request $request)
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:64'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:8,10,20,50,100'],
            'jenis' => ['nullable', 'in:all,masuk,keluar'],
            'range' => ['nullable', 'in:all,7d,30d,90d'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $jenis = $validated['jenis'] ?? 'all';
        $range = $validated['range'] ?? 'all';

        $sortBy = $validated['sort_by'] ?? 'diarsipkan_at';
        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'diarsipkan_at';
        }

        $query = $this->arsipBaseQuery($jenis);

        if ($search !== '') {
            $like = '%'.$search.'%';
            $query->where(function ($q) use ($like) {
                $q->where('no_surat', 'like', $like)
                    ->orWhere('pihak', 'like', $like)
                    ->orWhere('perihal', 'like', $like);
            });
        }

        if ($range !== 'all') {
            $days = match ($range) {
                '7d' => 7,
                '30d' => 30,
                '90d' => 90,
                default => null,
            };
            if ($days !== null) {
                $query->where('diarsipkan_at', '>=', now()->subDays($days));
            }
        }

        $query->orderBy($sortBy, $sortDir);

        $letters = $query->paginate($perPage)->withQueryString();

        return inertia('arsip-surat/Index', [
            'letters' => $letters,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
                'jenis' => $jenis,
                'range' => $range,
            ],
        ]);
    }

    public function show(Request $request, string $jenis, int $id)
    {
        if (! in_array($jenis, ['masuk', 'keluar'], true)) {
            abort(404);
        }

        if ($jenis === 'masuk') {
            $letter = SuratMasuk::query()
                ->whereNotNull('diarsipkan_at')
                ->findOrFail($id);
        } else {
            $letter = SuratKeluar::query()
                ->whereNotNull('diarsipkan_at')
                ->findOrFail($id);
        }

        return inertia('arsip-surat/Show', [
            'jenis' => $jenis,
            'letter' => $letter,
        ]);
    }

    /**
     * @return \Illuminate\Database\Query\Builder
     */
    private function arsipBaseQuery(string $jenis)
    {
        $masuk = DB::table('surat_masuk')
            ->selectRaw("'masuk' as jenis, id, no_surat, perihal, pengirim as pihak, COALESCE(tanggal_surat, tanggal_terima) as tanggal_surat, diarsipkan_at")
            ->whereNotNull('diarsipkan_at');

        $keluar = DB::table('surat_keluar')
            ->selectRaw("'keluar' as jenis, id, no_surat, perihal, tujuan as pihak, tanggal_kirim as tanggal_surat, diarsipkan_at")
            ->whereNotNull('diarsipkan_at');

        if ($jenis === 'masuk') {
            return DB::query()->fromSub($masuk, 'arsip');
        }

        if ($jenis === 'keluar') {
            return DB::query()->fromSub($keluar, 'arsip');
        }

        $union = $masuk->unionAll($keluar);

        return DB::query()->fromSub($union, 'arsip');
    }
}

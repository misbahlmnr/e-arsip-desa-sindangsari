<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Http\Requests\SuratMasuk\UpdateRequest;
use App\Models\Letter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SuratMasukController extends Controller
{
    /**
     * Sortable columns (whitelist) — prevents arbitrary ORDER BY injection.
     *
     * @var list<string>
     */
    private const SORTABLE = [
        'id',
        'nomor_registrasi',
        'no_surat',
        'tanggal_terima',
        'pengirim',
        'perihal',
        'status',
        'tujuan',
        'created_at',
    ];

    public function index(Request $request)
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'string', 'max:64'],
            'sort_dir' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'in:10,20,50,100'],
        ]);

        $search = isset($validated['search']) ? trim($validated['search']) : '';
        $perPage = (int) ($validated['per_page'] ?? 10);
        $sortBy = $validated['sort_by'] ?? 'tanggal_terima';
        $sortDir = $validated['sort_dir'] ?? 'desc';

        if (! in_array($sortBy, self::SORTABLE, true)) {
            $sortBy = 'tanggal_terima';
        }

        $query = Letter::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $like = '%'.$search.'%';
                    $q->where('no_surat', 'like', $like)
                        ->orWhere('pengirim', 'like', $like)
                        ->orWhere('perihal', 'like', $like);
                });
            })
            ->orderBy($sortBy, $sortDir);

        $letters = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/SuratMasuk/Index', [
            'letters' => $letters,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'sort_by' => $sortBy,
                'sort_dir' => $sortDir,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(StoreRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('surat-masuk', 'public');
            $data['file'] = $filePath;
        }

        Letter::create($data);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil ditambahkan.');
    }

    public function update(UpdateRequest $request, Letter $surat_masuk)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            if ($surat_masuk->file && Storage::disk('public')->exists($surat_masuk->file)) {
                Storage::disk('public')->delete($surat_masuk->file);
            }
            $data['file'] = $request->file('file')->store('surat-masuk', 'public');
        } else {
            unset($data['file']);
        }

        $surat_masuk->update($data);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil diperbarui.');
    }

    public function destroy(Letter $surat_masuk)
    {
        if ($surat_masuk->file && Storage::disk('public')->exists($surat_masuk->file)) {
            Storage::disk('public')->delete($surat_masuk->file);
        }

        $surat_masuk->delete();

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil dihapus.');
    }
}

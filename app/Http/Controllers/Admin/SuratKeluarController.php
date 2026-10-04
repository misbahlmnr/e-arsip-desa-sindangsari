<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesSuratManagement;
use App\Http\Controllers\Controller;
use App\Http\Requests\SuratKeluar\StoreRequest;
use App\Http\Requests\SuratKeluar\UpdateRequest;
use App\Models\SuratKeluar;
use App\Services\NomorAgendaService;
use App\Services\SuratKeluarService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SuratKeluarController extends Controller
{
    use AuthorizesSuratManagement;
    public function __construct(protected SuratKeluarService $services)
    {
        $this->services = $services;
    }

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('surat-keluar/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function create(Request $request, NomorAgendaService $nomorAgenda)
    {
        $this->authorizeSuratManagement();

        return inertia('surat-keluar/Create', [
            'nomorAgendaPreview' => $nomorAgenda->preview(
                NomorAgendaService::KODE_KELUAR,
                $this->agendaPreviewDate($request),
                SuratKeluar::class,
            ),
        ]);
    }

    private function agendaPreviewDate(Request $request): string
    {
        $tanggal = $request->query('tanggal_kirim');

        if (is_string($tanggal) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal) === 1) {
            $parsed = Carbon::createFromFormat('Y-m-d', $tanggal);

            if ($parsed instanceof Carbon && $parsed->format('Y-m-d') === $tanggal) {
                return $tanggal;
            }
        }

        return now()->toDateString();
    }

    public function show(SuratKeluar $surat_keluar)
    {
        $surat_keluar->load('supportingDocuments');

        return inertia('surat-keluar/Show', [
            'letter' => $surat_keluar,
        ]);
    }

    public function edit(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        return inertia('surat-keluar/Edit', [
            'letter' => $surat_keluar->load('supportingDocuments'),
        ]);
    }

    public function store(StoreRequest $req)
    {
        $this->authorizeSuratManagement();

        $this->services->store($req);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil ditambahkan.');
    }

    public function update(UpdateRequest $req, SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        $this->services->update($req, $surat_keluar);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil diperbarui.');
    }

    public function destroy(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        $this->services->destroy($surat_keluar);

        return redirect()->route('admin.surat-keluar.index')->with('success', 'Surat Keluar berhasil dihapus.');
    }

    public function archive(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        $result = $this->performArchive($surat_keluar);

        return back()->with($result['flash'], $result['message']);
    }

    public function archiveSelected(Request $request)
    {
        $this->authorizeSuratManagement();

        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct', 'exists:surat_keluar,id'],
        ]);

        $letters = SuratKeluar::query()->whereIn('id', $validated['ids'])->get()->keyBy('id');
        $archived = 0;
        $skippedByReason = [];

        foreach ($validated['ids'] as $id) {
            $result = $this->performArchive($letters->get($id));

            if ($result['archived']) {
                $archived++;

                continue;
            }

            $skippedByReason[$result['message']] = ($skippedByReason[$result['message']] ?? 0) + 1;
        }

        return $this->bulkArchiveRedirect($archived, $skippedByReason);
    }

    /**
     * @return array{archived: bool, flash: string, message: string}
     */
    private function performArchive(SuratKeluar $surat_keluar): array
    {
        if ($surat_keluar->diarsipkan_at) {
            return [
                'archived' => false,
                'flash' => 'info',
                'message' => 'Surat ini sudah berada di arsip.',
            ];
        }

        $this->services->archive($surat_keluar);

        return [
            'archived' => true,
            'flash' => 'success',
            'message' => 'Surat keluar berhasil diarsipkan.',
        ];
    }

    /**
     * @param  array<string, int>  $skippedByReason
     */
    private function bulkArchiveRedirect(int $archived, array $skippedByReason)
    {
        $skipped = array_sum($skippedByReason);
        $parts = [];

        if ($archived > 0) {
            $parts[] = $archived.' surat berhasil diarsipkan.';
        }

        if ($skipped > 0) {
            $reasons = [];

            foreach ($skippedByReason as $reason => $count) {
                $reasons[] = $count > 1 ? $reason.' ('.$count.')' : $reason;
            }

            $parts[] = $skipped.' surat dilewati: '.implode(' ', $reasons);
        }

        $message = implode(' ', $parts);

        if ($archived > 0) {
            return back()->with('success', $message);
        }

        return back()->with('error', $message !== '' ? $message : 'Tidak ada surat yang diarsipkan.');
    }

    public function unarchive(SuratKeluar $surat_keluar)
    {
        $this->authorizeSuratManagement();

        if (! $surat_keluar->diarsipkan_at) {
            return redirect()
                ->route('admin.surat-keluar.show', $surat_keluar)
                ->with('info', 'Surat ini tidak dalam arsip.');
        }

        $this->services->unarchive($surat_keluar);

        return redirect()
            ->route('admin.surat-keluar.show', $surat_keluar)
            ->with('success', 'Surat keluar dikembalikan ke daftar aktif.');
    }
}

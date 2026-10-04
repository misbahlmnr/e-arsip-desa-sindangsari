<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\AuthorizesSuratManagement;
use App\Http\Controllers\Controller;
use App\Http\Requests\SuratMasuk\ReviewSekdesRequest;
use App\Http\Requests\SuratMasuk\StoreRequest;
use App\Http\Requests\SuratMasuk\UpdateRequest;
use App\Http\Requests\SuratMasuk\VerifikasiKadesRequest;
use App\Models\JabatanTujuanDisposisi;
use App\Models\SuratMasuk;
use App\Services\DisposisiService;
use App\Services\NomorAgendaService;
use App\Services\SuratMasukService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SuratMasukController extends Controller
{
    use AuthorizesSuratManagement;

    public function __construct(
        protected SuratMasukService $services,
        protected DisposisiService $disposisiService,
    ) {}

    public function index(Request $request)
    {
        $data = $this->services->index($request);

        return inertia('surat-masuk/Index', [
            'letters' => $data['letters'],
            'filters' => $data['filters'],
        ]);
    }

    public function create(Request $request, NomorAgendaService $nomorAgenda)
    {
        $this->authorizeSuratManagement();

        return inertia('surat-masuk/Create', [
            'nomorAgendaPreview' => $nomorAgenda->preview(
                NomorAgendaService::KODE_MASUK,
                $this->agendaPreviewDate($request),
                SuratMasuk::class,
            ),
        ]);
    }

    private function agendaPreviewDate(Request $request): string
    {
        $tanggal = $request->query('tanggal_terima');

        if (is_string($tanggal) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $tanggal) === 1) {
            $parsed = Carbon::createFromFormat('Y-m-d', $tanggal);

            if ($parsed instanceof Carbon && $parsed->format('Y-m-d') === $tanggal) {
                return $tanggal;
            }
        }

        return now()->toDateString();
    }

    public function show(SuratMasuk $surat_masuk)
    {
        $user = request()->user();
        $letter = $this->services->formatShowPayload($surat_masuk, $user);
        $letter['disposisi'] = $this->disposisiService->formatTimelineForSurat($surat_masuk);

        return inertia('surat-masuk/Show', [
            'letter' => $letter,
            'jabatanOptions' => JabatanTujuanDisposisi::activeOptions(),
            'dariJabatan' => $user?->isKades()
                ? \App\Models\Disposisi::DARI_KADES
                : \App\Models\Disposisi::DARI_SEKDES,
        ]);
    }

    public function edit(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        return inertia('surat-masuk/Edit', [
            'letter' => $surat_masuk->load('supportingDocuments'),
        ]);
    }

    public function store(StoreRequest $request)
    {
        $this->authorizeSuratManagement();

        $this->services->store($request);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil ditambahkan.');
    }

    public function update(UpdateRequest $request, SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        $this->services->update($request, $surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil diperbarui.');
    }

    public function destroy(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        $this->services->destroy($surat_masuk);

        return redirect()->route('admin.surat-masuk.index')->with('success', 'Surat Masuk berhasil dihapus.');
    }

    public function reviewSekdes(ReviewSekdesRequest $request, SuratMasuk $surat_masuk)
    {
        $this->services->reviewBySekdes(
            $surat_masuk,
            $request->validated('tingkat'),
            $request->user(),
        );

        return back()->with('success', 'Surat berhasil direview dan tindak lanjut ditetapkan.');
    }

    public function verifikasiKades(VerifikasiKadesRequest $request, SuratMasuk $surat_masuk)
    {
        $this->services->verifyByKades($surat_masuk, $request->user());

        return back()->with('success', 'Surat prioritas tinggi berhasil diverifikasi.');
    }

    public function archive(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        $result = $this->performArchive($surat_masuk);

        return back()->with($result['flash'], $result['message']);
    }

    public function archiveSelected(Request $request)
    {
        $this->authorizeSuratManagement();

        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'distinct', 'exists:surat_masuk,id'],
        ]);

        $letters = SuratMasuk::query()->whereIn('id', $validated['ids'])->get()->keyBy('id');
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
    private function performArchive(SuratMasuk $surat_masuk): array
    {
        if ($surat_masuk->diarsipkan_at) {
            return [
                'archived' => false,
                'flash' => 'info',
                'message' => 'Surat ini sudah berada di arsip.',
            ];
        }

        if (! $surat_masuk->canArchive()) {
            return [
                'archived' => false,
                'flash' => 'error',
                'message' => 'Surat harus didisposisikan terlebih dahulu sebelum diarsipkan.',
            ];
        }

        $this->services->archive($surat_masuk);

        return [
            'archived' => true,
            'flash' => 'success',
            'message' => 'Surat masuk berhasil diarsipkan.',
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

    public function unarchive(SuratMasuk $surat_masuk)
    {
        $this->authorizeSuratManagement();

        if (! $surat_masuk->diarsipkan_at) {
            return redirect()
                ->route('admin.surat-masuk.show', $surat_masuk)
                ->with('info', 'Surat ini tidak dalam arsip.');
        }

        $this->services->unarchive($surat_masuk);

        return redirect()
            ->route('admin.surat-masuk.show', $surat_masuk)
            ->with('success', 'Surat masuk dikembalikan ke daftar aktif.');
    }
}

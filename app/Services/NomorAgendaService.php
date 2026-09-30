<?php

namespace App\Services;

use App\Services\Search\SuratNomorSearchService;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class NomorAgendaService
{
    public const KODE_MASUK = 'SM';

    public const KODE_KELUAR = 'SK';

    public function preview(string $kode, DateTimeInterface|string $tanggal, string $modelClass): string
    {
        return $this->calculateNext($kode, $tanggal, $this->latestAgenda($kode, $tanggal, $modelClass, false));
    }

    public function next(string $kode, DateTimeInterface|string $tanggal, string $modelClass): string
    {
        return $this->calculateNext($kode, $tanggal, $this->latestAgenda($kode, $tanggal, $modelClass, true));
    }

    /**
     * @param  class-string  $modelClass
     */
    private function latestAgenda(string $kode, DateTimeInterface|string $tanggal, string $modelClass, bool $lock): ?string
    {
        $date = Carbon::parse($tanggal);
        $monthPrefix = sprintf('%s/%s/', $kode, $date->format('Y/m'));

        $query = $modelClass::query()
            ->where('nomor_agenda', 'like', $monthPrefix.'%')
            ->orderByDesc('nomor_agenda');

        if ($lock) {
            $query->lockForUpdate();
        }

        $last = $query->value('nomor_agenda');

        return is_string($last) ? $last : null;
    }

    private function calculateNext(string $kode, DateTimeInterface|string $tanggal, ?string $last): string
    {
        $date = Carbon::parse($tanggal);
        $sequence = 1;

        if (is_string($last) && preg_match('/\/(\d+)$/', $last, $matches) === 1) {
            $sequence = ((int) $matches[1]) + 1;
        }

        return sprintf('%s/%s/%04d', $kode, $date->format('Y/m'), $sequence);
    }

    public function yearPrefix(string $kode, int $year): string
    {
        return sprintf('%s/%d', $kode, $year);
    }

    /**
     * @param  Builder<\Illuminate\Database\Eloquent\Model>  $query
     */
    public function restrictToYearPrefix(Builder $query, string $kode, int $year, SuratNomorSearchService $search): void
    {
        $ids = $search->matchingIds($query->clone(), $this->yearPrefix($kode, $year)) ?? [];

        if ($ids === []) {
            $query->whereRaw('0 = 1');

            return;
        }

        $query->whereIn($query->getModel()->getQualifiedKeyName(), $ids);
    }

    public static function contains(string $value): string
    {
        return '%'.addcslashes($value, '%_\\').'%';
    }
};

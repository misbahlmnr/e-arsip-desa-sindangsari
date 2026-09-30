<?php

namespace App\Services\Search;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class SuratNomorSearchService
{
    public function __construct(private BinarySearchService $binarySearch) {}

    /**
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $baseQuery
     * @return list<int>|null  null jika term kosong (tidak ada filter nomor)
     */
    public function matchingIds(Builder $baseQuery, string $term): ?array
    {
        $term = trim($term);

        if ($term === '') {
            return null;
        }

        $candidates = (clone $baseQuery)
            ->whereNotNull('nomor_agenda')
            ->orderBy('nomor_agenda')
            ->get(['id', 'nomor_agenda']);

        if ($candidates->isEmpty()) {
            return [];
        }

        $items = $candidates->all();
        [$start, $end] = $this->binarySearch->findPrefixRange(
            $items,
            $term,
            fn ($item) => (string) $item->nomor_agenda,
        );

        $ids = [];

        for ($i = $start; $i < $end; $i++) {
            $ids[] = (int) $items[$i]->id;
        }

        return $ids;
    }
}

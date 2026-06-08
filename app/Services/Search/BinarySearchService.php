<?php

namespace App\Services\Search;

class BinarySearchService
{
    /**
     * Indeks pertama elemen dengan kunci >= needle (case-insensitive).
     *
     * @param  list<mixed>  $items
     * @param  callable(mixed): string  $getKey
     */
    public function lowerBound(array $items, string $needle, callable $getKey): int
    {
        $needle = $this->normalize($needle);
        $low = 0;
        $high = count($items);

        while ($low < $high) {
            $mid = intdiv($low + $high, 2);
            $key = $this->normalize($getKey($items[$mid]));

            if ($this->compare($key, $needle) < 0) {
                $low = $mid + 1;
            } else {
                $high = $mid;
            }
        }

        return $low;
    }

    /**
     * Rentang indeks [start, end) semua elemen yang no_surat-nya diawali prefix.
     *
     * @param  list<mixed>  $items  Harus terurut naik menurut getKey
     * @param  callable(mixed): string  $getKey
     * @return array{0: int, 1: int}
     */
    public function findPrefixRange(array $items, string $prefix, callable $getKey): array
    {
        if ($prefix === '' || $items === []) {
            return [0, 0];
        }

        $start = $this->lowerBound($items, $prefix, $getKey);
        $count = count($items);

        if ($start >= $count) {
            return [$start, $start];
        }

        $normalizedPrefix = $this->normalize($prefix);
        $end = $start;

        while ($end < $count) {
            $key = $this->normalize($getKey($items[$end]));

            if (! str_starts_with($key, $normalizedPrefix)) {
                break;
            }

            $end++;
        }

        return [$start, $end];
    }

    private function normalize(string $value): string
    {
        return mb_strtolower(trim($value));
    }

    private function compare(string $a, string $b): int
    {
        return strcmp($a, $b);
    }
}

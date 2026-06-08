<?php

namespace Tests\Unit;

use App\Services\Search\BinarySearchService;
use PHPUnit\Framework\TestCase;

class BinarySearchServiceTest extends TestCase
{
    private BinarySearchService $service;

    /** @var list<array{no_surat: string}> */
    private array $items;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = new BinarySearchService();
        $this->items = [
            ['no_surat' => '100/AA/2024'],
            ['no_surat' => '145/001/I/2026'],
            ['no_surat' => '145/002/I/2026'],
            ['no_surat' => '470.1/001/V/2026'],
            ['no_surat' => '474.1/022/V/2024'],
        ];
    }

    private function keyExtractor(): \Closure
    {
        return fn (array $item) => $item['no_surat'];
    }

    public function test_lower_bound_finds_exact_match_index(): void
    {
        $index = $this->service->lowerBound($this->items, '145/001/I/2026', $this->keyExtractor());

        $this->assertSame(1, $index);
    }

    public function test_lower_bound_is_case_insensitive(): void
    {
        $index = $this->service->lowerBound($this->items, '145/002/i/2026', $this->keyExtractor());

        $this->assertSame(2, $index);
    }

    public function test_lower_bound_returns_count_when_needle_is_greater_than_all(): void
    {
        $index = $this->service->lowerBound($this->items, 'ZZZ/999', $this->keyExtractor());

        $this->assertSame(count($this->items), $index);
    }

    public function test_find_prefix_range_matches_multiple_records(): void
    {
        [$start, $end] = $this->service->findPrefixRange($this->items, '145/', $this->keyExtractor());

        $this->assertSame(1, $start);
        $this->assertSame(3, $end);
    }

    public function test_find_prefix_range_exact_single_match(): void
    {
        [$start, $end] = $this->service->findPrefixRange($this->items, '100/AA', $this->keyExtractor());

        $this->assertSame(0, $start);
        $this->assertSame(1, $end);
    }

    public function test_find_prefix_range_returns_empty_when_not_found(): void
    {
        [$start, $end] = $this->service->findPrefixRange($this->items, '999/', $this->keyExtractor());

        $this->assertSame($start, $end);
    }

    public function test_find_prefix_range_on_empty_array(): void
    {
        [$start, $end] = $this->service->findPrefixRange([], '145/', $this->keyExtractor());

        $this->assertSame(0, $start);
        $this->assertSame(0, $end);
    }
}

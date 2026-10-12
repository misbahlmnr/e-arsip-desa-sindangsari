<?php

namespace Database\Seeders\Concerns;

use Illuminate\Support\Facades\Storage;
use Throwable;

trait ImportsPdfSurat
{
    /**
     * @param  callable(string, string, string, string): void  $create
     * @return array{imported: int, failed: list<string>}
     */
    protected function importPdfFolder(string $sourceDirectory, string $storageDirectory, string $markerPrefix, callable $create): array
    {
        $imported = 0;
        $failed = [];

        if (! is_dir($sourceDirectory)) {
            return [
                'imported' => 0,
                'failed' => [$sourceDirectory.': folder tidak ditemukan'],
            ];
        }

        $files = collect(scandir($sourceDirectory) ?: [])
            ->filter(fn (string $name) => str_ends_with(strtolower($name), '.pdf'))
            ->sort()
            ->values();

        $today = now()->toDateString();

        foreach ($files as $index => $filename) {
            $absolute = $sourceDirectory.DIRECTORY_SEPARATOR.$filename;
            $relative = null;

            try {
                if (! is_file($absolute)) {
                    throw new \RuntimeException('bukan file');
                }

                $relative = $storageDirectory.'/'.$this->storedPdfName($filename, $index + 1);
                $contents = file_get_contents($absolute);

                if ($contents === false) {
                    throw new \RuntimeException('file tidak bisa dibaca');
                }

                Storage::disk('public')->put($relative, $contents);

                $create(
                    sprintf('TMP-%s-%03d', $markerPrefix, $index + 1),
                    $filename,
                    $relative,
                    $today,
                );

                $imported++;
            } catch (Throwable $e) {
                if (is_string($relative)) {
                    Storage::disk('public')->delete($relative);
                }

                $failed[] = $filename.': '.$e->getMessage();
            }
        }

        return [
            'imported' => $imported,
            'failed' => $failed,
        ];
    }

    protected function reportPdfImport(string $label, int $imported, array $failed): void
    {
        $this->command?->info($label.' berhasil: '.$imported);
        $this->command?->warn($label.' gagal: '.count($failed));

        foreach ($failed as $line) {
            $this->command?->warn('  '.$line);
        }
    }

    private function storedPdfName(string $filename, int $sequence): string
    {
        $base = pathinfo($filename, PATHINFO_FILENAME);
        $base = preg_replace('/[^\p{L}\p{N}._-]+/u', '-', $base) ?? 'surat';
        $base = trim($base, '-');

        if ($base === '') {
            $base = 'surat';
        }

        return sprintf('%03d-%s.pdf', $sequence, mb_substr($base, 0, 100));
    }
}

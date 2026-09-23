# Implementasi Algoritma Binary Search

Aplikasi **E-Arsip Desa Sindangsari** mengimplementasikan algoritma *Binary Search* untuk meningkatkan efisiensi pencarian data surat. Algoritma ini digunakan karena kemampuannya melakukan pencarian dengan kompleksitas **O(log n)**, yang jauh lebih cepat dibandingkan pencarian linear, terutama ketika jumlah arsip surat sudah banyak.

Dalam implementasinya, data surat disusun secara terurut berdasarkan **nomor surat (`no_surat`)**. Nomor surat diinput secara manual sesuai surat fisik, bukan digenerate otomatis oleh sistem. Karena itu, pencarian tidak hanya mencari kecocokan persis, tetapi juga mendukung pencarian **prefix** (awalan nomor), misalnya `145/` untuk menemukan `145/001/I/2026` dan `145/002/I/2026`.

Penerapan algoritma *Binary Search* digunakan pada:

1. Menu **Surat Masuk** dan **Surat Keluar**
2. Menu **Arsip Surat**

Pengguna dapat mengetik nomor surat pada kolom pencarian, lalu sistem mencari data secara efisien tanpa menelusuri seluruh baris satu per satu. Berikut implementasi kodenya.

---

## 1. Menu Surat Masuk dan Surat Keluar

Data surat diambil dari *service* dalam bentuk koleksi terurut berdasarkan `no_surat` agar dapat diproses dengan *Binary Search*, seperti ditunjukkan pada Gambar 4.28.

**Gambar 4.28** Pengambilan data terurut berdasarkan nomor surat

```php
// app/Services/Search/SuratNomorSearchService.php

public function matchingIds(Builder $baseQuery, string $term): ?array
{
    $term = trim($term);

    if ($term === '') {
        return null;
    }

    $candidates = (clone $baseQuery)
        ->orderBy('no_surat')
        ->get(['id', 'no_surat']);

    if ($candidates->isEmpty()) {
        return [];
    }

    $items = $candidates->all();
    [$start, $end] = $this->binarySearch->findPrefixRange(
        $items,
        $term,
        fn ($item) => (string) $item->no_surat,
    );

    $ids = [];

    for ($i = $start; $i < $end; $i++) {
        $ids[] = (int) $items[$i]->id;
    }

    return $ids;
}
```

Penjelasan Gambar 4.28:

- Jika kata kunci pencarian kosong, sistem tidak memfilter nomor (`return null`) sehingga seluruh data tetap ditampilkan.
- Data diambil hanya kolom `id` dan `no_surat`, lalu diurutkan naik menurut `no_surat`. Pengurutan ini wajib karena *Binary Search* hanya benar jika data sudah terurut.
- Setelah rentang indeks `[start, end)` ditemukan, sistem mengumpulkan `id` surat yang cocok untuk ditampilkan di tabel.

Selanjutnya, pengguna memasukkan nomor surat pada kolom pencarian. Input dikirim ke server, lalu *service* menjalankan *Binary Search*. Input pencarian ditunjukkan pada Gambar 4.29.

**Gambar 4.29** Coding input pencarian nomor surat

```jsx
// resources/js/features/surat-masuk/pages/Index.jsx

const { loading, searchInput, setSearchInput, visit } = useServerTable({
    routeName: "admin.surat-masuk.index",
    filters,
    searchDebounceMs: 400,
    preserveQueryKeys: ["status", "tingkat", "kades_aksi", "disposisi"],
});
```

```jsx
// resources/js/shared/hooks/useServerTable.js

useEffect(() => {
    const handle = setTimeout(() => {
        const q = String(searchInput ?? "").trim();
        const current = String(filtersRef.current?.search ?? "").trim();
        if (q === current) {
            return;
        }
        visit(
            buildQuery({
                page: 1,
                search: q || undefined,
            }),
        );
    }, searchDebounceMs);

    return () => clearTimeout(handle);
}, [searchInput, searchDebounceMs, visit, buildQuery]);
```

Pada Surat Masuk dan Surat Keluar, kolom pencarian memakai placeholder **"Cari nomor surat…"**. Setelah pengguna mengetik, sistem menunggu 400 milidetik (*debounce*) agar tidak mengirim permintaan di setiap huruf, kemudian mengirim parameter `search` ke backend.

Inti algoritma *Binary Search* terdapat pada `BinarySearchService`, seperti ditunjukkan pada Gambar 4.30.

**Gambar 4.30** Coding Binary Search

```php
// app/Services/Search/BinarySearchService.php

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
```

Seperti Gambar 4.30, *Binary Search* bekerja dengan menetapkan batas awal (`low = 0`) dan batas akhir (`high = jumlah data`). Selanjutnya sistem mengambil indeks tengah (`mid`) lalu membandingkan `no_surat` pada indeks tersebut dengan kata kunci pencarian.

Cara kerjanya:

1. Nilai `no_surat` dinormalisasi (huruf kecil, spasi di trim) agar pencarian tidak peka huruf besar/kecil.
2. Jika nilai di indeks tengah **lebih kecil** dari kata kunci, pencarian dilanjutkan ke **kanan** (`low = mid + 1`).
3. Jika nilai di indeks tengah **lebih besar atau sama**, pencarian dilanjutkan ke **kiri** (`high = mid`).
4. Proses berulang hingga ditemukan indeks pertama yang `no_surat`-nya lebih besar atau sama dengan kata kunci. Indeks ini disebut *lower bound*.
5. Dari indeks tersebut, sistem menelusuri ke kanan selama `no_surat` masih diawali prefix yang dicari, sehingga diperoleh rentang `[start, end)`.
6. Jika tidak ada yang cocok, rentang kosong (`start == end`) dan data dianggap tidak tersedia.

Metode ini disebut *lower bound binary search*. Cocok untuk nomor surat desa yang sering dicari berdasarkan awalan klasifikasi, bukan hanya nomor lengkap.

Jika data ditemukan, `id` hasil pencarian dipakai untuk memfilter query, lalu ditampilkan dalam tabel. Jika tidak ditemukan, query dikosongkan sehingga tabel menampilkan pesan data tidak tersedia. Implementasi tersebut ditunjukkan pada Gambar 4.31.

**Gambar 4.31** Coding menampilkan hasil pencarian

```php
// app/Services/SuratMasukService.php (Surat Keluar memakai pola yang sama)

$matchingIds = $this->nomorSearch->matchingIds(clone $query, $search);

if ($matchingIds !== null) {
    if ($matchingIds === []) {
        $query->whereRaw('0 = 1');
    } else {
        $query->whereIn('id', $matchingIds);
    }
}

$query->orderBy($sortBy, $sortDir);

$letters = $query
    ->withCount('disposisi')
    ->paginate($perPage)
    ->withQueryString();
```

Penjelasan Gambar 4.31:

- `$matchingIds === []` berarti *Binary Search* tidak menemukan nomor yang cocok, sehingga kondisi `0 = 1` membuat hasil query kosong.
- Jika ada `id` yang cocok, data ditampilkan lewat `whereIn('id', $matchingIds)`.
- Hasil tetap dipaginasi, lalu dikirim ke halaman React (Inertia) untuk ditampilkan di tabel.

Contoh: pengguna mengetik `145/`. Sistem mengurutkan nomor surat, mencari posisi awal prefix `145/` dengan *Binary Search*, lalu menampilkan hanya surat yang nomornya berawalan `145/`.

---

## 2. Menu Arsip Surat

*Binary Search* pada menu **Arsip Surat** bekerja dengan prinsip yang sama seperti pada Surat Masuk dan Surat Keluar, yaitu menetapkan batas awal (`low = 0`) dan batas akhir (`high = jumlah data`), mencari nilai `no_surat` di indeks tengah, lalu membandingkannya dengan kata kunci.

Perbedaannya, arsip menggabungkan surat masuk dan surat keluar yang sudah diarsipkan. Karena itu, pencarian dijalankan pada masing-masing kumpulan data, kemudian hasilnya digabung. Implementasinya ditunjukkan pada Gambar 4.32.

**Gambar 4.32** Coding pencarian Binary Search pada Arsip Surat

```php
// app/Services/ArsipSuratService.php

private function applyNomorSearch($query, string $search, string $jenis): void
{
    if ($search === '') {
        return;
    }

    if ($jenis === 'masuk') {
        $ids = $this->nomorSearch->matchingIds(
            SuratMasuk::query()->whereNotNull('diarsipkan_at'),
            $search,
        ) ?? [];

        if ($ids === []) {
            $query->whereRaw('0 = 1');
            return;
        }

        $query->whereIn('id', $ids);
        return;
    }

    if ($jenis === 'keluar') {
        $ids = $this->nomorSearch->matchingIds(
            SuratKeluar::query()->whereNotNull('diarsipkan_at'),
            $search,
        ) ?? [];

        if ($ids === []) {
            $query->whereRaw('0 = 1');
            return;
        }

        $query->whereIn('id', $ids);
        return;
    }

    $masukIds = $this->nomorSearch->matchingIds(
        SuratMasuk::query()->whereNotNull('diarsipkan_at'),
        $search,
    ) ?? [];

    $keluarIds = $this->nomorSearch->matchingIds(
        SuratKeluar::query()->whereNotNull('diarsipkan_at'),
        $search,
    ) ?? [];

    if ($masukIds === [] && $keluarIds === []) {
        $query->whereRaw('0 = 1');
        return;
    }

    $query->where(function ($q) use ($masukIds, $keluarIds) {
        if ($masukIds !== []) {
            $q->where(function ($q) use ($masukIds) {
                $q->where('jenis', 'masuk')->whereIn('id', $masukIds);
            });
        }

        if ($keluarIds !== []) {
            $method = $masukIds !== [] ? 'orWhere' : 'where';
            $q->{$method}(function ($q) use ($keluarIds) {
                $q->where('jenis', 'keluar')->whereIn('id', $keluarIds);
            });
        }
    });
}
```

Input pencarian di halaman arsip juga memakai kolom **"Cari nomor surat…"**, seperti ditunjukkan pada Gambar 4.33.

**Gambar 4.33** Coding input pencarian pada menu Arsip Surat

```jsx
// resources/js/features/arsip-surat/pages/Index.jsx

<div className="relative flex-1 max-w-md">
    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Cari nomor surat…"
        className="pl-10 h-11 rounded-xl"
    />
</div>
```

Ketika pencarian dilakukan:

1. Kata kunci dikirim ke `ArsipSuratService`.
2. Jika filter jenis adalah **Surat Masuk** atau **Surat Keluar**, *Binary Search* dijalankan hanya pada kumpulan itu.
3. Jika filter jenis adalah **Semua**, *Binary Search* dijalankan dua kali (arsip masuk dan arsip keluar), lalu hasilnya digabung.
4. Jika data ditemukan, tabel menampilkan nomor surat, perihal, pihak, tanggal, dan aksi lihat detail.
5. Jika data tidak ditemukan, tabel tetap tampil tetapi isinya kosong (tidak ada baris arsip yang cocok).

---

## 3. Ringkasan Alur Pencarian

```
Pengguna mengetik nomor surat
        │
        ▼
Frontend mengirim parameter search
        │
        ▼
Data diurutkan berdasarkan no_surat
        │
        ▼
Binary Search (lower bound)
        │
        ├── prefix cocok ──► ambil rentang id ──► tampilkan di tabel
        │
        └── tidak cocok ──► hasil kosong
```

Dengan implementasi ini, temu kembali arsip berdasarkan nomor surat tidak perlu membandingkan kata kunci ke seluruh data secara linear. Sistem cukup membagi ruang pencarian berulang kali hingga posisi nomor yang dicari ditemukan, sehingga proses pencarian tetap efisien meskipun volume arsip desa terus bertambah.

# Dokumentasi Aplikasi E-Arsip Desa Sindangsari

Dokumen ini menjelaskan aplikasi sebagaimana yang terimplementasi di kode. Tujuannya agar reviewer atau AI lain memahami sistem tanpa harus menelusuri source code dari awal.

Lingkup: sistem yang sedang berjalan. Halaman publik landing page tidak ada. `GET /` langsung diarahkan ke halaman login.

---

# 1. Gambaran Umum Aplikasi

## Nama aplikasi

**E-Arsip Desa Sindangsari**

Tagline yang dipakai di antarmuka: Sistem Arsip Surat Desa Sindangsari.

Instansi: Kantor Desa Sindangsari, Kecamatan Cimerak, Kabupaten Pangandaran.

## Tujuan aplikasi

Mengelola siklus administrasi surat desa secara terpusat: pencatatan surat masuk dan surat keluar, review berjenjang, disposisi ke perangkat desa, pengarsipan, pencarian arsip berdasarkan nomor surat, serta rekap laporan.

Sistem menggantikan pencatatan manual yang mudah tercecer dan sulit dilacak.

## Studi kasus

Satu kantor desa. Pengguna internal hanya petugas: Admin (operator tata usaha), Sekretaris Desa, dan Kepala Desa.

Kaur dan Kasi bukan akun login. Mereka hanya menjadi tujuan disposisi.

Nomor surat diisi manual sesuai surat fisik. Sistem tidak membuat nomor surat otomatis.

## Teknologi yang digunakan

| Lapisan | Teknologi |
| --- | --- |
| Bahasa backend | PHP 8.2 |
| Framework backend | Laravel 12 |
| Frontend | React 18 + Inertia.js 2 |
| Bundler | Vite 6 |
| Styling | Tailwind CSS, komponen bergaya shadcn/ui (Radix UI) |
| Ikon / animasi | Lucide React, Framer Motion |
| Tabel | TanStack Table |
| Grafik dashboard | Recharts |
| PDF laporan | barryvdh/laravel-dompdf |
| Autentikasi | Laravel Breeze (session), login memakai username |
| Routing frontend | Ziggy |
| Database default | SQLite (`DB_CONNECTION=sqlite` di `.env.example`). Konfigurasi MySQL tersedia tetapi tidak aktif secara default |
| Penyimpanan berkas | Laravel disk `public` |
| Pengujian | PHPUnit |

Tidak memakai Next.js, Bootstrap, atau Blade sebagai UI utama. Blade hanya untuk template PDF laporan (`resources/views/pdf/laporan-surat.blade.php`).

## Arsitektur aplikasi

Aplikasi monolit. Browser memuat satu aplikasi React. Setiap navigasi dikirim ke route Laravel. Controller memanggil service, lalu mengembalikan halaman Inertia beserta data.

```
Browser (React + Inertia)
        │
        ▼
Route Laravel + middleware auth/role
        │
        ▼
Controller (tipis)
        │
        ▼
Service (aturan bisnis)
        │
        ├── Eloquent Model
        └── BinarySearchService (khusus pencarian nomor surat)
        │
        ▼
Database + file di storage/public
```

Halaman React tidak memanggil REST API terpisah untuk operasi utama. Data datang sebagai props Inertia.

## Pola yang digunakan

| Pola | Pemakaian |
| --- | --- |
| MVC | Route, Controller, Model, dan halaman React sebagai view |
| Service | Aturan bisnis ada di `app/Services`, bukan di controller |
| Form Request | Validasi input di `app/Http/Requests` |
| Middleware role | `RoleMiddleware` membatasi route menurut `admin`, `sekdes`, `kades` |
| Repository | Tidak dipakai. Query Eloquent berada di service |
| Policy Laravel | Tidak dipakai sebagai kelas Policy. Otorisasi ada di method model `User` dan `SuratMasuk`, plus concern controller |

---

# 2. Role dan Hak Akses

Hanya tiga role di database: `admin`, `sekdes`, `kades`. Role dipilih saat Admin membuat akun. Pengguna tidak memilih role di halaman login.

Kaur/Kasi tidak punya akun.

## Admin

Operator atau staf tata usaha.

Hak akses:

- Mencatat, mengubah, dan menghapus surat masuk serta surat keluar.
- Mengunggah lampiran.
- Mengarsipkan dan membatalkan arsip.
- Melihat seluruh modul surat, arsip, dan laporan.
- Mengunduh laporan PDF.
- Mengelola akun pengguna.
- Tidak membuat disposisi.
- Tidak melakukan review Sekdes atau verifikasi Kades.

Menu sidebar:

- Beranda
- Surat Masuk
- Surat Keluar
- Arsip Surat
- Laporan
- Manajemen User

Menu Disposisi tidak tampil. Admin tetap bisa melihat riwayat disposisi di detail surat masuk.

Fitur:

- CRUD surat masuk (status awal selalu `draft`).
- CRUD surat keluar (status `draft` atau `terkirim`).
- Arsipkan / batal arsip.
- Kelola user: tambah, ubah, lihat, hapus.
- Dashboard ringkasan seluruh modul.
- Profil sendiri (nama, email, password).

## Sekdes

Sekretaris Desa.

Hak akses:

- Melihat surat masuk, surat keluar, arsip, dan laporan.
- Mereview surat masuk yang masih `draft`, lalu menetapkan tingkat `biasa` atau `penting`.
- Membuat disposisi hanya untuk surat tingkat `biasa` yang sudah direview (status `terverifikasi`).
- Mengunduh laporan PDF.
- Tidak menginput, mengedit, menghapus, atau mengarsipkan surat.
- Tidak mengelola user.
- Tidak memverifikasi surat penting.

Menu sidebar:

- Beranda
- Surat Masuk
- Disposisi
- Surat Keluar
- Arsip Surat
- Laporan

Fitur:

- Review surat + pilih tingkat.
- Buat disposisi ke jabatan Kaur/Kasi.
- Lihat antrian di dashboard: menunggu review, surat biasa tanpa disposisi, surat penting yang menunggu Kades.

## Kades

Kepala Desa.

Hak akses:

- Melihat surat masuk, surat keluar, arsip, dan laporan.
- Memverifikasi surat tingkat `penting` yang sudah direview Sekdes dan belum diverifikasi Kades.
- Membuat disposisi hanya untuk surat `penting` yang sudah diverifikasi Kades dan statusnya masih `terverifikasi`.
- Mengunduh laporan PDF.
- Tidak menginput, mengedit, menghapus, atau mengarsipkan surat.
- Tidak mengelola user.
- Tidak mereview surat `biasa`.

Menu sidebar:

- Beranda
- Surat Masuk
- Disposisi
- Surat Keluar
- Arsip Surat
- Laporan

Fitur:

- Verifikasi surat penting.
- Disposisi surat penting.
- Dashboard antrian verifikasi dan surat yang siap didisposisikan.

---

# 3. Struktur Menu

Sidebar didefinisikan di `resources/js/shared/config/navigation.js`. Tidak ada menu terpisah bernama Review atau Master Data.

## Beranda

- Tujuan: ringkasan kerja sesuai role.
- Fungsi: kartu angka, panel Perlu Perhatian, grafik tren, tabel data terbaru.
- Halaman: `dashboard/pages/Admin.jsx`, `Sekdes.jsx`, atau `Kades.jsx`.
- Route: `GET /dashboard`.

## Surat Masuk

- Tujuan: daftar surat yang diterima dan belum diarsipkan.
- Fungsi: cari nomor surat, filter status/tingkat, lihat detail. Admin juga tambah, ubah, hapus. Sekdes review di halaman detail. Kades verifikasi di halaman detail.
- Halaman: `surat-masuk/pages/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Show.jsx`.
- Route: `/surat-masuk`.

## Surat Keluar

- Tujuan: daftar surat yang dikirim desa dan belum diarsipkan.
- Fungsi: cari nomor surat, filter status. Admin tambah, ubah, hapus, arsipkan. Sekdes dan Kades hanya melihat.
- Halaman: `surat-keluar/pages/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Show.jsx`.
- Route: `/surat-keluar`.

## Disposisi

- Tujuan: instruksi tindak lanjut surat masuk ke jabatan perangkat desa.
- Fungsi: daftar disposisi, buat disposisi, lihat detail. Hanya Sekdes dan Kades.
- Halaman: `disposisi/pages/Index.jsx`, `Create.jsx`, `Show.jsx`.
- Route: `/disposisi`.
- Disposisi juga bisa dibuat dari modal di detail surat masuk.

## Arsip Surat

- Tujuan: surat masuk dan keluar yang sudah diarsipkan.
- Fungsi: cari nomor surat (Binary Search), filter jenis dan rentang tanggal arsip, lihat detail. Admin dapat batal arsip.
- Halaman: `arsip-surat/pages/Index.jsx`, `Show.jsx`.
- Route: `/arsip-surat`.

## Laporan

- Tujuan: rekapitulasi untuk monitoring.
- Fungsi: ringkasan jumlah, status, tingkat surat, tren bulanan, pengirim terbanyak, disposisi per tujuan. Unduh PDF.
- Halaman: `laporan/pages/Index.jsx`.
- Route: `/laporan` dan `/laporan/export`.

## Manajemen User

- Tujuan: akun petugas.
- Fungsi: daftar, tambah, ubah, lihat, hapus. Hanya Admin. Role yang boleh dibuat: Admin, Sekretaris Desa, Kepala Desa.
- Halaman: `users/pages/Index.jsx`, `Create.jsx`, `Edit.jsx`, `Show.jsx`.
- Route: `/users`.

## Profil

Bukan item sidebar utama, diakses dari header.

- Halaman: `profile/pages/Edit.jsx`.
- Route: `/profile`.
- Semua role yang sudah login dapat mengubah profil dan password.

## Login

- Halaman: `auth/pages/Login.jsx`.
- Route: `GET /login`, `POST /login`.
- `GET /` redirect ke login.

Tidak ada menu Master Data. Jabatan tujuan disposisi diisi lewat migrasi/seeder, bukan layar kelola.

---

# 4. Flow Bisnis

Alur utama surat masuk:

```
Admin input surat masuk
        │
        ▼
status: draft
tampilan: Draft
        │
        ▼
Sekdes review + pilih tingkat (biasa / penting)
status menjadi: terverifikasi
        │
        ├── tingkat biasa
        │     tampilan: Review Sekdes
        │     pelaku disposisi: Sekdes
        │
        └── tingkat penting
              tampilan: Menunggu verifikasi Kades
                    │
                    ▼
              Kades verifikasi
              status DB tetap terverifikasi
              verified_kades_at terisi
              tampilan: Siap disposisi Kades
              pelaku disposisi: Kades
                    │
                    ▼
        Buat disposisi (jabatan tujuan + catatan)
        status menjadi: didisposisikan
                    │
                    ▼
        Admin arsipkan
        status: diarsipkan
        diarsipkan_at terisi
```

Surat keluar berjalan terpisah:

```
Admin input surat keluar
(opsional menautkan surat masuk sebagai balasan)
        │
        ▼
status: draft atau terkirim
        │
        ▼
Admin arsipkan
diarsipkan_at terisi
(status draft/terkirim tidak diubah)
```

Aturan pelaku:

| Kondisi | Boleh |
| --- | --- |
| Sekdes review hanya jika status `draft` dan belum diarsip | Ya |
| Kades verifikasi hanya jika tingkat `penting`, status `terverifikasi`, `verified_kades_at` masih kosong | Ya |
| Sekdes disposisi hanya surat `biasa` + status `terverifikasi` | Ya |
| Kades disposisi hanya surat `penting` + sudah verifikasi Kades + status `terverifikasi` | Ya |
| Admin arsipkan surat masuk hanya jika status `didisposisikan` | Ya |
| Batal arsip surat masuk mengembalikan status ke `didisposisikan` | Ya |
| Admin arsipkan surat keluar kapan saja selama belum diarsip | Ya |

---

# 5. Flow Surat Masuk

## Langkah 1 — Input (Admin)

Halaman tambah surat masuk.

Data yang diisi: nomor surat, tanggal terima, tanggal surat, pengirim, perihal, catatan, tujuan, lampiran opsional.

Validasi:

- Nomor surat wajib, unik di tabel `surat_masuk`, maksimal 120 karakter.
- Tanggal terima dan tanggal surat wajib.
- Pengirim wajib, maksimal 120 karakter.
- Perihal wajib, maksimal 250 karakter.
- Lampiran opsional: pdf, jpeg, jpg, png, doc, docx, maksimal 5 MB (5120 KB).

Perubahan:

- Baris baru di `surat_masuk`.
- `status` dipaksa `draft`. Tingkat tidak diisi Admin.
- Jika ada file, path disimpan di kolom `file` (disk `public`).

## Langkah 2 — Review (Sekdes)

Dari halaman detail, selama `canReviewBySekdes()` benar.

Yang diubah: hanya tingkat (`biasa` atau `penting`). Isi surat tidak diubah Sekdes.

Perubahan database:

- `tingkat`
- `status` dari `draft` menjadi `terverifikasi`
- `verified_sekdes_at` = waktu sekarang
- `verified_sekdes_by` = id user Sekdes

## Langkah 3 — Verifikasi (Kades, hanya surat penting)

Tidak mengubah isi surat dan tidak mengubah kolom `status`.

Perubahan database:

- `verified_kades_at`
- `verified_kades_by`

Tampilan UI berubah dari "Menunggu verifikasi Kades" menjadi "Siap disposisi Kades" karena `status_tampil` dihitung dari tingkat dan `verified_kades_at`.

## Langkah 4 — Disposisi

Lihat bagian 8. Setelah disposisi pertama yang sah, `status` menjadi `didisposisikan`.

## Langkah 5 — Arsip (Admin)

Hanya jika status `didisposisikan` dan belum diarsip.

Perubahan database:

- `status` = `diarsipkan`
- `diarsipkan_at` = waktu sekarang

Surat hilang dari daftar operasional surat masuk (query `whereNull('diarsipkan_at')`) dan muncul di Arsip Surat.

## Ubah dan hapus

Admin dapat mengubah data surat dan mengganti lampiran. Update tidak mengubah `status` dan `tingkat`.

Admin dapat menghapus surat. File lampiran di storage ikut dihapus. Disposisi terkait ikut terhapus karena foreign key `cascadeOnDelete`.

Pembatasan edit menurut status tidak ditegakkan di service update. Artinya Admin secara teknis masih bisa mengubah nomor atau perihal setelah surat direview, selama route edit Admin dipakai.

---

# 6. Flow Surat Keluar

## Input (Admin)

Data: nomor surat, tanggal kirim, tujuan, perihal, catatan, status (`draft` atau `terkirim`), lampiran opsional, dan opsional `surat_masuk_id` sebagai tautan balasan.

Validasi:

- Nomor surat wajib dan unik di tabel `surat_keluar` (unik terpisah dari surat masuk).
- Tanggal kirim, tujuan, perihal, dan status wajib.
- Lampiran opsional: pdf, doc, docx. Tidak ada batas ukuran di Form Request (berbeda dengan surat masuk).

Perubahan database: baris baru `surat_keluar`. File disimpan jika diunggah.

## Ubah

Admin mengubah field yang sama. Jika lampiran baru diunggah, file lama dihapus dari storage.

## Hapus

Admin menghapus baris dan file lampiran.

## Arsip

Admin dapat mengarsipkan surat keluar tanpa syarat status `didisposisikan`, karena surat keluar tidak punya alur review.

Perubahan database: hanya `diarsipkan_at`. Kolom `status` (`draft` / `terkirim`) tidak diubah.

Batal arsip mengosongkan `diarsipkan_at`. Surat kembali ke daftar aktif.

Daftar operasional hanya menampilkan surat dengan `diarsipkan_at` kosong.

---

# 7. Flow Review

Review adalah tindakan Sekdes, bukan menu sendiri.

Siapa: user dengan role `sekdes`.

Kapan: surat masuk `status = draft` dan belum diarsip.

Apa yang dapat diubah: tingkat surat saja (`biasa` atau `penting`).

Kapan status berubah:

- Sebelum review: `draft`, tampilan "Draft".
- Sesudah review: `terverifikasi`.
- Jika tingkat `biasa`: tampilan "Review Sekdes". Berikutnya Sekdes yang membuat disposisi.
- Jika tingkat `penting`: tampilan "Menunggu verifikasi Kades". Berikutnya Kades yang memverifikasi, lalu Kades yang membuat disposisi.

Review tidak bisa diulang dari UI karena syaratnya status masih `draft`. Tidak ada aksi membatalkan review.

Otorisasi ganda: middleware route `role:sekdes` dan `ReviewSekdesRequest` yang memanggil `canReviewBySekdes()`.

---

# 8. Flow Disposisi

Disposisi hanya untuk surat masuk.

## Syarat

| Pelaku | Syarat surat |
| --- | --- |
| Sekdes | tingkat `biasa`, status `terverifikasi`, belum diarsip |
| Kades | tingkat `penting`, status `terverifikasi`, `verified_kades_at` sudah terisi, belum diarsip |
| Admin | tidak boleh |

## Data yang disimpan

Tabel `disposisi`:

- `surat_masuk_id`
- `user_id` pembuat
- `jabatan_tujuan_id` dari master jabatan aktif
- `dari_jabatan`: "Sekretaris Desa" atau "Kepala Desa"
- `kepada`: nama jabatan (disalin dari master)
- `catatan` wajib, maksimal 500 karakter
- `tanggal`: hari ini jika dibuat dari detail surat; pada form buat disposisi tanggal ikut input

Master jabatan aktif (dari migrasi):

- Kaur Pemerintahan
- Kaur Keuangan
- Kaur Umum
- Kasi Pelayanan
- Kasi Kesejahteraan
- Kasi Pemerintahan

Tidak ada layar untuk menambah atau menonaktifkan jabatan.

## Perubahan status surat

Jika status surat masih `terverifikasi`, setelah disposisi tersimpan status diubah menjadi `didisposisikan`.

Karena syarat buat disposisi mengharuskan status `terverifikasi`, satu surat praktis hanya lolos satu kali pembuatan disposisi. Disposisi tidak punya status sendiri. Status siklus mengikuti surat induk. Kolom status disposisi pernah ada, lalu dihapus.

## Setelah disposisi

- Surat menunggu Admin mengarsipkan.
- Riwayat disposisi tampil di detail surat.
- Daftar menu Disposisi hanya menampilkan disposisi milik surat yang belum diarsip (`scopeForActiveSurat`).
- Tidak ada ubah atau hapus disposisi di UI operasional.

---

# 9. Flow Arsip

## Bagaimana surat menjadi arsip

Surat masuk:

1. Sudah berstatus `didisposisikan`.
2. Admin menekan arsipkan.
3. `status` menjadi `diarsipkan` dan `diarsipkan_at` diisi.

Surat keluar:

1. Admin menekan arsipkan dari surat yang belum diarsip.
2. Hanya `diarsipkan_at` yang diisi.

## Apakah masih bisa diedit

Arsip tidak punya form edit sendiri.

- Surat yang sudah diarsip tidak muncul di daftar surat masuk/keluar aktif.
- Aksi batal arsip hanya Admin.
- Batal arsip surat masuk mengembalikan `status` ke `didisposisikan` dan mengosongkan `diarsipkan_at`.
- Batal arsip surat keluar hanya mengosongkan `diarsipkan_at`.
- Service update surat tidak memeriksa status arsip. Jika URL edit masih dibuka Admin, perubahan data tetap mungkin. Penguncian edit setelah arsip tidak menjadi aturan bisnis yang eksplisit di service.

## Bagaimana pencarian dilakukan

Kolom cari di Surat Masuk, Surat Keluar, dan Arsip Surat mencari **prefix nomor surat**, bukan perihal atau pengirim.

Alur:

1. Pengguna mengetik di kolom "Cari nomor surat…".
2. Frontend menunggu 400 ms, lalu mengirim query `search`.
3. Service mengambil kandidat `id` dan `no_surat`, mengurutkan `no_surat` naik.
4. `BinarySearchService` mencari rentang yang diawali kata kunci.
5. ID yang cocok dipakai `whereIn`. Jika tidak ada yang cocok, query dikosongkan.
6. Hasil dipaginasi (default 10).

Di arsip, jika filter jenis "semua", Binary Search dijalankan dua kali: sekali pada surat masuk terarsip, sekali pada surat keluar terarsip, lalu hasilnya digabung.

Pencarian user (menu Manajemen User) memakai `LIKE` pada nama, username, dan email. Itu bukan Binary Search.

Jika kata kunci kosong, seluruh data sesuai filter lain ditampilkan. Binary Search tidak dijalankan.

---

# 10. Binary Search

## File

| File | Peran |
| --- | --- |
| `app/Services/Search/BinarySearchService.php` | Algoritma |
| `app/Services/Search/SuratNomorSearchService.php` | Mengambil data terurut, memanggil Binary Search, mengembalikan daftar id |
| `app/Services/SuratMasukService.php` | Memakai hasil pencarian pada daftar surat masuk |
| `app/Services/SuratKeluarService.php` | Memakai hasil pencarian pada daftar surat keluar |
| `app/Services/ArsipSuratService.php` | Memakai hasil pencarian pada arsip |
| `tests/Unit/BinarySearchServiceTest.php` | Uji unit algoritma |
| `tests/Feature/SuratNomorSearchTest.php` | Uji pencarian lewat HTTP |

## Fungsi

- `lowerBound(items, needle, getKey)`: indeks pertama yang kuncinya lebih besar atau sama dengan kata kunci (case-insensitive).
- `findPrefixRange(items, prefix, getKey)`: rentang `[start, end)` semua elemen yang `no_surat`-nya diawali prefix.
- `SuratNomorSearchService::matchingIds(query, term)`: mengurutkan lalu menerjemahkan rentang itu menjadi array id. Mengembalikan `null` jika kata kunci kosong (artinya jangan filter).

## Field yang dicari

`no_surat`.

Pencarian bersifat prefix dan tidak peka huruf besar/kecil. Contoh: kata kunci `145/` menemukan `145/001/I/2026` dan `145/002/I/2026`, tetapi tidak menemukan surat yang hanya menyebut teks itu di perihal.

## Data harus diurutkan berdasarkan apa

Naik menurut `no_surat`, sebelum Binary Search dipanggil:

```php
->orderBy('no_surat')
```

Jika data tidak terurut, hasil lower bound tidak valid.

## Cara kerja singkat

1. `low = 0`, `high = jumlah data`.
2. Ambil `mid`.
3. Jika kunci di `mid` lebih kecil dari kata kunci, geser ke kanan (`low = mid + 1`).
4. Jika tidak, geser ke kiri (`high = mid`).
5. Ulangi sampai `low == high`. Itu posisi awal prefix.
6. Dari posisi itu, geser ke kanan selama nomor masih berawalan prefix. Langkah ini mengumpulkan semua kecocokan yang berurutan.

## Kompleksitas

- Menemukan posisi awal: **O(log n)**.
- Mengumpulkan semua nomor yang cocok dengan prefix: **O(k)**, dengan k = jumlah kecocokan.
- Total setelah data sudah terurut: **O(log n + k)**.

Mengurutkan kandidat dengan `orderBy` database terjadi sebelum pencarian. Biaya urut tidak dihitung sebagai bagian fungsi Binary Search itu sendiri.

Ini lebih baik daripada membandingkan kata kunci ke setiap baris di aplikasi (O(n)) ketika yang dibutuhkan adalah posisi awal pada daftar terurut.

## Kenapa Binary Search dipilih

Nomor surat desa berbentuk teks berklasifikasi dan sering dicari dari awalan, misalnya `145/` atau `474.1/`. Lower bound cocok untuk menemukan awal kelompok prefix pada daftar yang sudah terurut, tanpa menelusuri seluruh arsip satu per satu di lapisan aplikasi.

Nomor tidak digenerate sistem, jadi algoritma tidak mengandalkan urutan id numerik. Kunci urutnya adalah string `no_surat`.

---

# 11. Struktur Database

Tabel operasional. Tabel `cache`, `jobs`, dan `sessions` adalah infrastruktur Laravel.

## users

Akun petugas.

Field penting: `name`, `username` (unik, dipakai login), `email` (unik), `password`, `role` (`admin` | `sekdes` | `kades`).

Relasi: satu user dapat mereview banyak surat (`verified_sekdes_by`, `verified_kades_by`) dan membuat banyak disposisi.

## surat_masuk

Surat yang diterima desa.

Field penting:

- `no_surat` unik
- `tanggal_terima`, `tanggal_surat`
- `pengirim`, `perihal`, `catatan`, `tujuan`
- `status`: `draft`, `terverifikasi`, `didisposisikan`, `diarsipkan`
- `tingkat`: `biasa` atau `penting`, diisi saat review
- `file`
- `diarsipkan_at`
- `verified_sekdes_at`, `verified_sekdes_by`
- `verified_kades_at`, `verified_kades_by`

Relasi:

- punya banyak `disposisi`
- punya banyak `surat_keluar` sebagai balasan
- direview oleh user Sekdes dan Kades

`status_tampil` tidak disimpan. Dihitung di model.

## surat_keluar

Surat yang dikirim desa.

Field penting: `surat_masuk_id` nullable, `no_surat` unik, `tanggal_kirim`, `tujuan`, `perihal`, `catatan`, `status` (`draft` | `terkirim`), `file` nullable, `diarsipkan_at`.

Relasi: opsional milik satu `surat_masuk`.

## disposisi

Instruksi pada satu surat masuk.

Field penting: `surat_masuk_id`, `user_id`, `jabatan_tujuan_id`, `dari_jabatan`, `kepada`, `catatan`, `tanggal`.

Tidak ada kolom status.

Relasi: milik satu surat masuk, satu user pembuat, satu jabatan tujuan. Hapus surat masuk menghapus disposisinya.

## jabatan_tujuan_disposisi

Master tujuan disposisi.

Field: `nama_jabatan` unik, `is_active`, `sort_order`.

Tidak dikelola dari UI.

## password_reset_tokens

Token lupa password Breeze.

## sessions

Session login karena `SESSION_DRIVER=database`.

---

# 12. Struktur Folder Project

## app/Http/Controllers

Penerima request. Controller admin surat, arsip, laporan, user, dashboard per role, disposisi, profil, dan auth Breeze.

Controller mendelegasikan ke service.

## app/Http/Requests

Validasi dan otorisasi aksi tertentu (review, verifikasi, simpan disposisi).

## app/Http/Middleware

- `HandleInertiaRequests`: data auth dan flash yang dipakai semua halaman.
- `RoleMiddleware`: alias `role`.

## app/Models

`User`, `SuratMasuk`, `SuratKeluar`, `Disposisi`, `JabatanTujuanDisposisi`.

## app/Services

Aturan bisnis: surat masuk, surat keluar, disposisi, arsip, laporan, dashboard, user.

## app/Services/Search

`BinarySearchService` dan `SuratNomorSearchService`.

## app/Http/Controllers/Concerns

`AuthorizesSuratManagement` (hanya Admin) dan `AuthorizesDisposisi` (Sekdes atau Kades).

## database/migrations

Skema tabel.

## database/seeders

Akun demo Admin, Sekdes, dan Kades.

## resources/js/features

Halaman Inertia per domain: `auth`, `dashboard`, `surat-masuk`, `surat-keluar`, `disposisi`, `arsip-surat`, `laporan`, `users`, `profile`.

Konvensi: `features/{nama}/pages/{Halaman}.jsx` dipetakan ke nama Inertia `{nama}/{Halaman}`.

## resources/js/components

Komponen bersama: tombol, input, tabel, badge, unggah file, logo.

## resources/js/components/ui

Komponen shadcn/ui: button, card, dialog, select, sheet, table.

## resources/js/layouts

`AppLayout` (sidebar + header sesudah login), `GuestLayout`, `AppSidebar`, `AppHeader`.

## resources/js/shared

Navigasi sidebar, hook tabel server (`useServerTable`), label badge, helper tanggal.

## resources/views

`app.blade.php` (shell Inertia) dan `pdf/laporan-surat.blade.php`.

## routes

`web.php` untuk aplikasi, `auth.php` untuk login Breeze.

## tests

Feature test alur role, surat, disposisi, laporan, pencarian nomor. Unit test Binary Search.

Tidak ada folder `Repositories` atau `Policies`.

---

# 13. Daftar Seluruh Fitur

| Fitur | Deskripsi | Role |
| --- | --- | --- |
| Redirect beranda | `/` diarahkan ke login | Tamu |
| Login | Username, password, ingat saya | Semua petugas |
| Lupa password | Alur Breeze email reset | Tamu, jika email dikonfigurasi |
| Logout | Mengakhiri session, kembali ke login | Semua yang login |
| Profil | Ubah nama, email, password | Semua yang login |
| Dashboard | Ringkasan dan antrian sesuai role | Admin, Sekdes, Kades |
| Panel Perlu Perhatian | Kartu antrian yang bisa diklik ke daftar terfilter | Semua role, isi berbeda |
| Daftar surat masuk | Surat aktif, filter, pagination | Admin, Sekdes, Kades |
| Tambah surat masuk | Input metadata + lampiran opsional, status draft | Admin |
| Ubah surat masuk | Ubah metadata dan lampiran, tidak mengubah status/tingkat | Admin |
| Hapus surat masuk | Hapus data dan file | Admin |
| Detail surat masuk | Metadata, lampiran, riwayat disposisi, aksi sesuai role | Admin, Sekdes, Kades |
| Review Sekdes | Tetapkan tingkat biasa/penting | Sekdes |
| Verifikasi Kades | Tandai surat penting sudah diverifikasi | Kades |
| Daftar surat keluar | Surat aktif | Admin, Sekdes, Kades |
| Tambah/ubah/hapus surat keluar | Termasuk tautan opsional ke surat masuk | Admin |
| Disposisi | Buat instruksi ke Kaur/Kasi | Sekdes, Kades |
| Daftar disposisi | Disposisi surat yang belum diarsip | Sekdes, Kades |
| Arsipkan surat masuk | Hanya setelah didisposisikan | Admin |
| Arsipkan surat keluar | Langsung dari data aktif | Admin |
| Batal arsip | Kembalikan ke daftar aktif | Admin |
| Pencarian nomor surat | Prefix `no_surat` memakai Binary Search | Admin, Sekdes, Kades |
| Lihat/unduh lampiran | File di disk public jika ada | Admin, Sekdes, Kades |
| Laporan | Rekap dengan filter periode | Admin, Sekdes, Kades |
| Unduh laporan PDF | DomPDF | Admin, Sekdes, Kades |
| Manajemen user | CRUD akun dan role | Admin |
| Pencarian user | LIKE nama, username, email | Admin |

Fitur yang tidak ada:

- Notifikasi email, WhatsApp, atau lonceng in-app
- Menu review terpisah
- Menu master data
- Generate nomor surat
- Tanda tangan digital
- OCR
- Portal warga
- Multi desa
- Export Excel

---

# 14. Validasi Sistem

| Aturan | Detail |
| --- | --- |
| Nomor surat masuk unik | Unik di `surat_masuk` saja |
| Nomor surat keluar unik | Unik di `surat_keluar` saja. Nomor yang sama boleh ada di tabel lain |
| Login | Username dan password wajib. Percobaan dibatasi 5 kali |
| Role user | Hanya `admin`, `sekdes`, `kades` |
| Username user | Wajib, unik, `alpha_dash` |
| Password user baru | Minimal 8 karakter dan konfirmasi |
| Role sendiri | Admin tidak dapat mengubah role akun yang sedang dipakai |
| Lampiran surat masuk | Opsional. pdf, jpeg, jpg, png, doc, docx. Maksimal 5 MB |
| Lampiran surat keluar | Opsional. pdf, doc, docx. Tidak ada `max` kilobyte di request |
| Tingkat review | Wajib `biasa` atau `penting`, hanya Sekdes, hanya saat draft |
| Verifikasi Kades | Tidak menerima field tambahan. Otorisasi menolak jika syarat status/tingkat tidak terpenuhi |
| Disposisi | Jabatan tujuan wajib dan harus aktif. Catatan wajib, maksimal 500 karakter. Ditolak jika surat belum memenuhi syarat role |
| Arsip surat masuk | Ditolak jika belum `didisposisikan` atau sudah diarsip |
| Akses route | Middleware role. Role lain menerima 403 |
| Pagination | Nilai per halaman dibatasi daftar tetap (10, 20, 50, 100, plus 8 di arsip) |
| Laporan | Periode hanya `all`, `7d`, `30d`, `90d`, `1y` |

Bukan aturan yang berlaku saat ini:

- Lampiran bukan hanya PDF.
- Lampiran surat masuk tidak wajib.
- Nomor surat tidak divalidasi menurut pola klasifikasi desa. Bentuk bebas asal unik.

---

# 15. Dashboard

Tombol akses cepat (Tambah Surat Masuk, Tambah Surat Keluar, dan sejenisnya) sudah dihapus dari ketiga dashboard. Navigasi modul tetap lewat sidebar. Panel Perlu Perhatian tetap ada.

## Admin

Kartu ringkasan:

- Surat masuk, plus jumlah bulan ini
- Menunggu review (status draft)
- Surat keluar, plus jumlah bulan ini
- Disposisi, dengan hint surat penting yang menunggu Kades
- Arsip, dengan hint surat yang siap diarsipkan

Perlu Perhatian (hanya yang jumlahnya lebih dari nol):

- Surat menunggu review Sekdes
- Surat biasa tanpa disposisi
- Surat penting menunggu Kades
- Surat penting siap disposisi
- Surat siap diarsipkan
- Surat keluar masih draft

Lainnya: grafik tren surat masuk dan keluar 6 bulan, tabel surat masuk terbaru, tabel surat keluar terbaru.

## Sekdes

Kartu:

- Surat masuk
- Tanpa disposisi (surat biasa yang perlu disposisi Sekdes)
- Disposisi yang dibuat Sekdes
- Menunggu Kades
- Arsip

Perlu Perhatian:

- Surat biasa tanpa disposisi
- Surat penting menunggu Kades
- Surat menunggu review

Lainnya: tren 6 bulan, surat masuk terbaru, disposisi terbaru dari Sekdes, antrian surat yang perlu disposisi Sekdes.

## Kades

Kartu:

- Disposisi masuk (dari jabatan Kepala Desa)
- Menunggu verifikasi
- Siap disposisi
- Arsip

Perlu Perhatian:

- Surat penting menunggu verifikasi
- Surat penting siap disposisi

Lainnya: tren disposisi 6 bulan, status disposisi, disposisi terbaru dari Kades, antrian surat yang menunggu tindakan Kades.

---

# 16. Hal yang Sudah Baik

- Alur jabatan desa tergambar di status: Admin mencatat, Sekdes menelaah, Kades memverifikasi surat penting, lalu disposisi, baru arsip.
- Pembagian menu mengikuti role. Sekdes dan Kades tidak melihat tombol kelola yang bukan wewenangnya, dan route mutasi dikunci middleware.
- Syarat review, verifikasi, dan disposisi ada di model (`canReviewBySekdes`, `canVerifyByKades`, `canCreateDisposisi`, `canArchive`), lalu dipakai request dan controller. Aturan tidak hanya tersembunyi di tampilan.
- Status tampilan UI membedakan "menunggu Kades" dan "siap disposisi" tanpa menambah nilai status baru di database.
- Pencarian nomor surat terpisah dari pencarian teks bebas, sehingga kata di perihal tidak ikut muncul. Ini sesuai studi Binary Search.
- Binary Search diuji di unit test (prefix, huruf besar/kecil, tidak ketemu, data kosong) dan feature test HTTP.
- Arsip terpisah dari daftar operasional lewat `diarsipkan_at`, jadi surat selesai tidak memenuhi antrian kerja.
- Laporan punya periode, rekap status, tingkat, tren, pengirim, dan disposisi per tujuan, plus unduh PDF.
- Dashboard tiap role menonjolkan antrian yang memang menjadi tugas role itu.
- Lampiran surat masuk dibatasi jenis dan ukuran.
- Login memakai username dan rate limit.
- Ada pengujian otomatis untuk hak akses role, alur surat, disposisi, dan laporan.

---

# 17. Kelemahan Implementasi

Fokus pada kemampuan aplikasi, bukan gaya penulisan kode.

- Tidak ada jejak histori perubahan isi surat. Jika Admin mengubah perihal setelah review, nilai lama hilang.
- Tidak ada audit log: siapa mengubah surat, kapan file diganti, kapan arsip dibatalkan.
- Tidak ada versioning lampiran. File baru menggantikan file lama.
- Disposisi tidak bisa dikoreksi atau dibatalkan dari aplikasi.
- Review tidak bisa dibatalkan jika tingkat salah pilih.
- Jabatan tujuan tidak bisa dikelola dari aplikasi. Perubahan struktur perangkat desa butuh ubah data di database.
- Kaur/Kasi tidak punya akun, jadi tidak ada konfirmasi bahwa disposisi sudah dibaca atau dikerjakan.
- Tidak ada notifikasi. Petugas harus membuka dashboard untuk melihat antrian.
- Pencarian hanya prefix nomor surat. Pencarian perihal, pengirim, atau tanggal tidak tersedia di daftar surat.
- Binary Search memuat seluruh kandidat `id` dan `no_surat` ke memori aplikasi, lalu mencari. Pada data sangat besar, biaya ambil dan urut data tetap ada sebelum O(log n).
- Aturan lampiran tidak seragam. Surat masuk opsional dan ada batas 5 MB. Surat keluar opsional, boleh doc/docx, tanpa batas ukuran yang sama.
- Edit surat tidak dikunci setelah status melewati draft atau setelah diarsip.
- Nomor surat tidak divalidasi formatnya, hanya unik per tabel.
- Surat keluar tidak punya alur review. Status `draft`/`terkirim` diisi Admin sendiri.
- Tidak ada lokasi arsip fisik (lemari, rak, box) untuk menyambungkan berkas digital dan berkas kertas.
- Tidak ada export Excel untuk rekap yang biasa dipakai perangkat desa.
- Tidak ada cetak lembar disposisi yang bisa dilampirkan ke surat fisik.
- Laporan tidak bisa disaring per jenis surat saja atau per jabatan dari layar filter yang lebih rinci. Filter yang ada adalah periode.
- Akun tidak punya status nonaktif. Menghapus user menghapus jejak pembuat jika foreign key menghapus data terkait.
- Tidak ada cadangan data atau salinan arsip di dalam aplikasi.

---

# 18. Peluang Pengembangan

Semua ide di bawah ini mempertahankan tujuan penelitian: pengelolaan surat desa dan pencarian nomor surat dengan Binary Search. Alur Admin → review Sekdes → verifikasi Kades jika penting → disposisi → arsip tidak diubah. Tidak memakai AI, OCR, atau tanda tangan digital.

## 1. Cetak lembar disposisi PDF

- Manfaat: Sekdes/Kades dapat melampirkan instruksi ke surat fisik.
- Alasan: disposisi saat ini hanya tampil di layar.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: tombol cetak di detail disposisi.
- Cocok skripsi: ya, sebagai keluaran administratif, bukan algoritma baru.

## 2. Kunci ubah surat setelah direview

- Manfaat: isi yang sudah ditelaah tidak berubah diam-diam.
- Alasan: saat ini update Admin tidak memeriksa status.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: sembunyikan tombol ubah di luar status draft.
- Cocok skripsi: ya, memperkuat aturan bisnis yang sudah ada.

## 3. Riwayat status surat

- Manfaat: reviewer dapat melihat kapan draft, review, verifikasi, disposisi, dan arsip terjadi.
- Alasan: saat ini hanya ada timestamp review, bukan daftar kejadian.
- Kesulitan: sedang.
- Perubahan database: ya, tabel `surat_status_log` (surat, status, user, waktu, keterangan).
- Perubahan UI: timeline di detail surat.
- Cocok skripsi: ya, tanpa mengubah alur.

## 4. Kelola jabatan tujuan dari Admin

- Manfaat: desa dapat menambah atau menonaktifkan Kaur/Kasi tanpa ubah database.
- Alasan: master saat ini hanya dari migrasi.
- Kesulitan: sedang.
- Perubahan database: tidak, tabel sudah ada (`is_active`, `sort_order`).
- Perubahan UI: menu master jabatan untuk Admin.
- Cocok skripsi: ya. Disposisi tetap memakai id jabatan yang sama.

## 5. Lokasi simpan arsip fisik

- Manfaat: petugas tahu berkas kertas ada di lemari atau odner mana.
- Alasan: e-arsip desa biasanya tetap menyimpan fisik.
- Kesulitan: rendah.
- Perubahan database: ya, kolom `lokasi_fisik` pada surat masuk dan keluar.
- Perubahan UI: field di form dan kolom di arsip.
- Cocok skripsi: ya. Pencarian Binary Search tetap pada `no_surat`.

## 6. Seragamkan aturan lampiran

- Manfaat: berkas arsip konsisten dan tidak terlalu besar.
- Alasan: surat keluar belum punya batas ukuran, jenis file berbeda dari surat masuk.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: teks bantuan jenis dan ukuran file.
- Cocok skripsi: ya, sebagai perbaikan validasi.

## 7. Cetak register agenda surat

- Manfaat: menggantikan buku agenda harian tanpa spreadsheet manual.
- Alasan: laporan saat ini berbentuk rekap, bukan daftar agenda.
- Kesulitan: sedang.
- Perubahan database: tidak.
- Perubahan UI: tombol cetak di daftar atau laporan.
- Cocok skripsi: ya.

## 8. Filter tanggal pada daftar surat

- Manfaat: petugas tidak menggulir seluruh tahun saat mencari surat bulan tertentu.
- Alasan: filter tanggal rinci ada di arsip, belum di daftar operasional.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: pilihan rentang tanggal di daftar.
- Cocok skripsi: ya. Tidak mengubah cara Binary Search.

## 9. Penanda surat belum dibaca per role

- Manfaat: Sekdes dan Kades melihat surat baru sejak login terakhir.
- Alasan: tidak ada notifikasi.
- Kesulitan: sedang.
- Perubahan database: ya, tabel baca (`user_id`, `surat_masuk_id`, `read_at`).
- Perubahan UI: badge jumlah di sidebar.
- Cocok skripsi: ya, masih di dalam alur yang sama. Bukan notifikasi WhatsApp.

## 10. Nonaktifkan user, bukan hanya hapus

- Manfaat: akun lama tidak bisa login, tetapi jejak review tetap utuh.
- Alasan: hapus user berisiko memutus relasi.
- Kesulitan: rendah.
- Perubahan database: ya, kolom `is_active`.
- Perubahan UI: tombol nonaktif di manajemen user. Login menolak akun nonaktif.
- Cocok skripsi: ya.

## 11. Profil petugas lebih lengkap

- Manfaat: laporan PDF dapat mencantumkan jabatan dan NIP.
- Alasan: user saat ini hanya nama, username, email, role.
- Kesulitan: rendah.
- Perubahan database: ya, kolom `nip` dan `jabatan_label` opsional.
- Perubahan UI: form profil dan form user.
- Cocok skripsi: ya, pendukung identitas instansi.

## 12. Kode klasifikasi sebagai bagian tampilan, pencarian tetap nomor utuh

- Manfaat: petugas melihat kelompok surat (misalnya 474.1) di tabel.
- Alasan: prefix sudah dipakai saat mencari, tetapi tidak ditampilkan sebagai kolom.
- Kesulitan: rendah.
- Perubahan database: tidak, jika diturunkan dari `no_surat` yang sudah tersimpan.
- Perubahan UI: kolom atau badge klasifikasi.
- Cocok skripsi: ya, asalkan Binary Search tetap mencari `no_surat`, bukan field baru.

## 13. Konfirmasi sebelum arsip dan hapus yang menjelaskan akibatnya

- Manfaat: mengurangi arsip atau hapus yang tidak sengaja.
- Alasan: hapus menghapus lampiran dan disposisi.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: dialog konfirmasi yang menyebut status berikutnya.
- Cocok skripsi: terbatas. Lebih cocok sebagai perbaikan kecil, bukan bab pengembangan utama.

## 14. Laporan disposisi per jabatan dan periode

- Manfaat: Kades melihat beban Kaur/Kasi.
- Alasan: laporan sudah punya agregat `disposisi_by_kepada`, tetapi belum menjadi tampilan yang mudah difilter per jabatan.
- Kesulitan: sedang.
- Perubahan database: tidak.
- Perubahan UI: filter jabatan di halaman laporan dan tabel rinci.
- Cocok skripsi: ya.

## 15. Unduh berkas lampiran dari daftar, bukan hanya detail

- Manfaat: pemeriksaan cepat saat audit.
- Alasan: file sudah disimpan, aksesnya masih lewat halaman detail.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: ikon unduh di tabel jika `file` ada.
- Cocok skripsi: sebagai pelengkap, bukan ide inti.

## 16. Catatan internal Admin yang tidak mengubah isi surat resmi

- Manfaat: Admin mencatat "fisik belum lengkap" tanpa mengubah perihal.
- Alasan: kolom `catatan` saat ini tercampur dengan data surat.
- Kesulitan: sedang.
- Perubahan database: ya, tabel catatan internal.
- Perubahan UI: panel catatan di detail, hanya Admin.
- Cocok skripsi: ya, jika dibatasi agar tidak menjadi modul baru yang besar.

## 17. Pengingat antrian di dashboard berdasarkan umur surat

- Manfaat: surat draft lebih dari tujuh hari tampil lebih dulu.
- Alasan: panel perhatian menghitung jumlah, belum mengurutkan berdasarkan keterlambatan.
- Kesulitan: rendah.
- Perubahan database: tidak. Dihitung dari `tanggal_terima` dan timestamp review.
- Perubahan UI: label "menunggu N hari" di kartu perhatian.
- Cocok skripsi: ya.

## 18. Halaman bantuan singkat per role

- Manfaat: petugas desa yang jarang memakai aplikasi ingat urutan tugasnya.
- Alasan: tidak ada panduan di dalam sistem.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: satu halaman statis atau panel di beranda.
- Cocok skripsi: lemah sebagai kontribusi teknis. Cocok sebagai pelengkap implementasi.

## 19. Cadangan data arsip oleh Admin

- Manfaat: desa punya salinan metadata surat jika perangkat bermasalah.
- Alasan: belum ada fasilitas unduh cadangan.
- Kesulitan: sedang.
- Perubahan database: tidak.
- Perubahan UI: tombol unduh CSV/JSON metadata di menu Admin.
- Cocok skripsi: hati-hati. Jangan sampai terlihat sebagai sistem backup enterprise. Cukup ekspor metadata surat.

## 20. Indeks dan uji waktu pencarian pada data yang lebih banyak

- Manfaat: memperkuat klaim O(log n) dengan angka, bukan hanya kode.
- Alasan: algoritma sudah ada, bukti empiris di dokumen skripsi masih bisa ditambah.
- Kesulitan: sedang.
- Perubahan database: tidak wajib. Bisa berupa skrip uji yang mengisi data uji.
- Perubahan UI: tidak wajib. Bisa tabel hasil uji di lampiran skripsi.
- Cocok skripsi: sangat ya, karena langsung menopang tujuan penelitian tanpa mengubah algoritma.

## 21. Filter jenis surat di laporan PDF

- Manfaat: laporan bisa hanya surat masuk atau hanya surat keluar.
- Alasan: PDF saat ini mengikuti satu periode untuk semua jenis.
- Kesulitan: rendah.
- Perubahan database: tidak.
- Perubahan UI: pilihan jenis sebelum unduh.
- Cocok skripsi: ya.

## 22. Riwayat batal arsip

- Manfaat: diketahui siapa mengembalikan surat dari arsip ke daftar aktif.
- Alasan: unarchive hanya mengubah status, tanpa jejak.
- Kesulitan: rendah jika digabung dengan ide riwayat status.
- Perubahan database: ya, jika belum ada tabel log.
- Perubahan UI: baris di timeline.
- Cocok skripsi: ya, sebagai bagian dari ide riwayat, jangan dibuat modul terpisah.

---

# 19. Rekomendasi

Urutan dari yang paling layak ditambahkan tanpa mengubah judul, tujuan, algoritma Binary Search, atau alur bisnis utama.

## 1. Uji waktu pencarian pada kumpulan nomor surat yang lebih besar

Alasan teknis: Binary Search sudah benar diuji pada data kecil. Klaim O(log n) lebih kuat jika ada perbandingan waktu terhadap pencarian linear pada data terurut yang sama, termasuk kasus prefix banyak hasil (O(log n + k)).

Alasan akademik: ini pengembangan pengukuran, bukan penggantian algoritma. Ruang lingkup penelitian tetap pencarian nomor surat.

## 2. Kunci perubahan surat setelah review

Alasan teknis: menutup celah di mana Admin masih dapat mengubah nomor atau perihal setelah Sekdes atau Kades bertindak.

Alasan akademik: memperkuat validitas alur berjenjang yang menjadi objek penelitian, tanpa menambah aktor atau status baru.

## 3. Riwayat status surat

Alasan teknis: timestamp review sudah ada, tetapi batal arsip, disposisi, dan perubahan lampiran tidak membentuk satu linimasa.

Alasan akademik: memudahkan pengujian skenario use case karena setiap langkah punya bukti waktu dan pelaku.

## 4. Cetak lembar disposisi

Alasan teknis: data disposisi sudah lengkap (dari jabatan, kepada, catatan, tanggal, nomor surat). Yang kurang hanya keluaran kertas.

Alasan akademik: sesuai kebutuhan kantor desa dan tidak mengubah cara disposisi dibuat.

## 5. Kelola master jabatan tujuan

Alasan teknis: tabel dan flag `is_active` sudah ada. UI hanya membuka data yang sekarang tersembunyi di migrasi.

Alasan akademik: tetap satu desa, tetap enam jenis jabatan sebagai data awal, tetap bukan akun Kaur/Kasi.

## 6. Lokasi arsip fisik

Alasan teknis: kolom tambahan, tidak ikut kunci Binary Search.

Alasan akademik: menjembatani arsip digital dan arsip kertas, yang memang konteks desa, tanpa menjadi sistem gudang.

## 7. Seragamkan validasi lampiran

Alasan teknis: satu kebijakan jenis file dan ukuran untuk surat masuk dan keluar mengurangi berkas yang gagal dibuka atau terlalu besar.

Alasan akademik: bagian dari kelengkapan arsip digital, bukan fitur pengenalan isi dokumen.

## 8. Filter tanggal di daftar operasional

Alasan teknis: query tanggal sudah dipakai di arsip dan laporan. Daftar harian belum memakainya.

Alasan akademik: membantu evaluasi pemakaian tanpa mengubah pencarian nomor.

## 9. Umur antrian di panel Perlu Perhatian

Alasan teknis: tanggal terima dan timestamp verifikasi sudah tersimpan. Tidak perlu notifikasi luar sistem.

Alasan akademik: memperdalam dashboard yang sudah menjadi alat kerja tiap role.

## 10. Laporan disposisi per jabatan pada periode terpilih

Alasan teknis: agregasi tujuan disposisi sudah dihitung di `LaporanService`. Pengembangannya adalah filter dan penyajian, plus opsi di PDF.

Alasan akademik: memanfaatkan data alur yang sudah ada untuk kebutuhan monitoring Kades, tanpa modul analisis baru.

Ide yang sengaja tidak direkomendasikan sebagai pengembangan skripsi: portal warga, multi desa, tanda tangan digital, OCR, WhatsApp, dan penggantian Binary Search dengan algoritma lain. Semuanya menggeser tujuan atau ruang lingkup yang sudah ditetapkan.

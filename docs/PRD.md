# Product Requirements Document (PRD)

**Produk:** ArsipDesa — Sistem Informasi Pengarsipan Surat Desa Berbasis Website  
**Versi dokumen:** 1.0  
**Status:** As-built (disusun dari implementasi aktual)  
**Tanggal:** 26 Agustus 2026  
**Instansi sasaran:** Kantor Desa Sindangsari, Kecamatan Cimerak, Kabupaten Pangandaran  

---

## 1. Ringkasan eksekutif

ArsipDesa adalah aplikasi web untuk mengelola siklus administrasi surat di kantor desa: pencatatan surat masuk dan surat keluar, review dan verifikasi berjenjang, pemberian disposisi ke perangkat desa, pengarsipan, pencarian arsip, serta rekapitulasi laporan.

Sistem menggantikan pencatatan manual yang rentan hilang, lambat dilacak, dan sulit dilaporkan. Alur kerja mengikuti hierarki jabatan desa: **Admin** mencatat surat, **Sekretaris Desa (Sekdes)** menelaah dan menetapkan tingkat surat, **Kepala Desa (Kades)** memverifikasi surat penting, lalu Sekdes/Kades memberi disposisi ke Kaur/Kasi terkait.

Pencarian arsip berdasarkan prefix nomor surat menggunakan **Binary Search** agar temu kembali dokumen lebih cepat dibanding pencarian linier pada daftar nomor yang sudah terurut.

---

## 2. Latar belakang dan masalah

### 2.1 Masalah yang diselesaikan

| Masalah | Dampak di kantor desa |
| --- | --- |
| Surat fisik dan register buku mudah tercecer | Sulit menelusuri status dan riwayat tindak lanjut |
| Alur review tidak terdokumentasi | Tidak jelas apakah Sekdes sudah menelaah atau Kades sudah verifikasi |
| Disposisi lisan atau selembar kertas | Instruksi ke Kaur/Kasi tidak tercatat rapi |
| Pencarian arsip manual | Waktu temu kembali lama, terutama saat audit atau permintaan data |
| Laporan dibuat di spreadsheet terpisah | Rekap tidak sinkron dengan data operasional |

### 2.2 Hipotesis produk

Jika pegawai desa memiliki satu sistem sederhana dengan alur yang mengikuti jabatan mereka, maka pencatatan, disposisi, dan pelaporan surat dapat dilakukan tanpa pelatihan teknis yang berat, dan arsip dapat ditemukan kembali dalam hitungan detik melalui nomor surat.

---

## 3. Tujuan produk

1. Mencatat surat masuk dan surat keluar beserta dokumen digital (scan/PDF) secara terpusat.
2. Menegakkan alur kerja berjenjang: draft → review Sekdes → (verifikasi Kades jika penting) → disposisi → arsip.
3. Memberi visibilitas antrian kerja per peran (surat menunggu review, verifikasi, atau disposisi).
4. Menyimpan arsip resmi yang bisa dicari berdasarkan nomor surat, jenis, dan periode.
5. Menyediakan rekapitulasi dan unduhan laporan PDF untuk keperluan monitoring dan pelaporan.

**Bukan tujuan versi ini:** multi-desa, tanda tangan elektronik, notifikasi email/WhatsApp, portal warga, atau manajemen naskah dinas (e-office) lengkap.

---

## 4. Pengguna dan persona

| Peran | Siapa | Kebutuhan utama | Tingkat melek digital |
| --- | --- | --- | --- |
| **Admin** | Operator/staf tata usaha desa | Input data surat, unggah file, kelola user, arsipkan surat selesai | Rendah–sedang |
| **Sekdes** | Sekretaris Desa | Review surat baru, tetapkan tingkat biasa/penting, disposisi surat biasa | Rendah–sedang |
| **Kades** | Kepala Desa | Verifikasi surat penting, disposisi surat penting, pantau antrian | Rendah |

Prinsip UX: Bahasa Indonesia sederhana, label aksi jelas (Tambah Surat, Lihat Detail, Unduh), konfirmasi sebelum hapus, minim langkah, fokus desktop dengan layout yang tetap usable di tablet/ponsel.

---

## 5. Cakupan versi 1.0

### 5.1 In scope

- Autentikasi (login username/password, ingat saya, logout, profil)
- Dashboard per peran dengan kartu antrian dan tren
- CRUD surat masuk (Admin) + review Sekdes + verifikasi Kades
- CRUD surat keluar (Admin), termasuk tautan ke surat masuk sebagai balasan
- Disposisi ke master jabatan tujuan (Kaur/Kasi)
- Arsipkan / batal arsip (Admin)
- Pencarian arsip dengan Binary Search pada prefix nomor surat
- Laporan rekap + export PDF
- Manajemen user (Admin)

### 5.2 Out of scope

- Registrasi mandiri oleh publik (halaman Breeze ada, bukan alur operasional)
- Export Excel
- Notifikasi email, push, atau WhatsApp saat status berubah
- Status siklus pada record disposisi (status disposisi telah dihapus; status mengikuti surat induk)
- CRUD master jabatan tujuan dari UI (saat ini lewat seeder)
- Multi-tenant / banyak desa
- Tanda tangan digital dan numbering otomatis sesuai klasifikasi naskah dinas
- Hak akses untuk Kaur/Kasi sebagai pengguna sistem (mereka hanya tujuan disposisi)

---

## 6. Alur kerja utama

### 6.1 Surat masuk

```
Admin input surat
        │
        ▼
   status: draft
   tampilan: "Draft"
        │
        ▼
Sekdes review + pilih tingkat
        │
        ├── tingkat = biasa ────────────────────────────────┐
        │     status: terverifikasi                          │
        │     tampilan: "Review Sekdes"                      │
        │     pelaku disposisi: Sekdes                       │
        │                                                    ▼
        └── tingkat = penting ──► menunggu verifikasi Kades ─┤
              tampilan: "Menunggu verifikasi Kades"          │
                    │                                        │
                    ▼                                        │
              Kades verifikasi                               │
              tampilan: "Siap disposisi Kades"               │
              pelaku disposisi: Kades                        │
                    │                                        │
                    └────────────────────────────────────────┘
                                    │
                                    ▼
                         Buat disposisi (jabatan + catatan)
                         status: didisposisikan
                                    │
                                    ▼
                         Admin arsipkan
                         status: diarsipkan
```

**Aturan bisnis:**

| Kondisi | Boleh? |
| --- | --- |
| Sekdes review hanya jika status `draft` dan belum diarsip | Ya |
| Kades verifikasi hanya jika tingkat `penting`, status `terverifikasi`, belum `verified_kades_at` | Ya |
| Sekdes buat disposisi hanya untuk tingkat `biasa` + status `terverifikasi` | Ya |
| Kades buat disposisi hanya untuk tingkat `penting` + sudah verifikasi Kades + status `terverifikasi` | Ya |
| Admin arsipkan surat masuk hanya jika status `didisposisikan` | Ya |
| Batal arsip mengembalikan surat masuk ke status `didisposisikan` | Ya |
| Nomor surat unik di tabel `surat_masuk` | Ya |

### 6.2 Surat keluar

1. Admin mengisi nomor, tanggal kirim, tujuan, perihal, status (`draft` / `terkirim`), dan **wajib** mengunggah file (PDF/DOC/DOCX).
2. Opsional: tautkan ke surat masuk sebagai surat balasan (`surat_masuk_id`).
3. Admin dapat mengarsipkan dan membatalkan arsip.
4. Daftar operasional hanya menampilkan surat yang belum diarsipkan.

### 6.3 Disposisi

- Pelaku: Sekdes atau Kades, sesuai syarat di 6.1.
- Tujuan dipilih dari master jabatan aktif: Kaur Pemerintahan, Kaur Keuangan, Kaur Umum, Kasi Pelayanan, Kasi Kesejahteraan, Kasi Pemerintahan.
- Field: jabatan tujuan, catatan instruksi, tanggal.
- Daftar disposisi difilter menurut `dari_jabatan` (Sekdes hanya melihat disposisi miliknya; Kades hanya miliknya).
- Pembuatan disposisi pertama dari status `terverifikasi` menaikkan status surat menjadi `didisposisikan`.
- Satu surat dapat memiliki lebih dari satu disposisi; riwayat tampil di detail surat.

---

## 7. Matriks hak akses

| Fitur | Admin | Sekdes | Kades |
| --- | --- | --- | --- |
| Login / logout / ubah profil & password | ✓ | ✓ | ✓ |
| Dashboard sesuai peran | ✓ | ✓ | ✓ |
| Lihat daftar & detail surat masuk | ✓ | ✓ | ✓ |
| Tambah / ubah / hapus surat masuk | ✓ | — | — |
| Review surat (tetapkan tingkat) | — | ✓ | — |
| Verifikasi surat penting | — | — | ✓ |
| Buat disposisi | — | ✓ (biasa) | ✓ (penting) |
| Lihat daftar & detail disposisi | — | ✓ (milik sendiri) | ✓ (milik sendiri) |
| Lihat daftar & detail surat keluar | ✓ | ✓ | ✓ |
| Tambah / ubah / hapus surat keluar | ✓ | — | — |
| Arsipkan / batal arsip | ✓ | — | — |
| Lihat arsip + pencarian + detail | ✓ | ✓ | ✓ |
| Lihat laporan + unduh PDF | ✓ | ✓ | ✓ |
| Manajemen user (CRUD) | ✓ | — | — |
| Hapus akun sendiri / ubah peran sendiri | Ditolak sistem | — | — |

Menu navigasi hampir sama antar peran; yang berbeda adalah **aksi**, kecuali menu Disposisi (hanya Sekdes & Kades) dan Manajemen User (hanya Admin).

---

## 8. Kebutuhan fungsional

Prioritas: **P0** wajib versi 1.0 (sudah diimplementasikan), **P1** penting lanjutan, **P2** nice-to-have.

### 8.1 Autentikasi & sesi — UC01, UC10

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-01 | Login dengan username dan password | P0 | Kredensial benar → dashboard sesuai peran; salah → pesan error, tetap di login |
| FR-02 | Tampilkan/sembunyikan password | P0 | Ikon mata berfungsi |
| FR-03 | Opsi “Ingat saya” | P0 | Sesi bertahan sesuai konfigurasi Laravel |
| FR-04 | Role tidak dipilih di UI | P0 | Role berasal dari data user di server |
| FR-05 | Logout | P0 | Sesi dihapus, redirect ke login |
| FR-06 | Ubah nama, email, dan password di profil | P0 | Validasi berlaku; password lama diperlukan untuk ganti password |
| FR-07 | Pengguna tidak terautentikasi tidak dapat mengakses modul | P0 | Redirect ke `/login` |
| FR-08 | Role tidak sesuai mendapat 403 | P0 | Middleware `role` menolak akses |

### 8.2 Dashboard

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-10 | Dashboard Admin menampilkan ringkasan surat masuk/keluar, arsip, user, tren 6 bulan, surat terbaru, dan kartu perhatian | P0 | Angka sesuai data live; kartu perhatian hanya muncul jika count > 0 dan mengarah ke daftar terfilter |
| FR-11 | Dashboard Sekdes menampilkan antrian review, surat biasa tanpa disposisi, surat penting menunggu Kades | P0 | Kartu perhatian klikable ke filter yang tepat |
| FR-12 | Dashboard Kades menampilkan antrian verifikasi dan surat penting siap disposisi | P0 | Sama seperti di atas |

Kartu perhatian Admin mencakup: menunggu review Sekdes, surat biasa tanpa disposisi, penting menunggu Kades, penting siap disposisi, siap diarsipkan, surat keluar masih draft.

### 8.3 Surat masuk — UC02, UC05, UC06

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-20 | Daftar surat masuk aktif (belum diarsip) dengan search, sort, pagination, filter status/tingkat/disposisi/aksi Kades | P0 | Per halaman 10/20/50/100; search prefix nomor via Binary Search |
| FR-21 | Admin menambah surat: no_surat, tanggal surat, tanggal terima, pengirim, perihal, tujuan (opsional), catatan (opsional), file (opsional) | P0 | Status awal selalu `draft`; tingkat tidak diisi Admin |
| FR-22 | Nomor surat unik | P0 | Duplikat ditolak validasi |
| FR-23 | Unggah file surat masuk: PDF, JPEG, JPG, PNG, DOC, DOCX, maks. 5 MB | P0 | Format/ukuran salah ditolak; file tersimpan di disk `public` |
| FR-24 | Preview file di form dan detail | P0 | PDF/gambar dapat dilihat; nama file tampil |
| FR-25 | Admin mengubah data surat (kecuali status dan tingkat) | P0 | File baru mengganti file lama |
| FR-26 | Admin menghapus surat beserta file | P0 | Konfirmasi sebelum hapus |
| FR-27 | Sekdes mereview draft: pilih tingkat `biasa` atau `penting` | P0 | Status jadi `terverifikasi`; `verified_sekdes_at/by` terisi |
| FR-28 | Kades memverifikasi surat penting yang sudah direview | P0 | `verified_kades_at/by` terisi; status DB tetap `terverifikasi` |
| FR-29 | Status tampilan UI mengikuti alur, terpisah dari kolom status DB | P0 | Label: Draft, Review Sekdes, Menunggu verifikasi Kades, Siap disposisi Kades, Didisposisikan, Diarsipkan |
| FR-30 | Detail menampilkan data lengkap, preview, riwayat disposisi, dan tombol aksi sesuai hak | P0 | Flag `can_review_by_sekdes`, `can_verify_by_kades`, `can_create_disposisi`, `can_archive` dari server |

### 8.4 Surat keluar — UC02

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-40 | Daftar surat keluar aktif dengan search, sort, pagination, filter status | P0 | Search prefix nomor via Binary Search |
| FR-41 | Admin menambah surat: no_surat unik, tanggal kirim, tujuan, perihal, catatan, status draft/terkirim, file wajib PDF/DOC/DOCX | P0 | Tanpa file ditolak |
| FR-42 | Opsional tautkan ke surat masuk (balasan) | P0 | Relasi `surat_masuk_id` tersimpan |
| FR-43 | Ubah, ganti file, hapus, lihat detail + preview | P0 | File lama terhapus saat diganti |

### 8.5 Disposisi — UC07

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-50 | Daftar disposisi milik peran login, dengan search/sort/pagination/filter status surat | P0 | Sekdes tidak melihat disposisi Kades dan sebaliknya |
| FR-51 | Buat disposisi dari menu Disposisi atau dari detail surat | P0 | Pilihan surat hanya yang memenuhi syarat peran |
| FR-52 | Wajib: jabatan tujuan (master aktif), catatan, tanggal | P0 | `kepada` diisi nama jabatan; `dari_jabatan` otomatis sesuai peran |
| FR-53 | Setelah disposisi, status surat `terverifikasi` menjadi `didisposisikan` | P0 | Surat yang tidak memenuhi syarat ditolak validasi |

### 8.6 Arsip — UC03, UC08

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-60 | Admin mengarsipkan surat masuk berstatus `didisposisikan` | P0 | `diarsipkan_at` terisi; status `diarsipkan`; hilang dari daftar operasional |
| FR-61 | Admin mengarsipkan surat keluar | P0 | Sama, tanpa syarat status didisposisi |
| FR-62 | Admin membatalkan arsip | P0 | Surat masuk kembali `didisposisikan`; `diarsipkan_at` null |
| FR-63 | Daftar arsip gabungan masuk + keluar | P0 | Filter jenis: semua / masuk / keluar; rentang 7/30/90 hari |
| FR-64 | Pencarian prefix nomor surat dengan Binary Search | P0 | Case-insensitive; tidak ketemu → daftar kosong |
| FR-65 | Lihat detail arsip | P0 | Data dan file tetap dapat dibuka |

### 8.7 Laporan — UC09

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-70 | Rekap sesuai filter rentang: semua, 7 hari, 30 hari, 90 hari, 1 tahun | P0 | Statistik: jumlah masuk/keluar/arsip/disposisi, breakdown status tampil, tingkat, tren bulanan, top pengirim, disposisi per jabatan tujuan |
| FR-71 | Unduh PDF A4 | P0 | Nama file `laporan-surat-{timestamp}.pdf`; memuat pembuat dan waktu generate |
| FR-72 | Periode tanpa data tetap menampilkan nol | P0 | Tidak error |

### 8.8 Manajemen user — UC04

| ID | Requirement | Prioritas | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-80 | Admin CRUD user: nama, username unik (alpha_dash), email unik, password min. 8 (confirmed), role admin/sekdes/kades | P0 | Search, filter role, sort, pagination |
| FR-81 | Tidak dapat menghapus akun sendiri atau mengubah peran sendiri | P0 | Ditolak dengan pesan kesalahan |

---

## 9. Kebutuhan non-fungsional

| ID | Kategori | Requirement |
| --- | --- | --- |
| NFR-01 | Usability | UI Bahasa Indonesia, kontras jelas, tombol besar, konfirmasi destruktif, toast sukses/gagal |
| NFR-02 | Performance | Pencarian nomor surat O(log n) via Binary Search pada daftar terurut; pagination default 10 baris |
| NFR-03 | Security | Password di-hash; CSRF Laravel; middleware auth + role; whitelist kolom sort (cegah injection ORDER BY); unggahan dibatasi mime & ukuran |
| NFR-04 | Reliability | Validasi server-side pada setiap form; file lama dihapus saat diganti; error di-log |
| NFR-05 | Compatibility | Browser modern (Chrome/Edge/Firefox); fokus desktop, tetap usable di viewport lebih kecil |
| NFR-06 | Maintainability | Laravel service layer, Form Request, Inertia page per fitur, tes PHPUnit untuk alur kritis |
| NFR-07 | Localization | Format tanggal dan label status dalam Bahasa Indonesia |
| NFR-08 | Storage | File di `storage/app/public` (`surat-masuk/`, `surat-keluar/`) |

---

## 10. Model data (ringkas)

### 10.1 Entitas

| Entitas | Fungsi |
| --- | --- |
| `users` | Akun: name, username, email, password, role (`admin` \| `sekdes` \| `kades`) |
| `surat_masuk` | Register surat masuk + file + status alur + jejak review/verifikasi |
| `surat_keluar` | Register surat keluar + file + status + opsional tautan ke surat masuk |
| `disposisi` | Instruksi dari Sekdes/Kades ke jabatan tujuan |
| `jabatan_tujuan_disposisi` | Master Kaur/Kasi (nama, is_active, sort_order) |

### 10.2 Status surat masuk (kolom DB)

`draft` → `terverifikasi` → `didisposisikan` → `diarsipkan`

### 10.3 Status tampilan (derived, tidak disimpan)

| `status_tampil` | Kondisi |
| --- | --- |
| `menunggu_review_sekdes` | status `draft` |
| `direview_sekdes` | status `terverifikasi`, tingkat biasa |
| `menunggu_verifikasi_kades` | terverifikasi + penting + belum verifikasi Kades |
| `siap_disposisi_kades` | terverifikasi + penting + sudah verifikasi Kades |
| `didisposisikan` | status `didisposisikan` |
| `diarsipkan` | `diarsipkan_at` terisi atau status `diarsipkan` |

### 10.4 Relasi penting

- Surat masuk 1—N disposisi
- Surat masuk 1—N surat keluar (balasan)
- Disposisi N—1 user (pembuat)
- Disposisi N—1 jabatan tujuan
- Review/verifikasi mencatat user id pada `verified_sekdes_by` / `verified_kades_by`

---

## 11. Antarmuka dan navigasi

**Layout:** sidebar kiri (dapat collapse) + header (avatar, profil, logout) + konten utama.

| Menu | Rute | Role |
| --- | --- | --- |
| Beranda | `/dashboard` | semua |
| Surat Masuk | `/surat-masuk` | admin, sekdes, kades |
| Disposisi | `/disposisi` | sekdes, kades |
| Surat Keluar | `/surat-keluar` | admin, sekdes, kades |
| Arsip Surat | `/arsip-surat` | admin, sekdes, kades |
| Laporan | `/laporan` | admin, sekdes, kades |
| Manajemen User | `/users` | admin |

Root `/` mengarah ke login.

**State UI wajib pada tabel/form:** loading, kosong, error validasi, sukses (flash/toast).

**Visual:** palet biru pemerintahan, netral putih/abu, badge status (draft abu, proses kuning, selesai hijau), ikon Lucide, komponen shadcn/ui.

---

## 12. Arsitektur teknis

| Lapisan | Teknologi |
| --- | --- |
| Backend | PHP 8.2, Laravel 12 |
| Frontend | React 18, Inertia.js 2, Tailwind CSS, shadcn/ui, TanStack Table, Recharts |
| Auth | Laravel Breeze (session), Sanctum tersedia di dependensi |
| PDF | barryvdh/laravel-dompdf |
| Pencarian nomor | `BinarySearchService` + `SuratNomorSearchService` (prefix, case-insensitive) |
| Storage | Laravel disk `public` |
| Tes | PHPUnit (auth, role, workflow surat, disposisi, laporan, pencarian nomor) |

Pola backend: Controller tipis → Service → Eloquent. Otorisasi gabungan middleware role + method di model `User` / `SuratMasuk`.

---

## 13. Metrik keberhasilan

| Metrik | Target operasional |
| --- | --- |
| Waktu temukan arsip by nomor | Lebih cepat dari pencarian manual di buku register |
| Surat draft tanpa review | Terlihat di dashboard Sekdes (kartu perhatian) |
| Surat penting tanpa verifikasi Kades | Terlihat di dashboard Kades |
| Laporan periodik | Dapat diunduh PDF tanpa export manual spreadsheet |
| Kesalahan input | Validasi menolak nomor duplikat dan file tidak sesuai sebelum data tersimpan |
| Adopsi | Admin, Sekdes, dan Kades menyelesaikan alur end-to-end tanpa bantuan teknis berulang |

Untuk evaluasi akademis, skenario use case UC01–UC10 dan pengujian alpha terdokumentasi di folder `docs/`.

---

## 14. Risiko dan asumsi

**Asumsi**

- Satu instansi (satu desa) per instalasi.
- Operator yang menginput surat adalah Admin, bukan Sekdes/Kades.
- Kaur/Kasi menerima instruksi di luar sistem (disposisi tercatat, bukan login mereka).
- Nomor surat sudah ditentukan di naskah, tidak digenerate otomatis.
- Infrastruktur: web server lokal/intranet (contoh: Laragon) dengan PHP 8.2+.

**Risiko**

| Risiko | Mitigasi saat ini / saran |
| --- | --- |
| Pegawai kurang familiar UI | Label sederhana, sedikit langkah, konfirmasi hapus |
| File scan besar | Batas 5 MB surat masuk; perlu batas eksplisit surat keluar (saat ini tidak di-set di StoreRequest) |
| Binary Search hanya prefix nomor, bukan perihal/pengirim | Dokumentasikan ke user; P1: hybrid search |
| Tidak ada notifikasi | Antrian mengandalkan dashboard; P1: notifikasi in-app |
| Backup file belum diatur produk | Perlu prosedur backup storage + database di operasional |

---

## 15. Roadmap lanjutan (tidak mengikat versi 1.0)

| Prioritas | Item |
| --- | --- |
| P1 | Pencarian full-text (perihal, pengirim, tujuan) di samping prefix nomor |
| P1 | Batas ukuran file surat keluar yang eksplisit + preview gambar jika suatu saat diizinkan |
| P1 | Notifikasi in-app saat surat masuk antrian review/verifikasi/disposisi |
| P1 | Export Excel untuk laporan |
| P1 | UI kelola master jabatan tujuan disposisi |
| P2 | Nomor surat otomatis sesuai kode klasifikasi desa |
| P2 | Role Kaur/Kasi untuk menandai tindak lanjut disposisi |
| P2 | Audit log aksi (siapa mengubah/menghapus) |
| P2 | Multi-desa / white-label kecamatan |

---

## 16. Use case terkait

Dokumen ini selaras dengan skenario di `docs/use-case-scenario.docx` dan diagram di `docs/`:

| ID | Nama | Aktor utama |
| --- | --- | --- |
| UC01 | Login | Admin, Sekdes, Kades |
| UC02 | Mengelola surat masuk & keluar | Admin |
| UC03 | Mengelola arsip surat | Admin |
| UC04 | Mengelola user | Admin |
| UC05 | Review surat masuk | Sekdes |
| UC06 | Verifikasi surat masuk | Kades |
| UC07 | Pemberian disposisi | Sekdes, Kades |
| UC08 | Pencarian arsip surat | Admin, Sekdes, Kades |
| UC09 | Rekapitulasi & laporan arsip surat | Admin, Sekdes, Kades |
| UC10 | Logout | Admin, Sekdes, Kades |

---

## 17. Lampiran — akun seed pengembangan

Hanya untuk lingkungan lokal/demo, bukan produksi:

| Username | Role | Password default seeder |
| --- | --- | --- |
| `admin` | Admin | `password` |
| `sekdes` | Sekretaris Desa | `password` |
| `kades` | Kepala Desa | `password` |

Seeder workflow (`DesaWorkflowSeeder`) mengisi 50 surat masuk, disposisi terkait, dan 50 surat keluar dengan variasi status untuk keperluan uji dan demo.

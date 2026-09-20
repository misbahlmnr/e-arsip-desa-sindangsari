# Skrip Penjelasan Aplikasi E-Arsip Desa

**Aplikasi:** E-Arsip — Sistem Arsip Surat Desa Sindangsari  
**Kecamatan:** Cimerak, Kabupaten Pangandaran  
**Tujuan dokumen:** naskah demo / presentasi berurutan dari sisi **Admin**, **Sekretaris Desa (Sekdes)**, dan **Kepala Desa (Kades)**  
**Data demo:** akun dan surat dummy dari seeder (`php artisan db:seed`)

Cara pakai: bacakan bagian **Narasi**, lalu ikuti **Aksi** di layar. Teks di dalam tanda kutip bisa diucapkan langsung.

---

## 0. Pengantar singkat (sebelum login)

**Narasi**

> E-Arsip adalah sistem pengarsipan surat desa berbasis website. Aplikasi ini dipakai untuk mencatat surat masuk, surat keluar, review berjenjang, disposisi ke perangkat desa, arsip, dan laporan.
>
> Ada tiga peran. **Admin** mencatat surat dan mengelola akun. **Sekdes** menelaah surat baru dan memberi disposisi untuk surat biasa. **Kades** memverifikasi surat penting lalu memberi disposisi. Setelah disposisi selesai, Admin mengarsipkan surat.
>
> Alurnya berjenjang: Admin input, Sekdes review, kalau penting Kades verifikasi, lalu disposisi, terakhir arsip.

**Alur yang akan didemonstrasikan**

```
Login
  → Dashboard sesuai peran
  → Surat Masuk / Surat Keluar
  → Review Sekdes
  → Verifikasi Kades (jika penting)
  → Disposisi
  → Arsip
  → Laporan
  → Manajemen User (Admin saja)
  → Logout
```

---

## 1. Halaman login

**Aksi:** buka aplikasi. Pengunjung langsung diarahkan ke halaman login.

**Narasi**

> Pertama, pengguna masuk ke sistem. Yang tampil adalah halaman login Desa Sindangsari. Di sisi kiri ada identitas desa, di sisi kanan form masuk.
>
> Pengguna wajib mengisi **username** dan **password**. Ada opsi **Ingat saya di perangkat ini**. Jika akun salah, sistem menampilkan peringatan bahwa username atau password tidak sesuai.
>
> Setelah berhasil, sistem mengarahkan ke **Beranda** sesuai peran: Admin, Sekdes, atau Kades.

### Akun dummy (seeder)

| Peran | Nama tampilan | Username | Password | Email |
| --- | --- | --- | --- | --- |
| Administrator | Admin | `admin` | `password` | admin@gmail.com |
| Sekretaris Desa | Sekdes | `sekdes` | `password` | sekdes@gmail.com |
| Kepala Desa | Kades | `kades` | `password` | kades@gmail.com |

> Semua password dummy sama: `password`. Gunakan ini hanya untuk demo.

---

## BAGIAN A — Demo sebagai Admin

### A1. Login Admin

**Aksi**

1. Username: `admin`
2. Password: `password`
3. Klik **Masuk**

**Narasi**

> Saya masuk sebagai Admin, yaitu operator atau staf tata usaha desa. Setelah login, sistem mengarahkan ke Beranda Admin.

---

### A2. Beranda Admin

**Narasi**

> Di Beranda Admin terlihat ringkasan seluruh modul e-arsip.
>
> Bagian atas ada tombol akses cepat: **Tambah Surat Masuk**, **Tambah Surat Keluar**, **Arsip Surat**, **Laporan**, dan **Manajemen User**.
>
> Lalu ada kartu ringkasan:
>
> - **Surat Masuk** — jumlah surat masuk yang masih aktif
> - **Menunggu Review** — surat baru yang belum ditelaah Sekdes
> - **Surat Keluar** — jumlah surat keluar aktif
> - **Disposisi** — termasuk surat penting yang menunggu Kades
> - **Arsip** — surat yang sudah diarsipkan, plus petunjuk berapa yang siap diarsipkan
>
> Di bawahnya ada panel **Perlu Perhatian**. Panel ini menampilkan antrian kerja, misalnya surat menunggu review Sekdes, surat biasa tanpa disposisi, surat penting menunggu Kades, surat siap diarsipkan, dan surat keluar yang masih draft. Angka di kartu bisa diklik untuk membuka daftar yang relevan.
>
> Ada juga **Tren Surat 6 Bulan**, **Status Ringkas**, tabel **Surat Masuk Terbaru**, **Surat Keluar Terbaru**, serta daftar yang menunggu tindak lanjut Kepala Desa.
>
> Menu kiri Admin: Beranda, Surat Masuk, Surat Keluar, Arsip Surat, Laporan, dan Manajemen User. Admin **tidak** punya menu Disposisi, karena yang memberi instruksi adalah Sekdes dan Kades.

**Data dummy yang sudah ada di dashboard**

Seeder menyiapkan sekitar **50 surat masuk** dan **50 surat keluar**, dengan status bercampur supaya kartu tidak kosong:

| Kondisi dummy surat masuk | Perkiraan jumlah | Status tampilan |
| --- | --- | --- |
| Masih draft, menunggu review Sekdes | 10 | Draft |
| Sudah direview, tingkat biasa, belum disposisi | 10 | Review Sekdes |
| Tingkat penting, menunggu verifikasi Kades | 5 | Menunggu verifikasi Kades |
| Sudah diverifikasi Kades, menunggu disposisi | 5 | Siap disposisi Kades |
| Sudah didisposisikan | 15 | Didisposisikan |
| Sudah diarsipkan | 5 | Diarsipkan |

Contoh pengirim dummy: Kecamatan Cikarang Utara, Pemerintah Kabupaten Bekasi, Dinas Sosial, BPD, Karang Taruna, dan warga.

---

### A3. Surat Masuk — lihat daftar

**Aksi:** klik menu **Surat Masuk**, atau tombol **Tambah Surat Masuk** nanti.

**Narasi**

> Ini daftar surat yang diterima kantor desa. Ada pencarian nomor surat, tabel, dan pagination. Status setiap baris mengikuti alur: Draft, Review Sekdes, Menunggu verifikasi Kades, Siap disposisi Kades, Didisposisikan, atau Diarsipkan.
>
> Admin bisa menambah, mengubah, menghapus, dan mengarsipkan. Admin **tidak** bisa review atau membuat disposisi.

Contoh baris dummy yang bisa dibuka (nomor mengikuti tanggal seeder; yang pasti ada adalah pola seperti `470.1/001/...` sampai `474.x/050/...`). Untuk demo, buka salah satu surat berstatus **Draft** atau **Didisposisikan**.

---

### A4. Tambah Surat Masuk (data dummy)

**Aksi:** klik **Tambah Surat**.

**Narasi**

> Form ini untuk mencatat surat baru yang baru saja diterima. Wajib diisi: nomor surat, tanggal surat, tanggal diterima, pengirim, dan perihal. Tujuan boleh diisi, catatan opsional. Lampiran scan PDF juga opsional.
>
> Setelah disimpan, status surat otomatis **Draft**. Artinya menunggu review Sekretaris Desa.

**Isi form dengan data dummy berikut**

| Field | Isi dummy |
| --- | --- |
| Nomor Surat | `474.1/022/IX/2026` |
| Tanggal Surat | `2026-09-01` |
| Tanggal Diterima | `2026-09-03` |
| Pengirim | `Kecamatan Cimerak` |
| Perihal | `Undangan Rapat Koordinasi Bulanan Kecamatan` |
| Tujuan | `Kantor Desa Sindangsari` |
| Catatan | `Surat diterima via pos. Mohon ditelaah Sekdes.` |
| Lampiran | opsional (PDF scan) |

Klik **Simpan Surat**.

> Surat baru muncul di daftar dengan status Draft. Kartu **Menunggu Review** di dashboard Admin akan bertambah.

Kalau nomor sudah terpakai, ganti urutan, misalnya `474.1/099/IX/2026`.

---

### A5. Detail, edit, hapus Surat Masuk

**Aksi:** klik salah satu nomor surat dummy.

**Narasi**

> Halaman detail menampilkan nomor, tanggal, pengirim, perihal, catatan, status, dan lampiran. Jika sudah direview, tampil waktu review Sekdes. Jika penting dan sudah diverifikasi, tampil waktu verifikasi Kades.
>
> Tombol Admin di sini: **Edit**, **Hapus**, dan **Arsipkan** (hanya jika status sudah Didisposisikan). Tombol Review, Verifikasi, dan Buat Disposisi tidak muncul untuk Admin.

Untuk demo hapus, pakai surat dummy yang baru dibuat, jangan hapus data seeder yang masih dipakai alur berikutnya. Untuk demo arsip, buka surat berstatus **Didisposisikan**, lalu klik **Arsipkan**.

---

### A6. Surat Keluar — lihat daftar

**Aksi:** menu **Surat Keluar**.

**Narasi**

> Ini daftar surat yang dikirim kantor desa. Statusnya **Draft** atau **Terkirim**. Surat yang sudah diarsip tidak tampil di sini, melainkan di menu Arsip.
>
> Beberapa dummy sudah tertaut sebagai balasan surat masuk, misalnya konfirmasi undangan atau balasan permohonan data.

---

### A7. Tambah Surat Keluar (data dummy)

**Aksi:** klik **Tambah Surat**.

**Narasi**

> Form surat keluar mirip surat masuk, plus pilihan status Draft atau Terkirim. File lampiran boleh diunggah. Setelah simpan, data masuk daftar operasional.

**Isi form dengan data dummy berikut**

| Field | Isi dummy |
| --- | --- |
| Nomor Surat | `145/051/IX/2026` |
| Tujuan | `Kecamatan Cimerak` |
| Tanggal Kirim | `2026-09-08` |
| Perihal | `Surat Konfirmasi Kehadiran — Undangan Rapat Koordinasi Bulanan Kecamatan` |
| Status | `Draft` dulu, atau `Terkirim` jika sudah dikirim |
| Catatan | `Draf awal; menunggu paraf Kepala Desa.` |
| Lampiran | opsional |

Klik **Simpan Surat**.

Dummy seeder surat keluar memakai pola nomor `145/001/...` sampai `145/050/...`, jenis seperti Surat Keterangan Domisili, Surat Pengantar SKCK, Surat Tugas, dan Surat Balasan.

---

### A8. Arsip Surat

**Aksi:** menu **Arsip Surat**.

**Narasi**

> Arsip adalah tempat surat yang sudah selesai diproses. Bisa disaring jenis surat masuk atau keluar, serta periode tanggal arsip. Pencarian nomor surat memakai Binary Search pada prefix nomor, jadi temu kembali lebih cepat.
>
> Contoh cari dummy: ketik `145/` untuk surat keluar, atau `474` untuk sebagian surat masuk. Klik baris untuk melihat detail arsip. Admin juga bisa membatalkan arsip dari detail jika perlu dikembalikan ke daftar operasional.

---

### A9. Laporan

**Aksi:** menu **Laporan**.

**Narasi**

> Halaman laporan menampilkan rekap surat masuk, surat keluar, arsip, dan disposisi. Periode bisa diubah: semua waktu, 7 hari, 30 hari, 90 hari, atau 1 tahun.
>
> Ada grafik tren, sebaran status, pengirim teratas, dan disposisi per jabatan tujuan. Tombol **Unduh PDF** menghasilkan laporan cetak untuk monitoring atau pelaporan ke kecamatan.

Untuk demo: pilih **30 hari terakhir**, jelaskan angkanya, lalu klik **Unduh PDF**.

---

### A10. Manajemen User

**Aksi:** menu **Manajemen User**.

**Narasi**

> Hanya Admin yang bisa mengelola akun. Di sini ada daftar Admin, Sekdes, dan Kades. Bisa dicari dan difilter menurut peran.

**Tambah pengguna dummy**

Klik **Tambah Pengguna**, isi:

| Field | Isi dummy |
| --- | --- |
| Nama lengkap | `Operator Desa` |
| Username | `operator` |
| Email | `operator@desa.go.id` |
| Password | `password` |
| Konfirmasi password | `password` |
| Peran | `Admin` |

Klik simpan.

> Akun baru bisa dipakai login. Admin juga bisa mengubah data, mengganti peran, atau menghapus akun lain. Akun sendiri tidak dihapus dari daftar ini.

---

### A11. Logout Admin

**Aksi:** klik nama di kanan atas → **Keluar**.

**Narasi**

> Setelah selesai, Admin keluar. Sistem kembali ke halaman login. Berikutnya saya masuk sebagai Sekretaris Desa.

---

## BAGIAN B — Demo sebagai Sekretaris Desa (Sekdes)

### B1. Login Sekdes

**Aksi**

1. Username: `sekdes`
2. Password: `password`
3. Klik **Masuk**

**Narasi**

> Sekarang saya masuk sebagai Sekretaris Desa. Setelah login, sistem mengarahkan ke Beranda Sekdes, bukan dashboard Admin.

---

### B2. Beranda Sekdes

**Narasi**

> Beranda Sekdes fokus pada antrian kerja surat. Ada akses cepat ke Surat Masuk, Disposisi, Arsip, dan Laporan.
>
> Kartu ringkasannya:
>
> - **Surat Masuk**
> - **Tanpa Disposisi** — surat tingkat biasa yang sudah direview tapi belum ada instruksi
> - **Disposisi** — disposisi yang dibuat Sekdes
> - **Menunggu Kades** — surat penting yang belum diverifikasi Kepala Desa
> - **Arsip**
>
> Panel **Perlu Perhatian** menandai tiga pekerjaan Sekdes: review surat draft, buat disposisi surat biasa, dan pantau surat penting yang menunggu Kades.
>
> Ada tren 6 bulan, status ringkas, surat masuk terbaru, disposisi terbaru, dan daftar surat menunggu Kepala Desa.
>
> Menu kiri Sekdes: Beranda, Surat Masuk, **Disposisi**, Surat Keluar, Arsip Surat, Laporan. Tidak ada Manajemen User. Sekdes tidak bisa menambah atau menghapus surat; yang bisa dilakukan adalah review dan disposisi.

---

### B3. Review Surat Masuk

**Aksi:** menu **Surat Masuk** → buka surat berstatus **Draft**.

Pilih dummy seeder yang statusnya Draft, atau surat baru yang tadi dibuat Admin (`474.1/022/IX/2026` — Undangan Rapat Koordinasi).

**Narasi**

> Surat masih Draft. Tugas Sekdes adalah menelaah dan menetapkan tingkat kepentingan. Saya klik **Review Surat**.

**Aksi di modal Review**

1. Tingkat Surat: pilih **Biasa** atau **Penting**
2. Klik simpan review

Penjelasan yang bisa diucapkan:

> Kalau saya pilih **Biasa**, status menjadi Review Sekdes. Disposisi nantinya dibuat oleh Sekdes.
>
> Kalau saya pilih **Penting**, surat menunggu verifikasi Kepala Desa. Disposisi nantinya dibuat oleh Kades, bukan Sekdes.

**Saran demo berurutan**

1. Review satu surat sebagai **Biasa** (untuk demo disposisi Sekdes).
2. Review satu surat lain sebagai **Penting** (untuk demo verifikasi Kades nanti).

Contoh dummy perihal yang cocok **Biasa:** Permohonan Izin Penggunaan Balai Desa.  
Contoh yang cocok **Penting:** Surat Edaran Penyelenggaraan Pemilihan Serentak, atau Monitoring Program Stunting.

---

### B4. Buat Disposisi (surat biasa)

**Aksi:** tetap di detail surat yang sudah direview sebagai **Biasa**. Tombol **Buat Disposisi** muncul.

**Narasi**

> Surat biasa sudah direview. Sekdes meneruskan instruksi ke perangkat desa. Field **Dari** terisi otomatis Sekretaris Desa. Saya pilih jabatan tujuan dan menuliskan arahan.

**Isi dummy disposisi**

| Field | Isi dummy |
| --- | --- |
| Dari | `Sekretaris Desa` (otomatis) |
| Kepada | `Kaur Umum` |
| Catatan / Arahan | `Hadiri kegiatan dan sampaikan laporan singkat.` |

Klik **Kirim Disposisi**.

> Status surat berubah menjadi **Didisposisikan**. Instruksi tercatat dan bisa dilihat di menu Disposisi.

Jabatan tujuan dummy yang tersedia:

- Kaur Pemerintahan
- Kaur Keuangan
- Kaur Umum
- Kasi Pelayanan
- Kasi Kesejahteraan
- Kasi Pemerintahan

Contoh arahan dummy lain:

- `Ditindaklanjuti sesuai ketentuan yang berlaku.`
- `Siapkan draf jawaban surat untuk ditandatangani Kepala Desa.`
- `Koordinasikan dengan pihak terkait di lingkungan desa.`
- `Buat laporan tindak lanjut paling lambat 7 hari kerja.`

---

### B5. Menu Disposisi

**Aksi:** menu **Disposisi**.

**Narasi**

> Ini daftar instruksi yang sudah dikeluarkan dan suratnya belum diarsip. Bisa dicari, difilter status surat, dan dibuka detailnya. Tombol **Buat Disposisi** membuka form pilih surat yang memang siap didisposisi, lalu isi jabatan dan catatan.

Buka salah satu dummy, misalnya disposisi ke Kasi Pelayanan dengan catatan `Ditindaklanjuti sesuai ketentuan yang berlaku.`

---

### B6. Lihat Surat Keluar, Arsip, Laporan (baca saja)

**Narasi**

> Sekdes juga bisa melihat Surat Keluar, Arsip, dan Laporan, termasuk unduh PDF. Ini untuk memantau, bukan untuk menambah data. Input surat tetap tugas Admin.

Kalau sempat: buka **Laporan**, jelaskan rekap, unduh PDF.

---

### B7. Logout Sekdes

**Aksi:** nama di kanan atas → **Keluar**.

**Narasi**

> Review dan disposisi surat biasa sudah ditunjukkan. Berikutnya saya masuk sebagai Kepala Desa untuk verifikasi surat penting.

---

## BAGIAN C — Demo sebagai Kepala Desa (Kades)

### C1. Login Kades

**Aksi**

1. Username: `kades`
2. Password: `password`
3. Klik **Masuk**

**Narasi**

> Saya masuk sebagai Kepala Desa. Sistem mengarahkan ke Beranda Kepala Desa.

---

### C2. Beranda Kades

**Narasi**

> Beranda Kades lebih ringkas. Fokusnya arahan dan verifikasi, bukan input data.
>
> Kartunya:
>
> - **Disposisi Masuk** — disposisi yang dibuat Kades
> - **Menunggu Verifikasi** — surat penting yang belum Kades setujui
> - **Siap Disposisi** — sudah diverifikasi, menunggu instruksi Kades
> - **Arsip**
>
> Panel perhatian menandai dua pekerjaan: verifikasi surat penting, dan buat disposisi setelah verifikasi.
>
> Ada tren disposisi 6 bulan, status disposisi, daftar disposisi terbaru, dan daftar **Menunggu Arahan Anda**.
>
> Menu kiri sama seperti Sekdes: Beranda, Surat Masuk, Disposisi, Surat Keluar, Arsip, Laporan. Tidak ada Manajemen User, tidak ada tombol Tambah Surat.

---

### C3. Verifikasi surat penting

**Aksi:** klik kartu **Menunggu Verifikasi**, atau buka Surat Masuk yang statusnya **Menunggu verifikasi Kades**.

Pakai dummy seeder (ada sekitar 5 surat penting menunggu), atau surat yang tadi direview Sekdes sebagai **Penting**.

**Narasi**

> Surat ini tingkat penting. Sekdes sudah menelaah, sekarang giliran Kepala Desa memverifikasi. Saya klik **Verifikasi Surat**.

**Aksi:** klik **Verifikasi Surat**.

> Setelah verifikasi, status menjadi **Siap disposisi Kades**. Baru setelah itu tombol **Buat Disposisi** muncul untuk Kades.

---

### C4. Disposisi surat penting

**Aksi:** di detail surat yang baru diverifikasi, klik **Buat Disposisi**.

**Narasi**

> Field **Dari** sekarang Kepala Desa. Saya pilih perangkat yang harus menindaklanjuti, lalu menuliskan arahan.

**Isi dummy disposisi Kades**

| Field | Isi dummy |
| --- | --- |
| Dari | `Kepala Desa` (otomatis) |
| Kepada | `Kasi Pemerintahan` |
| Catatan / Arahan | `Tindaklanjuti bersama Kaur terkait dan konfirmasi ke pengirim.` |

Klik **Kirim Disposisi**.

> Surat penting pun statusnya **Didisposisikan**. Dari sini Admin nanti yang mengarsipkan setelah proses selesai.

---

### C5. Menu Disposisi, Arsip, Laporan

**Narasi**

> Kades dapat melihat seluruh disposisi, arsip, dan laporan. Di laporan, filter periode dan unduh PDF sama seperti peran lain. Yang membedakan: Kades tidak menambah surat dan tidak mengelola user. Tugas utamanya verifikasi dan memberi arahan pada surat penting.

Untuk demo singkat: buka **Laporan** → pilih **Semua waktu** → jelaskan grafik → **Unduh PDF**.

---

### C6. Logout Kades

**Aksi:** nama di kanan atas → **Keluar**.

**Narasi**

> Sesi Kepala Desa selesai. Sistem kembali ke login. Ketiga peran sudah ditunjukkan sesuai tugas masing-masing.

---

## 2. Penutup alur (boleh dibacakan di akhir demo)

**Narasi**

> Ringkasnya: Admin mencatat surat masuk dan surat keluar, serta mengelola user dan arsip. Sekdes menelaah surat draft dan memberi disposisi pada surat biasa. Kades memverifikasi surat penting lalu memberi disposisi. Setelah instruksi tercatat, Admin mengarsipkan. Arsip bisa dicari cepat, dan laporan bisa diunduh PDF.
>
> Data yang tampil saat demo ini sebagian besar dummy dari seeder, ditambah beberapa data baru yang baru saja diinput, supaya alur dari login sampai arsip terlihat utuh.

---

## 3. Data dummy siap pakai (salin saat demo live)

Pakai tabel ini jika diminta “coba input sekarang”. Ganti angka urut jika nomor sudah ada.

### Surat masuk

| No | Nomor | Pengirim | Perihal | Tingkat saran setelah review |
| --- | --- | --- | --- | --- |
| 1 | `474.1/022/IX/2026` | Kecamatan Cimerak | Undangan Rapat Koordinasi Bulanan Kecamatan | Biasa |
| 2 | `471.2/023/IX/2026` | Dinas Sosial Kabupaten Pangandaran | Permohonan Verifikasi Penerima Bantuan Sosial | Penting |
| 3 | `470.3/024/IX/2026` | Ketua RT 03 / RW 05 | Permohonan Izin Penggunaan Balai Desa | Biasa |
| 4 | `472.4/025/IX/2026` | Puskesmas Desa Sindangsari | Monitoring dan Evaluasi Program Stunting | Penting |
| 5 | `473.5/026/IX/2026` | Sdr. Hendra Wijaya (Warga) | Permohonan Informasi Publik terkait APBDes | Biasa |

Tanggal surat: sehari sebelum diterima. Tanggal diterima: tanggal demo.

### Surat keluar

| No | Nomor | Tujuan | Perihal | Status |
| --- | --- | --- | --- | --- |
| 1 | `145/051/IX/2026` | Kecamatan Cimerak | Surat Konfirmasi Kehadiran — Undangan Rapat Koordinasi | Draft |
| 2 | `145/052/IX/2026` | Sdr. Rina Marlina | Surat Keterangan Domisili — Desa Sindangsari | Terkirim |
| 3 | `145/053/IX/2026` | Polsek Cimerak | Surat Pengantar SKCK | Terkirim |
| 4 | `145/054/IX/2026` | Dinas Sosial Kabupaten Pangandaran | Surat Balasan — Permohonan Verifikasi Penerima Bansos | Draft |
| 5 | `145/055/IX/2026` | Karang Taruna Desa Sindangsari | Surat Rekomendasi Kegiatan Masyarakat | Terkirim |

### Disposisi

| Dari | Kepada | Catatan |
| --- | --- | --- |
| Sekretaris Desa | Kaur Umum | Hadiri kegiatan dan sampaikan laporan singkat. |
| Sekretaris Desa | Kasi Pelayanan | Ditindaklanjuti sesuai ketentuan yang berlaku. |
| Kepala Desa | Kasi Pemerintahan | Tindaklanjuti bersama Kaur terkait dan konfirmasi ke pengirim. |
| Kepala Desa | Kaur Keuangan | Dipelajari dan laporkan hasilnya kepada Sekretaris Desa. |

### User tambahan (Admin saja)

| Nama | Username | Email | Password | Peran |
| --- | --- | --- | --- | --- |
| Operator Desa | `operator` | operator@desa.go.id | `password` | Admin |
| Staf TU | `staf.tu` | staf.tu@desa.go.id | `password` | Admin |

---

## 4. Urutan klik yang disarankan (checklist 8–12 menit)

1. Login `admin` / `password`
2. Jelaskan Beranda Admin (kartu + Perlu Perhatian)
3. Tambah 1 surat masuk dummy
4. Tambah 1 surat keluar dummy
5. Buka Arsip (cari prefix nomor) dan Laporan (unduh PDF)
6. Buka Manajemen User (tunjukkan 3 akun seeder)
7. Logout
8. Login `sekdes` / `password` → jelaskan Beranda Sekdes
9. Review 1 surat **Biasa** → buat disposisi
10. Review 1 surat **Penting** (biarkan menunggu Kades)
11. Logout
12. Login `kades` / `password` → jelaskan Beranda Kades
13. Verifikasi surat penting → buat disposisi
14. Logout

Jika waktu tinggal 5 menit: langkah 1–4, 8–10, dan 12–13 saja.

---

## 5. Hak akses ringkas (kalau ditanya penguji)

| Fitur | Admin | Sekdes | Kades |
| --- | --- | --- | --- |
| Login / logout / dashboard | Ya | Ya | Ya |
| Tambah / edit / hapus surat | Ya | Tidak | Tidak |
| Lihat surat masuk & keluar | Ya | Ya | Ya |
| Review tingkat surat | Tidak | Ya | Tidak |
| Verifikasi surat penting | Tidak | Tidak | Ya |
| Buat disposisi | Tidak | Ya (surat biasa) | Ya (surat penting, setelah verifikasi) |
| Arsipkan / batal arsip | Ya | Tidak | Tidak |
| Lihat arsip & cari nomor | Ya | Ya | Ya |
| Laporan + unduh PDF | Ya | Ya | Ya |
| Manajemen user | Ya | Tidak | Tidak |

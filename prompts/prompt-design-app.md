# 📄 Prompt Desain Dashboard Aplikasi Arsip Surat Desa

---

## 🎯 1. Konteks

Anda adalah seorang **Senior Product Designer dan Frontend Engineer**.

Rancang sebuah **dashboard aplikasi web untuk manajemen arsip surat di kantor desa**.

### Target Pengguna:

- Pegawai kantor desa
- Tidak terbiasa dengan teknologi
- Membutuhkan sistem sederhana dan mudah dipahami

### Prinsip Desain:

- Sederhana dan intuitif
- Minim langkah (tidak berbelit)
- Label jelas (hindari istilah teknis)
- Warna nyaman dilihat (gaya aplikasi pemerintahan)
- Responsif dan ringan

---

## 🔐 2. Autentikasi (Login)

### Fitur:

- Login menggunakan **username dan password**
- Show / Hide password
- Opsi **“Ingat Saya”**
- Validasi error jelas (contoh: “Password salah”)
- Tidak ada pilihan role di UI (ditentukan backend)

### Role:

- Admin
- Sekretaris Desa (Sekdes)
- Kepala Desa (Kades)

---

## 🧭 3. Layout Utama

### Struktur:

- Sidebar (kiri) → navigasi
- Header (atas):
    - Avatar user
    - Dropdown (Profil, Logout)
- Main Content

### Behavior:

- Sidebar bisa collapse
- Menu aktif jelas
- Gunakan ikon + teks

---

## 📊 4. Dashboard

`

### Ringkasan:

- Total Surat Masuk
- Total Surat Keluar
- Total Arsip

### Aktivitas:

- Surat masuk terbaru
- Surat keluar terbaru

> Hindari tampilan terlalu padat

---

## 📁 5. Navigasi Berdasarkan Role

### 🛠 Admin:

- Dashboard
- Surat Masuk
- Disposisi Surat
- Surat Keluar
- Arsip Surat
- Laporan
- Manajemen User

### 🧾 Sekdes & Kades:

- Dashboard
- Surat Masuk
- Disposisi Surat
- Surat Keluar
- Arsip Surat
- Laporan

> Catatan: Perbedaan role terletak pada **aksi (permission)**, bukan menu

---

## 📥 6. Modul Surat Masuk

### 6.1 Tabel Surat Masuk

#### Kolom:

- No
- Nomor Surat
- Tanggal Surat
- Tanggal Diterima
- Pengirim
- Perihal
- Status: Baru / Diproses / Selesai
- Disposisi: Belum / Sudah
- Aksi: Detail / Edit / Hapus

#### Fitur:

- Search (nomor surat, pengirim, perihal)
- Filter (tanggal, status)
- Sorting (tanggal, nomor)
- Pagination

---

### 6.2 Form Tambah Surat

#### Field:

- Nomor Surat
- Tanggal Surat
- Tanggal Diterima
- Pengirim
- Perihal
- Upload File (PDF / gambar)
- Catatan (opsional)

---

### 6.3 Preview Surat

- Preview dokumen (PDF / gambar)
- Nama file
- Ukuran file

> Tujuan: validasi visual sebelum simpan

---

### 6.4 Detail Surat

#### Informasi:

- Data lengkap surat
- Preview file
- Riwayat disposisi

#### Aksi:

- Edit
- Hapus
- Buat Disposisi

---

### 6.5 Flow Surat Masuk

1. Input surat → status **Baru**
2. Pilihan:
    - Buat Disposisi
    - Arsipkan
3. Notifikasi sukses

---

## 📤 7. Modul Surat Keluar

### 🎯 Tujuan

Mengelola dan mengarsipkan surat keluar dalam bentuk dokumen resmi yang telah dicetak, ditandatangani, dan di-scan.

---

## 📋 7.1 Tabel Surat Keluar

- Nomor Surat
- Tanggal Surat
- Tujuan
- Perihal
- Status:
    - Draft (belum diupload)
    - Selesai (sudah diupload)
- File:
    - Ada / Tidak ada
- Aksi:
    - Detail
    - Edit
    - Hapus

---

## ➕ 7.2 Form Surat Keluar

### Field:

- Nomor Surat
- Tanggal Surat
- Tujuan
- Perihal
- Upload File Surat:
    - Format: PDF / gambar (hasil scan)
- Catatan (opsional)

---

## 👁 7.3 Preview Surat

Setelah upload file:

- Preview dokumen:
    - PDF viewer / image preview
- Nama file
- Ukuran file

### Tujuan:

- Memastikan file scan benar
- Menghindari kesalahan upload

---

## 🔄 7.4 Flow Surat Keluar

1. User mengisi data surat
2. Upload hasil scan surat
3. Status otomatis:
    - Jika belum upload → **Draft**
    - Jika sudah upload → **Selesai**
4. Notifikasi:
    - "Surat berhasil disimpan"

---

## 📄 7.5 Detail Surat Keluar

### Tampilkan:

- Informasi lengkap surat
- Preview file scan

### Aksi:

- Edit data
- Ganti file
- Hapus data

---

#### 📌 Catatan UX Penting

- Upload file adalah **bagian utama (wajib)**
- Gunakan validasi:
    - Maksimal ukuran file
    - Format file
- Tampilkan indikator:
    - "Belum upload" vs "Sudah upload"

## 📌 8. Modul Disposisi

### Tujuan:

Mengelola instruksi antar jabatan

---

### 8.1 Tabel Disposisi

- Nomor Surat
- Pengirim
- Penerima
- Catatan
- Tanggal
- Status: Menunggu / Diproses / Selesai

---

### 8.2 Form Disposisi

- Pilih surat
- Tujuan
- Catatan
- Tanggal

---

### 8.3 Flow Disposisi

1. Sekdes membuat disposisi
2. Dikirim ke Kades
3. Kades:
    - Setujui
    - Beri arahan
4. Status diperbarui

---

## 📦 9. Modul Arsip

### Tabel:

- Nomor Surat
- Jenis (Masuk / Keluar)
- Tanggal
- Status
- Aksi:
    - Lihat
    - Unduh

---

## 📊 10. Modul Laporan

### Fitur:

- Filter tanggal
- Rekap:
    - Surat masuk
    - Surat keluar
- Export:
    - PDF
    - Excel

---

## 📌 11. Aturan UX

- Gunakan Bahasa Indonesia sederhana
- Hindari istilah teknis
- Gunakan label jelas:
    - Tambah Surat
    - Lihat Detail
    - Unduh
- Konfirmasi sebelum hapus

### Tabel wajib:

- Search
- Filter
- Pagination

---

## 🎨 12. Visual Design

### Warna:

- Primary: Biru
- Secondary: Abu / putih

### Style:

- Clean & modern
- Rounded
- Shadow ringan

### Typography:

- Inter / Poppins

### Icon:

- Lucide

---

## ⚙️ 13. Output yang Diharapkan

### 🎨 13.1 Desain UI (High Fidelity)

Buat desain lengkap untuk halaman:

- Halaman Login
- Dashboard
- Surat Masuk:
    - Tabel
    - Form Tambah
    - Detail + Preview
- Surat Keluar:
    - Tabel
    - Form Upload Scan
    - Detail + Preview
- Disposisi Surat:
    - Tabel
    - Form Disposisi
- Arsip Surat
- Laporan

---

### 🧩 13.2 Struktur Komponen

Definisikan komponen reusable berikut:

- Sidebar Navigation
- Header (Avatar + Dropdown)
- Card Statistik
- Table Data (dengan search, filter, pagination)
- Form Input (text, date, upload, textarea)
- Modal / Dialog (konfirmasi, detail)
- File Preview (PDF / Image Viewer)
- Status Badge (Draft, Selesai, Diproses)

---

### 🔄 13.3 Alur UX (User Flow)

Jelaskan flow secara step-by-step:

#### Surat Masuk:

- Tambah data → Upload → Preview → Simpan → Disposisi / Arsip

#### Surat Keluar:

- Input data → Upload scan → Preview → Simpan

#### Disposisi:

- Pilih surat → Kirim ke user → Beri catatan → Update status

#### Arsip:

- Surat selesai → Masuk ke arsip → Bisa dilihat / diunduh

---

### 🔐 13.4 Role & Permission Behavior

Tampilkan perbedaan behavior tiap role:

- Admin:
    - Full akses (CRUD + user management)
- Sekdes:
    - Input surat
    - Membuat disposisi
- Kades:
    - Melihat surat
    - Memberi persetujuan / arahan

---

### 📱 13.5 Responsiveness

- Desktop (utama)
- Tablet (opsional)
- Mobile (minimal tetap usable)

---

### 📌 13.6 Detail Interaksi UI

- Loading state (skeleton / spinner)
- Empty state (tidak ada data)
- Error state (gagal load / upload)
- Success notification (toast)

---

### 📂 13.7 Struktur Halaman (Information Architecture)

Jelaskan struktur halaman per menu:

Contoh:

- Surat Masuk:
    - List
    - Detail
    - Tambah
- Surat Keluar:
    - List
    - Detail
    - Tambah

---

### 🎯 13.8 Output Akhir

Hasil akhir harus berupa:

- Desain UI lengkap (bukan hanya dashboard)
- Struktur komponen yang jelas
- Alur user yang bisa langsung diimplementasikan
- Konsistensi antar halaman

## 🚀 14. Insight Sistem

Sistem ini berbasis **workflow**, bukan sekadar CRUD.

### Fokus:

- Alur jelas
- Mudah digunakan
- Minim kebingungan user

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

> Tujuan: validasi sebelum simpan

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

Mengelola arsip surat keluar dalam bentuk dokumen resmi hasil scan.

---

### 7.1 Tabel Surat Keluar

- Nomor Surat
- Tanggal Surat
- Tujuan
- Perihal
- Status:
    - Draft
    - Selesai
- File:
    - Ada / Tidak ada
- Aksi:
    - Detail
    - Edit
    - Hapus

---

### 7.2 Form Surat Keluar

#### Field:

- Nomor Surat
- Tanggal Surat
- Tujuan
- Perihal
- Upload File (PDF / gambar hasil scan)
- Catatan (opsional)

---

### 7.3 Preview Surat

- Preview dokumen (PDF / gambar)
- Nama file
- Ukuran file

---

### 7.4 Flow Surat Keluar

1. Input data surat
2. Upload file scan
3. Status:
    - Tanpa file → **Draft**
    - Dengan file → **Selesai**
4. Notifikasi sukses

---

### 7.5 Detail Surat Keluar

#### Informasi:

- Data lengkap surat
- Preview file scan

#### Aksi:

- Edit
- Ganti file
- Hapus

---

### 📌 Catatan UX:

- Upload file adalah **wajib**
- Validasi ukuran & format file
- Gunakan indikator status (Draft / Selesai)

---

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

### 13.1 Desain UI

- Login
- Dashboard
- Semua modul (List, Form, Detail, Preview)

---

### 13.2 Komponen

- Sidebar
- Header
- Card
- Table
- Form
- Modal
- Preview File
- Status Badge

---

### 13.3 User Flow

- Surat Masuk
- Surat Keluar
- Disposisi
- Arsip

---

### 13.4 Role Behavior

- Admin: full akses
- Sekdes: input & disposisi
- Kades: approval & arahan

---

### 13.5 State UI

- Loading
- Empty
- Error
- Success

---

## 🚀 14. Insight Sistem

Sistem berbasis **workflow**.

### Fokus:

- Alur jelas
- Mudah digunakan
- Minim kebingungan user

---

## 🧱 15. Teknologi & Design System

### ⚙️ Tech Stack

Gunakan teknologi berikut dalam implementasi:

- Framework: **Next.js (React)**
- State & Data Fetching: **React Query (TanStack Query)**
- Table: **React Table (TanStack Table)**
- Styling: **Tailwind CSS**
- Component Library: **shadcn/ui**

---

### 🧩 Implementasi Teknis

#### Data Fetching (React Query)

- Gunakan query untuk:
    - List data (surat masuk, keluar, disposisi, arsip)
- Gunakan mutation untuk:
    - Tambah data
    - Edit data
    - Hapus data
- Gunakan loading & error state dari React Query

---

#### Table (React Table)

Tabel harus mendukung:

- Sorting
- Filtering
- Pagination
- Column visibility (opsional)
- Custom cell (status badge, action button)

---

#### Form Handling

- Gunakan validasi form (client-side)
- Tampilkan error message per field
- Gunakan komponen input dari shadcn/ui

---

### 🎨 Design System (shadcn/ui Style)

Gunakan gaya desain seperti **shadcn/ui**:

#### Karakteristik:

- Clean & modern
- Minimalis
- Spacing lega
- Tidak terlalu banyak warna mencolok

---

### 🎯 Prinsip UI untuk Target User

Karena target adalah pegawai desa:

- Gunakan ukuran font yang cukup besar
- Hindari terlalu banyak warna
- Gunakan kontras yang jelas
- Gunakan tombol yang mudah dikenali
- Hindari interaksi yang kompleks

---

### 🧩 Komponen UI Utama

Gunakan komponen dari shadcn/ui seperti:

- Button
- Input
- Select
- Table
- Dialog
- Dropdown Menu
- Badge (untuk status)
- Toast (notifikasi)

---

### 🎨 Warna & Nuansa

- Dominan: Biru (profesional & pemerintahan)
- Netral: Putih & abu-abu
- Status:
    - Draft → Abu-abu
    - Diproses → Kuning
    - Selesai → Hijau

---

### 📱 Responsiveness

- Fokus utama: Desktop
- Tetap usable di:
    - Tablet
    - Mobile (stack layout, bukan kompleks)

---

---

## ✅ 16. Functional Requirement (Wajib Berfungsi)

Semua fitur yang dirancang **harus fully functional**, bukan hanya tampilan UI.

---

### 🎯 Kriteria Utama

- Tidak boleh menggunakan data dummy statis
- Semua data harus:
    - Bisa diambil (fetch)
    - Bisa ditambahkan
    - Bisa diubah
    - Bisa dihapus
- Semua interaksi harus memiliki efek nyata pada data

---

### 🔄 Integrasi Data

Gunakan pendekatan berikut:

- Data diambil dari API (mock API / real API)
- Gunakan React Query untuk:
    - Fetch data (query)
    - Mutasi data (create, update, delete)
- Setiap aksi harus langsung merefresh data (invalidate query)

---

### 📥 Surat Masuk

- Tambah surat → masuk ke tabel
- Edit → data berubah
- Hapus → data hilang
- Upload file → bisa dipreview & tersimpan
- Disposisi → mengubah status

---

### 📤 Surat Keluar

- Tambah data → muncul di tabel
- Upload file scan → tersimpan & bisa dipreview
- Status otomatis berubah sesuai kondisi file
- Edit & hapus berfungsi

---

### 📌 Disposisi

- Bisa membuat disposisi
- Data muncul di tabel
- Status berubah sesuai aksi
- Relasi dengan surat harus valid

---

### 📦 Arsip

- Surat yang selesai diproses masuk ke arsip
- Data bisa dilihat & diunduh

---

### 📊 Laporan

- Filter data berdasarkan tanggal
- Data sesuai dengan kondisi real
- Export menghasilkan file (mock / real)

---

### 🔐 Autentikasi

- Login benar → masuk ke dashboard
- Login salah → tampil error
- Role menentukan akses menu & aksi

---

### ⚠️ Validasi & Error Handling

- Semua form wajib validasi:
    - Field wajib diisi
    - Format file sesuai
- Tampilkan error jika gagal:
    - Upload gagal
    - Fetch gagal
- Gunakan toast / alert untuk feedback user

---

### 🔄 State UI

Semua halaman harus memiliki:

- Loading state
- Empty state
- Error state
- Success state

---

### 🧪 Catatan Tambahan

- Jika backend belum tersedia:
    - Gunakan mock API (JSON Server / local API)
- Struktur harus siap dihubungkan ke backend real

---

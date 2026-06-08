<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Laporan Statistik Surat</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: DejaVu Sans, Arial, sans-serif;
            font-size: 11px;
            color: #1f2937;
            line-height: 1.45;
            margin: 0;
            padding: 24px;
        }
        .header {
            text-align: center;
            margin-bottom: 22px;
            padding-bottom: 14px;
            border-bottom: 2px solid #2d7a86;
        }
        .header h1 {
            margin: 0 0 4px;
            font-size: 18px;
            color: #1e4f57;
        }
        .header p {
            margin: 2px 0;
            color: #4b5563;
        }
        .meta {
            width: 100%;
            margin-bottom: 18px;
        }
        .meta td {
            padding: 3px 0;
            vertical-align: top;
        }
        .meta td:first-child {
            width: 120px;
            font-weight: bold;
            color: #374151;
        }
        h2 {
            font-size: 13px;
            color: #1e4f57;
            margin: 18px 0 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #d1d5db;
        }
        table.data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        table.data th,
        table.data td {
            border: 1px solid #d1d5db;
            padding: 7px 8px;
            text-align: left;
        }
        table.data th {
            background: #e8f4f6;
            font-weight: bold;
            color: #1e4f57;
        }
        table.data td.num {
            text-align: right;
            font-weight: bold;
        }
        .summary-grid {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 0;
            margin: 0 -8px 6px;
        }
        .summary-grid td {
            width: 20%;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 10px;
            vertical-align: top;
            background: #f9fafb;
        }
        .summary-grid .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #6b7280;
            margin-bottom: 4px;
        }
        .summary-grid .value {
            font-size: 20px;
            font-weight: bold;
            color: #111827;
        }
        .summary-grid .hint {
            font-size: 9px;
            color: #6b7280;
            margin-top: 3px;
        }
        .footer {
            margin-top: 24px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 9px;
            color: #9ca3af;
            text-align: center;
        }
        .two-col {
            width: 100%;
        }
        .two-col td {
            width: 50%;
            vertical-align: top;
            padding-right: 10px;
        }
        .two-col td:last-child {
            padding-right: 0;
            padding-left: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Statistik Surat</h1>
        <p>Sistem E-Arsip Desa</p>
    </div>

    <table class="meta">
        <tr>
            <td>Periode</td>
            <td>{{ $range_label }}</td>
        </tr>
        <tr>
            <td>Dicetak pada</td>
            <td>{{ $generated_at }} WIB</td>
        </tr>
        <tr>
            <td>Dicetak oleh</td>
            <td>{{ $generated_by }}</td>
        </tr>
    </table>

    <h2>Ringkasan</h2>
    <table class="summary-grid">
        <tr>
            <td>
                <div class="label">Surat Masuk</div>
                <div class="value">{{ $summary['surat_masuk'] }}</div>
                <div class="hint">{{ $summary['surat_masuk_aktif'] }} aktif</div>
            </td>
            <td>
                <div class="label">Menunggu Review</div>
                <div class="value">{{ $summary['surat_masuk_belum_diproses'] }}</div>
                <div class="hint">{{ $summary['surat_masuk_tanpa_disposisi'] }} tanpa disposisi</div>
            </td>
            <td>
                <div class="label">Surat Keluar</div>
                <div class="value">{{ $summary['surat_keluar'] }}</div>
                <div class="hint">{{ $summary['surat_keluar_draft'] }} draft</div>
            </td>
            <td>
                <div class="label">Arsip</div>
                <div class="value">{{ $summary['arsip'] }}</div>
                <div class="hint">Masuk &amp; keluar</div>
            </td>
            <td>
                <div class="label">Disposisi</div>
                <div class="value">{{ $summary['disposisi'] }}</div>
                <div class="hint">{{ $summary['surat_penting_menunggu_kades'] ?? 0 }} penting menunggu Kades</div>
            </td>
        </tr>
    </table>

    <h2>Tren Surat (6 Bulan Terakhir)</h2>
    <table class="data">
        <thead>
            <tr>
                <th>Bulan</th>
                <th class="num">Surat Masuk</th>
                <th class="num">Surat Keluar</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($monthly_trend as $row)
                <tr>
                    <td>{{ $row['label'] }}</td>
                    <td class="num">{{ $row['masuk'] }}</td>
                    <td class="num">{{ $row['keluar'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="two-col">
        <tr>
            <td>
                <h2>Status Surat Masuk</h2>
                <table class="data">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th class="num">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($surat_masuk_status as $row)
                            <tr>
                                <td>{{ $row['label'] }}</td>
                                <td class="num">{{ $row['total'] }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </td>
            <td>
                <h2>Status Surat Keluar</h2>
                <table class="data">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th class="num">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($surat_keluar_status as $row)
                            <tr>
                                <td>{{ $row['label'] }}</td>
                                <td class="num">{{ $row['total'] }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </td>
        </tr>
    </table>

    <h2>Tingkat Surat</h2>
    <table class="data" style="width: 50%;">
        <thead>
            <tr>
                <th>Tingkat</th>
                <th class="num">Jumlah</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tingkat_surat as $row)
                <tr>
                    <td>{{ $row['label'] }}</td>
                    <td class="num">{{ $row['total'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="two-col">
        <tr>
            <td>
                <h2>Pengirim Terbanyak</h2>
                <table class="data">
                    <thead>
                        <tr>
                            <th>Pengirim</th>
                            <th class="num">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($top_pengirim as $row)
                            <tr>
                                <td>{{ $row['pengirim'] }}</td>
                                <td class="num">{{ $row['total'] }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="2">Tidak ada data.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </td>
            <td>
                <h2>Disposisi per Tujuan</h2>
                <table class="data">
                    <thead>
                        <tr>
                            <th>Tujuan</th>
                            <th class="num">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($disposisi_by_kepada as $row)
                            <tr>
                                <td>{{ $row['kepada'] }}</td>
                                <td class="num">{{ $row['total'] }}</td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="2">Tidak ada data.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </td>
        </tr>
    </table>

    <div class="footer">
        Dokumen ini digenerate otomatis oleh Sistem E-Arsip Desa.
    </div>
</body>
</html>

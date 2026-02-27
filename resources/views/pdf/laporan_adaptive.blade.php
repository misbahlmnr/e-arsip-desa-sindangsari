<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Adaptive Learning</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>Laporan Adaptive Learning</h1>
    <table>
        <thead>
            <tr>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
                <th>Skor Aktual</th>
                <th>Min Score</th>
                <th>Kategori Rekomendasi</th>
            </tr>
        </thead>
        <tbody>
            @foreach($laporan as $item)
            <tr>
                <td>{{ $item['siswa']->name ?? '-' }}</td>
                <td>{{ $item['kelas']->nama ?? $item['siswa']->siswaProfile->kelas->nama ?? '-' }}</td>
                <td>{{ $item['mapel']->nama ?? '-' }}</td>
                <td>{{ $item['skor_aktual'] ?? '-' }}</td>
                <td>{{ $item['min_score'] ?? '-' }}</td>
                <td>{{ $item['kategori_rekomendasi'] ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

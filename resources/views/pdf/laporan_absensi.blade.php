<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Absensi</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h1 { text-align: center; }
    </style>
</head>
<body>
    <h1>Laporan Absensi</h1>
    <table>
        <thead>
            <tr>
                <th>Nama Siswa</th>
                <th>Kelas</th>
                <th>Total</th>
                <th>Hadir</th>
                <th>Izin</th>
                <th>Sakit</th>
                <th>Alpa</th>
            </tr>
        </thead>
        <tbody>
            @foreach($laporan as $item)
            <tr>
                <td>{{ $item['siswa']->name ?? '-' }}</td>
                <td>{{ $item['siswa']->siswaProfile->kelas->nama ?? '-' }}</td>
                <td>{{ $item['total'] ?? '-' }}</td>
                <td>{{ $item['hadir'] ?? '-' }}</td>
                <td>{{ $item['izin'] ?? '-' }}</td>
                <td>{{ $item['sakit'] ?? '-' }}</td>
                <td>{{ $item['alpa'] ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

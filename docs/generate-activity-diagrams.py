#!/usr/bin/env python3
"""Generate UML activity diagrams (draw.io) for ArsipDesa use cases."""

from __future__ import annotations

import html
from dataclasses import dataclass, field
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent / "activity-diagrams"

STYLE_START = "ellipse;fillColor=#000000;strokeColor=#000000;html=1;"
STYLE_ACTION = "rounded=1;fillColor=#f5f5f5;strokeColor=#000000;html=1;whiteSpace=wrap;"
STYLE_DECISION = "rhombus;fillColor=#f5f5f5;strokeColor=#000000;html=1;whiteSpace=wrap;"
STYLE_END = "ellipse;shape=endState;fillColor=#000000;strokeColor=#CC0000;strokeWidth=3;html=1;"
STYLE_EDGE = "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=#000000;"

LANE_W = 260
POOL_X = 40
POOL_Y = 55
ROW_H = 78
ACTION_W = 210
ACTION_H = 50
DECISION_W = 170
DECISION_H = 80
START_SIZE = 28


@dataclass
class Node:
    id: str
    lane: str  # "user" | "sistem"
    row: int
    kind: str  # start | action | decision | end
    label: str = ""


@dataclass
class Edge:
    source: str
    target: str
    label: str = ""


@dataclass
class Diagram:
    filename: str
    title: str
    user_lane_label: str
    nodes: list[Node] = field(default_factory=list)
    edges: list[Edge] = field(default_factory=list)


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def node_geometry(node: Node) -> tuple[int, int, int, int]:
    y = 45 + node.row * ROW_H
    if node.kind == "start":
        x = 115
        return x, y, START_SIZE, START_SIZE
    if node.kind == "end":
        x = 110
        return x, y, 36, 36
    if node.kind == "decision":
        x = 40
        return x, y - 10, DECISION_W, DECISION_H
    x = 20
    return x, y, ACTION_W, ACTION_H


def node_style(node: Node) -> str:
    return {
        "start": STYLE_START,
        "action": STYLE_ACTION,
        "decision": STYLE_DECISION,
        "end": STYLE_END,
    }[node.kind]


def pool_height(nodes: list[Node]) -> int:
    max_row = max(n.row for n in nodes)
    return 80 + (max_row + 1) * ROW_H


DIAGRAMS: list[Diagram] = [
    Diagram(
        filename="uc01-login.drawio",
        title="Activity Diagram UC01 — Login",
        user_lane_label="User (Admin, Sekdes, Kades)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Membuka halaman login"),
            Node("u2", "user", 2, "action", "Memasukkan username dan password"),
            Node("s1", "sistem", 3, "action", "Memverifikasi kredensial pengguna"),
            Node("d1", "sistem", 4, "decision", "Data valid?"),
            Node("s2", "sistem", 5, "action", "Membuat sesi pengguna"),
            Node("s3", "sistem", 6, "action", "Menampilkan dashboard sesuai peran"),
            Node("s4", "sistem", 8, "action", "Menampilkan pesan gagal login"),
            Node("end_ok", "sistem", 7, "end"),
            Node("end_fail", "sistem", 9, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "s1"),
            Edge("s1", "d1"),
            Edge("d1", "s2", "Success"),
            Edge("s2", "s3"),
            Edge("s3", "end_ok"),
            Edge("d1", "s4", "Gagal"),
            Edge("s4", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc02-kelola-surat.drawio",
        title="Activity Diagram UC02 — Mengelola Surat Masuk & Keluar",
        user_lane_label="User (Admin)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Mengakses menu Surat Masuk / Keluar"),
            Node("s1", "sistem", 3, "action", "Menampilkan daftar surat"),
            Node("u3", "user", 4, "action", "Mengelola data surat (tambah, ubah, hapus, lihat)"),
            Node("u4", "user", 5, "action", "Mengisi atau memperbarui form data surat"),
            Node("d1", "sistem", 6, "decision", "Memvalidasi data dan file?"),
            Node("s2", "sistem", 7, "action", "Menyimpan data ke database"),
            Node("s3", "sistem", 8, "action", "Menampilkan pesan berhasil"),
            Node("s4", "sistem", 10, "action", "Menampilkan pesan error validasi"),
            Node("end_ok", "sistem", 9, "end"),
            Node("end_fail", "sistem", 11, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "s1"),
            Edge("s1", "u3"),
            Edge("u3", "u4"),
            Edge("u4", "d1"),
            Edge("d1", "s2", "Success"),
            Edge("s2", "s3"),
            Edge("s3", "end_ok"),
            Edge("d1", "s4", "Gagal"),
            Edge("s4", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc03-kelola-arsip.drawio",
        title="Activity Diagram UC03 — Mengelola Arsip Surat",
        user_lane_label="User (Admin)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Membuka detail surat masuk / keluar"),
            Node("u3", "user", 3, "action", "Memilih arsipkan atau batal arsip"),
            Node("d1", "sistem", 4, "decision", "Syarat arsip terpenuhi?"),
            Node("s1", "sistem", 5, "action", "Memperbarui status surat menjadi diarsipkan"),
            Node("s2", "sistem", 6, "action", "Menampilkan pesan berhasil"),
            Node("s3", "sistem", 8, "action", "Menampilkan pesan surat belum didisposisikan"),
            Node("end_ok", "sistem", 7, "end"),
            Node("end_fail", "sistem", 9, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "u3"),
            Edge("u3", "d1"),
            Edge("d1", "s1", "Success"),
            Edge("s1", "s2"),
            Edge("s2", "end_ok"),
            Edge("d1", "s3", "Gagal"),
            Edge("s3", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc04-kelola-user.drawio",
        title="Activity Diagram UC04 — Mengelola User",
        user_lane_label="User (Admin)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Mengakses menu Manajemen User"),
            Node("s1", "sistem", 3, "action", "Menampilkan daftar pengguna"),
            Node("u3", "user", 4, "action", "Menambah, mengubah, atau menghapus pengguna"),
            Node("u4", "user", 5, "action", "Mengisi atau memperbarui data pengguna"),
            Node("d1", "sistem", 6, "decision", "Data valid dan bukan akun sendiri?"),
            Node("s2", "sistem", 7, "action", "Menyimpan perubahan data pengguna"),
            Node("s3", "sistem", 8, "action", "Menampilkan pesan berhasil"),
            Node("s4", "sistem", 10, "action", "Menampilkan pesan error"),
            Node("end_ok", "sistem", 9, "end"),
            Node("end_fail", "sistem", 11, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "s1"),
            Edge("s1", "u3"),
            Edge("u3", "u4"),
            Edge("u4", "d1"),
            Edge("d1", "s2", "Success"),
            Edge("s2", "s3"),
            Edge("s3", "end_ok"),
            Edge("d1", "s4", "Gagal"),
            Edge("s4", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc05-review-surat.drawio",
        title="Activity Diagram UC05 — Review Surat Masuk",
        user_lane_label="User (Sekdes)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Mengakses menu Surat Masuk"),
            Node("u3", "user", 3, "action", "Memilih surat berstatus draft"),
            Node("u4", "user", 4, "action", "Menentukan tingkat surat dan konfirmasi review"),
            Node("d1", "sistem", 5, "decision", "Status draft dan belum direview?"),
            Node("s1", "sistem", 6, "action", "Memperbarui tingkat dan status terverifikasi"),
            Node("s2", "sistem", 7, "action", "Menampilkan pesan berhasil"),
            Node("s3", "sistem", 8, "action", "Menampilkan pesan surat tidak dapat direview"),
            Node("end_ok", "sistem", 9, "end"),
            Node("end_fail", "sistem", 10, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "u3"),
            Edge("u3", "u4"),
            Edge("u4", "d1"),
            Edge("d1", "s1", "Success"),
            Edge("s1", "s2"),
            Edge("s2", "end_ok"),
            Edge("d1", "s3", "Gagal"),
            Edge("s3", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc06-verifikasi-surat.drawio",
        title="Activity Diagram UC06 — Verifikasi Surat Masuk",
        user_lane_label="User (Kades)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Mengakses menu Surat Masuk"),
            Node("u3", "user", 3, "action", "Memilih surat penting yang menunggu verifikasi"),
            Node("u4", "user", 4, "action", "Meninjau surat dan konfirmasi verifikasi"),
            Node("d1", "sistem", 5, "decision", "Surat penting dan sudah direview Sekdes?"),
            Node("s1", "sistem", 6, "action", "Mencatat verifikasi Kepala Desa"),
            Node("s2", "sistem", 7, "action", "Menampilkan pesan berhasil"),
            Node("s3", "sistem", 8, "action", "Menampilkan pesan verifikasi ditolak"),
            Node("end_ok", "sistem", 9, "end"),
            Node("end_fail", "sistem", 10, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "u3"),
            Edge("u3", "u4"),
            Edge("u4", "d1"),
            Edge("d1", "s1", "Success"),
            Edge("s1", "s2"),
            Edge("s2", "end_ok"),
            Edge("d1", "s3", "Gagal"),
            Edge("s3", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc07-disposisi.drawio",
        title="Activity Diagram UC07 — Pemberian Disposisi",
        user_lane_label="User (Sekdes, Kades)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Mengakses menu Disposisi / detail surat"),
            Node("s1", "sistem", 3, "action", "Menampilkan surat yang memenuhi syarat disposisi"),
            Node("u3", "user", 4, "action", "Memilih jabatan tujuan dan mengisi catatan"),
            Node("d1", "sistem", 5, "decision", "Syarat disposisi terpenuhi?"),
            Node("s2", "sistem", 6, "action", "Menyimpan disposisi dan memperbarui status didisposisikan"),
            Node("s3", "sistem", 7, "action", "Menampilkan pesan berhasil"),
            Node("s4", "sistem", 8, "action", "Menampilkan pesan syarat belum terpenuhi"),
            Node("end_ok", "sistem", 9, "end"),
            Node("end_fail", "sistem", 10, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "s1"),
            Edge("s1", "u3"),
            Edge("u3", "d1"),
            Edge("d1", "s2", "Success"),
            Edge("s2", "s3"),
            Edge("s3", "end_ok"),
            Edge("d1", "s4", "Gagal"),
            Edge("s4", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc08-pencarian-arsip.drawio",
        title="Activity Diagram UC08 — Pencarian Arsip Surat",
        user_lane_label="User (Admin, Sekdes, Kades)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Mengakses menu Arsip Surat"),
            Node("u3", "user", 3, "action", "Memasukkan prefix nomor dan filter jenis / rentang waktu"),
            Node("s1", "sistem", 4, "action", "Melakukan pencarian dengan algoritma Binary Search"),
            Node("d1", "sistem", 5, "decision", "Data ditemukan?"),
            Node("s2", "sistem", 6, "action", "Menampilkan daftar arsip hasil pencarian"),
            Node("u4", "user", 7, "action", "Membuka detail arsip surat"),
            Node("s3", "sistem", 8, "action", "Menampilkan daftar kosong / tidak ditemukan"),
            Node("end_ok", "sistem", 9, "end"),
            Node("end_fail", "sistem", 10, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "u3"),
            Edge("u3", "s1"),
            Edge("s1", "d1"),
            Edge("d1", "s2", "Success"),
            Edge("s2", "u4"),
            Edge("u4", "end_ok"),
            Edge("d1", "s3", "Gagal"),
            Edge("s3", "end_fail"),
        ],
    ),
    Diagram(
        filename="uc09-laporan.drawio",
        title="Activity Diagram UC09 — Rekapitulasi & Laporan Arsip Surat",
        user_lane_label="User (Admin, Sekdes, Kades)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Berhasil login"),
            Node("u2", "user", 2, "action", "Mengakses menu Laporan"),
            Node("u3", "user", 3, "action", "Memilih rentang waktu laporan"),
            Node("s1", "sistem", 4, "action", "Menampilkan statistik dan grafik rekapitulasi"),
            Node("d1", "user", 5, "decision", "Export PDF?"),
            Node("s2", "sistem", 6, "action", "Menghasilkan dan mengunduh laporan PDF"),
            Node("end_pdf", "sistem", 7, "end"),
            Node("end_view", "user", 6, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "u2"),
            Edge("u2", "u3"),
            Edge("u3", "s1"),
            Edge("s1", "d1"),
            Edge("d1", "s2", "Ya"),
            Edge("s2", "end_pdf"),
            Edge("d1", "end_view", "Tidak"),
        ],
    ),
    Diagram(
        filename="uc10-logout.drawio",
        title="Activity Diagram UC10 — Logout",
        user_lane_label="User (Admin, Sekdes, Kades)",
        nodes=[
            Node("start", "user", 0, "start"),
            Node("u1", "user", 1, "action", "Memilih Logout pada menu profil"),
            Node("s1", "sistem", 2, "action", "Mengakhiri sesi dan menghapus autentikasi"),
            Node("s2", "sistem", 3, "action", "Mengarahkan ke halaman login"),
            Node("end", "sistem", 4, "end"),
        ],
        edges=[
            Edge("start", "u1"),
            Edge("u1", "s1"),
            Edge("s1", "s2"),
            Edge("s2", "end"),
        ],
    ),
]


def build_diagram_xml(diagram: Diagram) -> str:
    height = pool_height(diagram.nodes)
    pool_w = LANE_W * 2 + 30
    cells: list[str] = [
        '<mxCell id="0" />',
        '<mxCell id="1" parent="0" />',
        f'<mxCell id="title" value="{esc(diagram.title)}" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=1;fontSize=12;" vertex="1" parent="1">'
        f'<mxGeometry x="{POOL_X}" y="20" width="500" height="30" as="geometry" /></mxCell>',
        f'<mxCell id="pool" value="" style="swimlane;horizontal=1;startSize=30;fillColor=none;strokeColor=#000000;html=1;" vertex="1" parent="1">'
        f'<mxGeometry x="{POOL_X}" y="{POOL_Y}" width="{pool_w}" height="{height}" as="geometry" /></mxCell>',
        f'<mxCell id="lane-user" value="{esc(diagram.user_lane_label)}" style="swimlane;horizontal=1;startSize=110;fillColor=#ffffff;strokeColor=#000000;html=1;" vertex="1" parent="pool">'
        f'<mxGeometry x="30" y="0" width="{LANE_W}" height="{height}" as="geometry" /></mxCell>',
        f'<mxCell id="lane-sistem" value="Sistem" style="swimlane;horizontal=1;startSize=110;fillColor=#ffffff;strokeColor=#000000;html=1;" vertex="1" parent="pool">'
        f'<mxGeometry x="{30 + LANE_W}" y="0" width="{LANE_W}" height="{height}" as="geometry" /></mxCell>',
    ]

    lane_parent = {"user": "lane-user", "sistem": "lane-sistem"}
    for node in diagram.nodes:
        x, y, w, h = node_geometry(node)
        parent = lane_parent[node.lane]
        cells.append(
            f'<mxCell id="{node.id}" value="{esc(node.label)}" style="{node_style(node)}" vertex="1" parent="{parent}">'
            f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry" /></mxCell>'
        )

    for i, edge in enumerate(diagram.edges):
        label_attr = f' value="{esc(edge.label)}"' if edge.label else ""
        cells.append(
            f'<mxCell id="e{i}"{label_attr} style="{STYLE_EDGE}" edge="1" parent="1" source="{edge.source}" target="{edge.target}">'
            f'<mxGeometry relative="1" as="geometry" /></mxCell>'
        )

    inner = "\n        ".join(cells)
    diagram_id = diagram.filename.replace(".drawio", "")
    page_h = POOL_Y + height + 40
    return f"""<mxfile host="app.diagrams.net" agent="Cursor" version="24.7.17">
  <diagram id="{diagram_id}" name="{esc(diagram.title)}">
    <mxGraphModel dx="900" dy="700" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="600" pageHeight="{page_h}" background="#ffffff" math="0" shadow="0">
      <root>
        {inner}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for diagram in DIAGRAMS:
        path = OUTPUT_DIR / diagram.filename
        path.write_text(build_diagram_xml(diagram), encoding="utf-8")
        print(f"Generated: {path}")
    print(f"Done: {len(DIAGRAMS)} activity diagrams in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

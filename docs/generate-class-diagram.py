#!/usr/bin/env python3
"""Generate ArsipDesa UML class diagram (database entities only)."""

from __future__ import annotations

import html
from pathlib import Path

OUTPUT_DRAWIO = Path(__file__).parent / "class-diagram.drawio"
OUTPUT_PUML = Path(__file__).parent / "class-diagram.puml"

SKINPARAM = """skinparam defaultFontName "Garamond"
skinparam defaultFontSize 12
skinparam ClassFontSize 12
skinparam ClassAttributeFontSize 11"""


def uml_class(
    cid: str,
    name: str,
    attributes: list[str],
    x: int,
    y: int,
    width: int = 240,
) -> list[str]:
    row_h = 22
    header_h = 30
    height = header_h + len(attributes) * row_h + 8

    cells: list[str] = []
    cells.append(
        f'<mxCell id="{cid}" value="{html.escape(name)}" '
        f'style="swimlane;fontStyle=1;childLayout=stackLayout;horizontal=1;'
        f'startSize={header_h};horizontalStack=0;resizeParent=1;resizeParentMax=0;'
        f'resizeLast=0;collapsible=0;marginBottom=0;html=1;fillColor=#ffffff;'
        f'strokeColor=#000000;fontFamily=Garamond;fontSize=12;" '
        f'vertex="1" parent="1">'
        f'<mxGeometry x="{x}" y="{y}" width="{width}" height="{height}" as="geometry" />'
        f"</mxCell>"
    )

    for idx, attr in enumerate(attributes):
        cells.append(
            f'<mxCell id="{cid}-a{idx}" value="&#9632; {html.escape(attr)}" '
            f'style="text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;'
            f'spacingLeft=6;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];'
            f'portConstraint=eastwest;html=1;fontFamily=Garamond;fontSize=11;" '
            f'vertex="1" parent="{cid}">'
            f'<mxGeometry y="{header_h + idx * row_h}" width="{width}" height="{row_h}" as="geometry" />'
            f"</mxCell>"
        )

    return cells


def association(
    eid: str,
    source: str,
    target: str,
    label_source: str = "",
    label_target: str = "",
    dashed: bool = False,
) -> str:
    dash = "dashed=1;" if dashed else ""
    edge = (
        f'<mxCell id="{eid}" style="endArrow=open;endFill=0;html=1;strokeColor=#000000;'
        f'{dash}fontFamily=Garamond;fontSize=11;" edge="1" parent="1" '
        f'source="{source}" target="{target}">'
        f'<mxGeometry relative="1" as="geometry" />'
        f"</mxCell>"
    )
    parts = [edge]
    if label_source:
        parts.append(
            f'<mxCell id="{eid}-ls" value="{html.escape(label_source)}" '
            f'style="edgeLabel;html=1;align=center;verticalAlign=middle;'
            f'resizable=0;points=[];fontFamily=Garamond;fontSize=11;" '
            f'vertex="1" connectable="0" parent="{eid}">'
            f'<mxGeometry x="-0.7" relative="1" as="geometry">'
            f'<mxPoint as="offset" /></mxGeometry></mxCell>'
        )
    if label_target:
        parts.append(
            f'<mxCell id="{eid}-lt" value="{html.escape(label_target)}" '
            f'style="edgeLabel;html=1;align=center;verticalAlign=middle;'
            f'resizable=0;points=[];fontFamily=Garamond;fontSize=11;" '
            f'vertex="1" connectable="0" parent="{eid}">'
            f'<mxGeometry x="0.7" relative="1" as="geometry">'
            f'<mxPoint as="offset" /></mxGeometry></mxCell>'
        )
    return "\n        ".join(parts)


ENTITIES = {
    "user": {
        "name": "User",
        "table": "users",
        "x": 60,
        "y": 80,
        "w": 250,
        "attrs": [
            "id: bigint (PK)",
            "name: string",
            "username: string",
            "email: string",
            "email_verified_at: datetime",
            "password: string",
            "role: enum",
            "remember_token: string",
            "created_at: timestamp",
            "updated_at: timestamp",
        ],
    },
    "surat_masuk": {
        "name": "SuratMasuk",
        "table": "surat_masuk",
        "x": 380,
        "y": 60,
        "w": 280,
        "attrs": [
            "id: bigint (PK)",
            "no_surat: string",
            "tanggal_terima: date",
            "tanggal_surat: date",
            "pengirim: string",
            "perihal: string",
            "catatan: text",
            "status: string",
            "tingkat: string",
            "tujuan: string",
            "file: string",
            "diarsipkan_at: datetime",
            "verified_sekdes_at: datetime",
            "verified_sekdes_by: bigint (FK)",
            "verified_kades_at: datetime",
            "verified_kades_by: bigint (FK)",
            "created_at: timestamp",
            "updated_at: timestamp",
        ],
    },
    "surat_keluar": {
        "name": "SuratKeluar",
        "table": "surat_keluar",
        "x": 740,
        "y": 120,
        "w": 260,
        "attrs": [
            "id: bigint (PK)",
            "surat_masuk_id: bigint (FK)",
            "no_surat: string",
            "tanggal_kirim: date",
            "tujuan: string",
            "perihal: string",
            "catatan: text",
            "status: enum",
            "file: string",
            "diarsipkan_at: datetime",
            "created_at: timestamp",
            "updated_at: timestamp",
        ],
    },
    "disposisi": {
        "name": "Disposisi",
        "table": "disposisi",
        "x": 1060,
        "y": 120,
        "w": 270,
        "attrs": [
            "id: bigint (PK)",
            "surat_masuk_id: bigint (FK)",
            "user_id: bigint (FK)",
            "jabatan_tujuan_id: bigint (FK)",
            "dari_jabatan: string",
            "kepada: string",
            "catatan: text",
            "tanggal: date",
            "created_at: timestamp",
            "updated_at: timestamp",
        ],
    },
    "jabatan": {
        "name": "JabatanTujuanDisposisi",
        "table": "jabatan_tujuan_disposisi",
        "x": 1380,
        "y": 140,
        "w": 280,
        "attrs": [
            "id: bigint (PK)",
            "nama_jabatan: string",
            "is_active: boolean",
            "sort_order: int",
            "created_at: timestamp",
            "updated_at: timestamp",
        ],
    },
}


def build_drawio() -> str:
    cells: list[str] = [
        '<mxCell id="0" />',
        '<mxCell id="1" parent="0" />',
        '<mxCell id="title" value="Class Diagram — Entitas Database ArsipDesa" '
        'style="text;html=1;strokeColor=none;fillColor=none;align=left;'
        'verticalAlign=middle;fontStyle=1;fontSize=14;fontFamily=Garamond;" '
        'vertex="1" parent="1">'
        '<mxGeometry x="40" y="20" width="600" height="30" as="geometry" /></mxCell>',
    ]

    for key, spec in ENTITIES.items():
        cells.extend(
            uml_class(key, spec["name"], spec["attrs"], spec["x"], spec["y"], spec["w"])
        )

    cells.append(association("rel-user-disp", "user", "disposisi", "1", "*"))
    cells.append(association("rel-sm-disp", "surat_masuk", "disposisi", "1", "*"))
    cells.append(association("rel-sm-sk", "surat_masuk", "surat_keluar", "1", "0..*"))
    cells.append(association("rel-jab-disp", "jabatan", "disposisi", "1", "*"))
    cells.append(
        association("rel-user-sm-sekdes", "user", "surat_masuk", "1", "0..*", dashed=True)
    )
    cells.append(
        association("rel-user-sm-kades", "user", "surat_masuk", "1", "0..*", dashed=True)
    )

    body = "\n        ".join(cells)
    return f"""<mxfile host="app.diagrams.net" agent="Cursor" version="24.7.17">
  <diagram id="class-diagram-arsipdesa" name="Class Diagram ArsipDesa">
    <mxGraphModel dx="1700" dy="700" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1700" pageHeight="620" background="#ffffff" math="0" shadow="0">
      <root>
        {body}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""


def build_puml() -> str:
    blocks = []
    for spec in ENTITIES.values():
        attrs = "\n    ".join(spec["attrs"])
        blocks.append(
            f'  class {spec["name"]} << (T,#FF7700) Table: {spec["table"]} >> {{\n    {attrs}\n  }}'
        )

    return f"""@startuml
title Class Diagram — Entitas Database ArsipDesa

{SKINPARAM}

package "Entitas Database" {{
{chr(10).join(blocks)}

  User "1" -- "*" Disposisi : user_id
  SuratMasuk "1" -- "*" Disposisi : surat_masuk_id
  SuratMasuk "1" -- "0..*" SuratKeluar : surat_masuk_id
  JabatanTujuanDisposisi "1" -- "*" Disposisi : jabatan_tujuan_id
  User "1" ..> "0..*" SuratMasuk : verified_sekdes_by
  User "1" ..> "0..*" SuratMasuk : verified_kades_by
}}

note bottom of SuratMasuk
  Arsip surat disimpan via kolom diarsipkan_at
  pada tabel surat_masuk dan surat_keluar
end note

@enduml
"""


def main() -> None:
    OUTPUT_DRAWIO.write_text(build_drawio(), encoding="utf-8")
    OUTPUT_PUML.write_text(build_puml().strip() + "\n", encoding="utf-8")
    print(f"Generated: {OUTPUT_DRAWIO}")
    print(f"Generated: {OUTPUT_PUML}")


if __name__ == "__main__":
    main()

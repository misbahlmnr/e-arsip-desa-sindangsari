#!/usr/bin/env python3
"""Verify ArsipDesa ERD draw.io file."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ERD = Path(__file__).parent / "erd.drawio"

REQUIRED_ENTITIES = [
    "USER",
    "SURAT MASUK",
    "SURAT KELUAR",
    "DISPOSISI",
    "JABATAN TUJUAN",
]

REQUIRED_ATTRS = [
    "no_surat",
    "diarsipkan_at",
    "surat_masuk_id",
    "user_id",
    "jabatan_tujuan_id",
    "verified_sekdes_by",
    "verified_kades_by",
    "nama_jabatan",
]

REQUIRED_RELATIONS = [
    "membuat",
    "memiliki",
    "merujuk",
    "ditujukan",
    "diverifikasi",
]

FORBIDDEN = [
    "nomor_registrasi",
    "ARSIP SURAT",
    "Controller",
    "Service",
    "PERMOHONAN",
]


def parse_cells(content: str):
    cells = []
    for m in re.finditer(
        r'<mxCell id="([^"]+)" value="([^"]*)" style="([^"]+)"[^>]*>'
        r'<mxGeometry x="([^"]+)" y="([^"]+)" width="([^"]+)" height="([^"]+)"',
        content,
    ):
        _cid, value, style, x, y, w, h = m.groups()
        cells.append(
            {
                "name": value.replace("&#xa;", " ").strip(),
                "style": style,
                "box": (float(x), float(y), float(w), float(h)),
            }
        )
    return cells


def overlaps(a, b, pad=8) -> bool:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return not (
        ax + aw + pad <= bx
        or bx + bw + pad <= ax
        or ay + ah + pad <= by
        or by + bh + pad <= ay
    )


def check_layout(content: str) -> list[str]:
    cells = parse_cells(content)
    attrs = [c for c in cells if "ellipse" in c["style"] and c["name"]]
    diams = [c for c in cells if "rhombus" in c["style"]]
    ents = [c for c in cells if "rounded=0" in c["style"] and c["name"]]
    errors: list[str] = []
    for d in diams:
        for a in attrs:
            if overlaps(d["box"], a["box"]):
                errors.append(f"diamond '{d['name']}' overlaps attr '{a['name']}'")
        for e in ents:
            if overlaps(d["box"], e["box"]):
                errors.append(f"diamond '{d['name']}' overlaps entity '{e['name']}'")
    return errors


def main() -> int:
    if not ERD.exists():
        print(f"Missing file: {ERD}")
        return 1

    content = ERD.read_text(encoding="utf-8")
    errors: list[str] = []

    for ent in REQUIRED_ENTITIES:
        if ent not in content:
            errors.append(f"missing entity '{ent}'")

    for attr in REQUIRED_ATTRS:
        if attr not in content:
            errors.append(f"missing attribute '{attr}'")

    for rel in REQUIRED_RELATIONS:
        if rel not in content:
            errors.append(f"missing relationship '{rel}'")

    for bad in FORBIDDEN:
        if bad in content:
            errors.append(f"forbidden reference '{bad}'")

    if "rhombus" not in content:
        errors.append("missing relationship diamonds (rhombus)")

    if "ERmandOne" not in content:
        errors.append("missing cardinality arrows (ERmandOne)")

    errors.extend(check_layout(content))

    if errors:
        print("VERIFICATION FAILED:")
        for err in errors:
            print(f"  - {err}")
        return 1

    print("OK: ERD verified (layout clear)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

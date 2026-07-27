#!/usr/bin/env python3
"""Generate Chen-style ERD for ArsipDesa (database entities only).

Layout keeps relationship diamonds in clear corridors so they do not
overlap entity attribute ellipses.
"""

from __future__ import annotations

import html
from pathlib import Path

OUTPUT = Path(__file__).parent / "erd.drawio"

FONT = "fontFamily=Times New Roman;fontSize=14;"
ENTITY_STYLE = f"rounded=0;whiteSpace=wrap;html=1;{FONT}"
ATTR_STYLE = f"ellipse;whiteSpace=wrap;html=1;{FONT}"
REL_STYLE = f"rhombus;whiteSpace=wrap;html=1;{FONT}"
CARD_STYLE = f"ellipse;whiteSpace=wrap;html=1;aspect=fixed;{FONT}"
EDGE_ATTR = f"endArrow=none;html=1;rounded=0;{FONT}"
EDGE_REL = (
    "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;"
    f"jettySize=auto;html=1;{FONT}"
)

# Attribute offsets are relative to entity center (attr center).
# Placed on the outer side of each entity, away from relationship corridors.
ENTITIES: dict[str, dict] = {
    "user": {
        "label": "USER",
        "x": 560,
        "y": 180,
        "w": 140,
        "h": 60,
        # Attributes fan ABOVE / SIDES — leave bottom clear for verification diamonds
        "attrs": [
            ("id", -200, -40),
            ("name", -160, -110),
            ("username", -60, -140),
            ("email", 40, -150),
            ("email_verified_at", 170, -100),
            ("password", 220, -20),
            ("role", 220, 50),
            ("remember_token", 150, 110),
            ("created_at", -150, 100),
            ("updated_at", -210, 30),
        ],
    },
    "surat_masuk": {
        "label": "SURAT MASUK",
        "x": 40,
        "y": 780,
        "w": 170,
        "h": 60,
        # Spread LEFT / BOTTOM in a loose arc — right corridor kept clear
        "attrs": [
            ("id", -200, -110),
            ("no_surat", -250, -40),
            ("tanggal_terima", -270, 40),
            ("tanggal_surat", -260, 120),
            ("pengirim", -230, 200),
            ("perihal", -160, 270),
            ("catatan", -60, 320),
            ("status", -280, 80),
            ("tingkat", 50, 340),
            ("tujuan", -150, 350),
            ("file", -40, 390),
            ("diarsipkan_at", 80, 400),
            ("verified_sekdes_at", -240, 280),
            ("verified_sekdes_by", -100, 420),
            ("verified_kades_at", 40, 450),
            ("verified_kades_by", -200, 370),
            ("created_at", -290, 170),
            ("updated_at", 160, 420),
        ],
    },
    "surat_keluar": {
        "label": "SURAT KELUAR",
        "x": 1060,
        "y": 780,
        "w": 170,
        "h": 60,
        # Fan RIGHT / BOTTOM — leave left clear for merujuk
        "attrs": [
            ("id", 30, 180),
            ("surat_masuk_id", 140, 200),
            ("no_surat", 240, 140),
            ("tanggal_kirim", 260, 50),
            ("tujuan", 250, -40),
            ("perihal", 190, -110),
            ("catatan", 80, -140),
            ("status", 220, 220),
            ("file", 110, 260),
            ("diarsipkan_at", 0, 250),
            ("created_at", -90, 210),
            ("updated_at", 300, 90),
        ],
    },
    "disposisi": {
        "label": "DISPOSISI",
        "x": 500,
        "y": 1360,
        "w": 140,
        "h": 60,
        # Fan BOTTOM / SIDES — leave top clear
        "attrs": [
            ("id", -200, 30),
            ("surat_masuk_id", -210, 110),
            ("user_id", -170, 190),
            ("jabatan_tujuan_id", -70, 230),
            ("dari_jabatan", 50, 240),
            ("kepada", 160, 200),
            ("catatan", 210, 110),
            ("tanggal", 220, 20),
            ("created_at", 150, -70),
            ("updated_at", -130, -60),
        ],
    },
    "jabatan": {
        "label": "JABATAN TUJUAN\nDISPOSISI",
        "x": 1360,
        "y": 1350,
        "w": 180,
        "h": 70,
        # Fan RIGHT / BOTTOM — leave left clear for ditujukan
        "attrs": [
            ("id", 110, -110),
            ("nama_jabatan", 220, -40),
            ("is_active", 240, 50),
            ("sort_order", 200, 140),
            ("created_at", 90, 180),
            ("updated_at", -20, 190),
        ],
    },
}

# Diamonds sit in clear corridors between entities (not on attribute clouds).
#
# Layout sketch:
#                 USER
#         /         |         \
#  verif_sekdes  verif_kades  membuat
#         \         |           |
#      SURAT MASUK --merujuk-- SURAT KELUAR
#              \
#            memiliki
#                \
#             DISPOSISI ----ditujukan---- JABATAN
RELATIONSHIPS: list[dict] = [
    {
        "id": "rel_verif_sekdes",
        "label": "diverifikasi\nsekdes",
        "from": "user",
        "to": "surat_masuk",
        "to_card": "zero_many",
        "diamond": (160, 500),
        "card_near_from": (320, 420),
        "card_near_to": (140, 680),
        "from_side": "left",
        "to_side": "top",
    },
    {
        "id": "rel_verif_kades",
        "label": "diverifikasi\nkades",
        "from": "user",
        "to": "surat_masuk",
        "to_card": "zero_many",
        "diamond": (400, 500),
        "card_near_from": (500, 420),
        "card_near_to": (280, 680),
        "from_side": "bottom",
        "to_side": "top",
    },
    {
        "id": "rel_membuat",
        "label": "membuat",
        "from": "user",
        "to": "disposisi",
        "to_card": "many",
        "diamond": (940, 500),
        "card_near_from": (800, 420),
        "card_near_to": (740, 1200),
        "from_side": "right",
        "to_side": "top",
    },
    {
        "id": "rel_merujuk",
        "label": "merujuk",
        "from": "surat_masuk",
        "to": "surat_keluar",
        "to_card": "zero_many",
        "diamond": (620, 730),
        "card_near_from": (360, 760),
        "card_near_to": (920, 760),
        "from_side": "right",
        "to_side": "left",
    },
    {
        "id": "rel_memiliki",
        "label": "memiliki",
        "from": "surat_masuk",
        "to": "disposisi",
        "to_card": "many",
        "diamond": (420, 1160),
        "card_near_from": (180, 1020),
        "card_near_to": (420, 1300),
        "from_side": "bottom",
        "to_side": "left",
    },
    {
        "id": "rel_ditujukan",
        "label": "ditujukan",
        "from": "jabatan",
        "to": "disposisi",
        "to_card": "many",
        "diamond": (960, 1365),
        "card_near_from": (1180, 1385),
        "card_near_to": (760, 1385),
        "from_side": "left",
        "to_side": "right",
    },
]


def attr_size(name: str) -> tuple[int, int]:
    w = max(70, min(150, len(name) * 8 + 24))
    return w, 48


def resolve_attr_overlaps(
    positions: list[tuple[str, float, float, int, int]],
    *,
    iterations: int = 40,
    pad: float = 6,
) -> list[tuple[str, float, float, int, int]]:
    """Nudge overlapping attribute ellipses apart (keep names fixed)."""
    items = [list(p) for p in positions]
    for _ in range(iterations):
        moved = False
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                _, ax, ay, aw, ah = items[i]
                _, bx, by, bw, bh = items[j]
                if ax + aw + pad <= bx or bx + bw + pad <= ax or ay + ah + pad <= by or by + bh + pad <= ay:
                    continue
                # push apart along vector between centers
                acx, acy = ax + aw / 2, ay + ah / 2
                bcx, bcy = bx + bw / 2, by + bh / 2
                dx, dy = bcx - acx, bcy - acy
                dist = (dx * dx + dy * dy) ** 0.5 or 1.0
                push = 8.0
                ox, oy = (dx / dist) * push, (dy / dist) * push
                items[i][1] -= ox / 2
                items[i][2] -= oy / 2
                items[j][1] += ox / 2
                items[j][2] += oy / 2
                moved = True
        if not moved:
            break
    return [(n, float(x), float(y), int(w), int(h)) for n, x, y, w, h in items]


def entity_center(spec: dict) -> tuple[float, float]:
    return spec["x"] + spec["w"] / 2, spec["y"] + spec["h"] / 2


def entity_connection_point(eid: str, side: str) -> tuple[float, float]:
    spec = ENTITIES[eid]
    x, y, w, h = spec["x"], spec["y"], spec["w"], spec["h"]
    if side == "top":
        return x + w / 2, y
    if side == "bottom":
        return x + w / 2, y + h
    if side == "left":
        return x, y + h / 2
    if side == "right":
        return x + w, y + h / 2
    return x + w / 2, y + h / 2


def attr_positions(spec: dict) -> list[tuple[str, float, float, int, int]]:
    cx, cy = entity_center(spec)
    out: list[tuple[str, float, float, int, int]] = []
    for name, dx, dy in spec["attrs"]:
        aw, ah = attr_size(name)
        ax = cx + dx - aw / 2
        ay = cy + dy - ah / 2
        out.append((name, ax, ay, aw, ah))
    return resolve_attr_overlaps(out)


def entity_cell(eid: str, spec: dict) -> str:
    label = html.escape(spec["label"]).replace("\n", "&#xa;")
    return (
        f'<mxCell id="{eid}" value="{label}" style="{ENTITY_STYLE}" vertex="1" parent="1">'
        f'<mxGeometry x="{spec["x"]}" y="{spec["y"]}" width="{spec["w"]}" '
        f'height="{spec["h"]}" as="geometry" /></mxCell>'
    )


def attr_cell(eid: str, idx: int, name: str, x: float, y: float, w: int, h: int) -> str:
    aid = f"{eid}-attr-{idx}"
    return (
        f'<mxCell id="{aid}" value="{html.escape(name)}" style="{ATTR_STYLE}" '
        f'vertex="1" parent="1">'
        f'<mxGeometry x="{x:.0f}" y="{y:.0f}" width="{w}" height="{h}" as="geometry" />'
        f"</mxCell>"
    )


def attr_edge(eid: str, idx: int, entity_id: str, attr_id: str) -> str:
    return (
        f'<mxCell id="{eid}-attr-edge-{idx}" edge="1" parent="1" '
        f'source="{attr_id}" target="{entity_id}" style="{EDGE_ATTR}">'
        f'<mxGeometry relative="1" as="geometry" /></mxCell>'
    )


def cardinality_cell(rid: str, x: float, y: float) -> str:
    return (
        f'<mxCell id="{rid}" value="" style="{CARD_STYLE}" vertex="1" parent="1">'
        f'<mxGeometry x="{x:.0f}" y="{y:.0f}" width="10" height="10" as="geometry" />'
        f"</mxCell>"
    )


def rel_diamond(rid: str, label: str, x: float, y: float) -> str:
    text = html.escape(label).replace("\n", "&#xa;")
    return (
        f'<mxCell id="{rid}" value="{text}" style="{REL_STYLE}" vertex="1" parent="1">'
        f'<mxGeometry x="{x:.0f}" y="{y:.0f}" width="100" height="90" as="geometry" />'
        f"</mxCell>"
    )


def rel_edge(
    eid: str,
    source: str,
    target: str,
    *,
    cardinality: str = "one",
    points: list[tuple[float, float]] | None = None,
) -> str:
    arrows = {
        "none": "endArrow=none;endFill=0;",
        "one": "endArrow=ERmandOne;endFill=0;",
        "many": "endArrow=ERmany;endFill=0;",
        "zero_many": "endArrow=ERzeroToMany;endFill=0;",
    }
    style = EDGE_REL + arrows.get(cardinality, arrows["one"])
    pts = ""
    if points:
        pts = '<Array as="points">' + "".join(
            f'<mxPoint x="{x:.0f}" y="{y:.0f}" />' for x, y in points
        ) + "</Array>"
    return (
        f'<mxCell id="{eid}" edge="1" parent="1" source="{source}" target="{target}" '
        f'style="{style}">'
        f'<mxGeometry relative="1" as="geometry">{pts}</mxGeometry></mxCell>'
    )


def build() -> str:
    cells: list[str] = [
        '<mxCell id="0" />',
        '<mxCell id="1" parent="0" />',
        '<mxCell id="title" value="ERD — Sistem ArsipDesa" '
        f'style="text;html=1;strokeColor=none;fillColor=none;align=left;'
        f'verticalAlign=middle;fontStyle=1;fontSize=16;{FONT}" vertex="1" parent="1">'
        '<mxGeometry x="40" y="20" width="500" height="30" as="geometry" /></mxCell>',
    ]

    for eid, spec in ENTITIES.items():
        cells.append(entity_cell(eid, spec))
        for idx, (name, ax, ay, aw, ah) in enumerate(attr_positions(spec)):
            aid = f"{eid}-attr-{idx}"
            cells.append(attr_cell(eid, idx, name, ax, ay, aw, ah))
            cells.append(attr_edge(eid, idx, eid, aid))

    for rel in RELATIONSHIPS:
        rid = rel["id"]
        dx, dy = rel["diamond"]
        cells.append(rel_diamond(rid, rel["label"], dx, dy))

        cfrom = rel["card_near_from"]
        cto = rel["card_near_to"]
        cells.append(cardinality_cell(f"{rid}-card-from", cfrom[0], cfrom[1]))
        cells.append(cardinality_cell(f"{rid}-card-to", cto[0], cto[1]))

        cells.append(rel_edge(f"{rid}-d-from", rid, f"{rid}-card-from", cardinality="none"))
        cells.append(rel_edge(f"{rid}-d-to", rid, f"{rid}-card-to", cardinality="none"))

        from_pt = entity_connection_point(rel["from"], rel["from_side"])
        to_pt = entity_connection_point(rel["to"], rel["to_side"])
        to_card = rel.get("to_card", "many")

        cells.append(
            rel_edge(
                f"{rid}-to-entity-from",
                f"{rid}-card-from",
                rel["from"],
                cardinality="one",
                points=[from_pt] if rel["from_side"] in ("top", "bottom", "left", "right") else None,
            )
        )
        cells.append(
            rel_edge(
                f"{rid}-to-entity-to",
                f"{rid}-card-to",
                rel["to"],
                cardinality=to_card,
                points=[to_pt] if rel["to_side"] in ("top", "bottom", "left", "right") else None,
            )
        )

    body = "\n        ".join(cells)
    return f"""<mxfile host="app.diagrams.net" agent="Cursor" version="24.7.17">
  <diagram id="erd-arsipdesa" name="ERD ArsipDesa">
    <mxGraphModel dx="2400" dy="1800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2400" pageHeight="1900" background="#ffffff" math="0" shadow="0">
      <root>
        {body}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""


def main() -> None:
    OUTPUT.write_text(build(), encoding="utf-8")
    print(f"Generated: {OUTPUT}")


if __name__ == "__main__":
    main()

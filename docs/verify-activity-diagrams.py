from pathlib import Path
import re

d = Path(__file__).parent / "activity-diagrams"
files = sorted(d.glob("uc*.drawio"))
assert len(files) == 10, f"expected 10 files, got {len(files)}"

expected = {
    "uc01-login.drawio": "User (Admin, Sekdes, Kades)",
    "uc02-kelola-surat.drawio": "User (Admin)",
    "uc03-kelola-arsip.drawio": "User (Admin)",
    "uc04-kelola-user.drawio": "User (Admin)",
    "uc05-review-surat.drawio": "User (Sekdes)",
    "uc06-verifikasi-surat.drawio": "User (Kades)",
    "uc07-disposisi.drawio": "User (Sekdes, Kades)",
    "uc08-pencarian-arsip.drawio": "User (Admin, Sekdes, Kades)",
    "uc09-laporan.drawio": "User (Admin, Sekdes, Kades)",
    "uc10-logout.drawio": "User (Admin, Sekdes, Kades)",
}

for f in files:
    t = f.read_text(encoding="utf-8")
    lane = re.search(r'id="lane-user" value="([^"]+)"', t)
    assert lane, f"missing user lane: {f.name}"
    assert lane.group(1) == expected[f.name], f"{f.name}: {lane.group(1)}"
    assert "fillColor=#000000;strokeColor=#000000" in t, f"no start: {f.name}"
    assert "shape=endState" in t, f"no end: {f.name}"
    assert 'id="pool"' in t and 'id="lane-sistem"' in t, f"no pool: {f.name}"
    rows_user = re.findall(r'parent="lane-user"[^>]*>\s*<mxGeometry[^>]*y="(\d+)"', t)
    rows_sys = re.findall(r'parent="lane-sistem"[^>]*>\s*<mxGeometry[^>]*y="(\d+)"', t)
    for label, rows in [("user", rows_user), ("sistem", rows_sys)]:
        ys = [int(y) for y in rows]
        assert len(ys) == len(set(ys)), f"overlap y in {f.name} lane {label}"
    print(f"OK {f.name} | edges={t.count('edge=\"1\"')} | decisions={t.count('rhombus;')}")

print("All 10 activity diagrams verified.")

#!/usr/bin/env python3
"""Verify ArsipDesa PlantUML sequence diagrams."""

from __future__ import annotations

import re
import sys
from pathlib import Path

DIAGRAM_DIR = Path(__file__).parent / "sequence-diagrams"

EXPECTED_FILES = [
    "uc01-login.puml",
    "uc02-kelola-surat.puml",
    "uc03-kelola-arsip.puml",
    "uc04-kelola-user.puml",
    "uc05-review-surat.puml",
    "uc06-verifikasi-surat.puml",
    "uc07-disposisi.puml",
    "uc08-pencarian-arsip.puml",
    "uc09-laporan.puml",
    "uc10-logout.puml",
]

FORBIDDEN = ["AuthService", "AuthController", "ArsipSuratController::archive"]

REQUIRED_CLASSES = {
    "uc01-login.puml": ["AuthenticatedSessionController", "LoginRequest", "DashboardService"],
    "uc02-kelola-surat.puml": ["SuratMasukController", "SuratKeluarController", "SuratMasukService"],
    "uc03-kelola-arsip.puml": ["SuratMasukController", "SuratMasukService"],
    "uc04-kelola-user.puml": ["UserController", "UserService"],
    "uc05-review-surat.puml": ["SuratMasukController", "ReviewSekdesRequest", "reviewBySekdes"],
    "uc06-verifikasi-surat.puml": ["SuratMasukController", "VerifikasiKadesRequest", "verifyByKades"],
    "uc07-disposisi.puml": ["DisposisiController", "DisposisiService"],
    "uc08-pencarian-arsip.puml": ["ArsipSuratController", "BinarySearchService"],
    "uc09-laporan.puml": ["LaporanController", "LaporanService"],
    "uc10-logout.puml": ["AuthenticatedSessionController", "Auth"],
}

SKINPARAM_MARKERS = [
    'skinparam defaultFontName "Garamond"',
    "skinparam defaultFontSize 12",
]


def verify_file(path: Path) -> list[str]:
    errors: list[str] = []
    content = path.read_text(encoding="utf-8")

    if not content.strip().startswith("@startuml"):
        errors.append(f"{path.name}: missing @startuml")
    if not content.strip().endswith("@enduml"):
        errors.append(f"{path.name}: missing @enduml")

    for marker in SKINPARAM_MARKERS:
        if marker not in content:
            errors.append(f"{path.name}: missing skinparam '{marker}'")

    if "activate " not in content or "deactivate " not in content:
        errors.append(f"{path.name}: missing activate/deactivate")

    if "alt " not in content:
        errors.append(f"{path.name}: missing alt block")

    for forbidden in FORBIDDEN:
        if forbidden in content:
            errors.append(f"{path.name}: forbidden reference '{forbidden}'")

    for required in REQUIRED_CLASSES.get(path.name, []):
        if required not in content:
            errors.append(f"{path.name}: missing required class/method '{required}'")

    # UC03 should NOT use ArsipSuratController for archiving
    if path.name == "uc03-kelola-arsip.puml" and "ArsipSuratController" in content:
        errors.append(f"{path.name}: should not use ArsipSuratController for archiving")

    return errors


def main() -> int:
    all_errors: list[str] = []

    for filename in EXPECTED_FILES:
        path = DIAGRAM_DIR / filename
        if not path.exists():
            all_errors.append(f"Missing file: {filename}")
            continue
        all_errors.extend(verify_file(path))

    extra = sorted(
        p.name for p in DIAGRAM_DIR.glob("*.puml") if p.name not in EXPECTED_FILES
    )
    for name in extra:
        all_errors.append(f"Unexpected file: {name}")

    if all_errors:
        print("VERIFICATION FAILED:")
        for err in all_errors:
            print(f"  - {err}")
        return 1

    print(f"OK: {len(EXPECTED_FILES)} sequence diagrams verified in {DIAGRAM_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

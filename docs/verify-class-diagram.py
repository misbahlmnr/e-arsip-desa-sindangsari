#!/usr/bin/env python3
"""Verify ArsipDesa class diagram (database entities only)."""

from __future__ import annotations

import sys
from pathlib import Path

DOCS = Path(__file__).parent
DRAWIO = DOCS / "class-diagram.drawio"
PUML = DOCS / "class-diagram.puml"

REQUIRED_MODELS = [
    "User",
    "SuratMasuk",
    "SuratKeluar",
    "Disposisi",
    "JabatanTujuanDisposisi",
]

FORBIDDEN_PATTERNS = [
    "Controller",
    "Service",
    "class ArsipSurat {",
    "class LaporanArsip",
    "nomor_registrasi",
    "AuthService",
    "AuthController",
]


def verify() -> list[str]:
    errors: list[str] = []

    for path in (DRAWIO, PUML):
        if not path.exists():
            errors.append(f"Missing file: {path.name}")
            continue

        content = path.read_text(encoding="utf-8")

        for model in REQUIRED_MODELS:
            if model not in content:
                errors.append(f"{path.name}: missing model {model}")

        for bad in FORBIDDEN_PATTERNS:
            if bad in content:
                errors.append(f"{path.name}: forbidden reference '{bad}'")

        if "diarsipkan_at" not in content:
            errors.append(f"{path.name}: missing diarsipkan_at column")

    return errors


def main() -> int:
    errors = verify()
    if errors:
        print("VERIFICATION FAILED:")
        for err in errors:
            print(f"  - {err}")
        return 1

    print("OK: class diagram files verified")
    return 0


if __name__ == "__main__":
    sys.exit(main())

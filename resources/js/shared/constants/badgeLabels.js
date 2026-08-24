/** Label tampilan untuk key status surat masuk (kolom DB) */
export const SURAT_MASUK_STATUS_LABELS = {
    draft: "Draft",
    terverifikasi: "Terverifikasi",
    didisposisikan: "Didisposisikan",
    diarsipkan: "Diarsipkan",
};

/** Label status alur surat masuk (UI) — bedakan review Sekdes vs verifikasi Kades */
export const SURAT_MASUK_ALUR_LABELS = {
    menunggu_review_sekdes: "Draft",
    direview_sekdes: "Review Sekdes",
    menunggu_verifikasi_kades: "Menunggu verifikasi Kades",
    siap_disposisi_kades: "Siap disposisi Kades",
    didisposisikan: "Didisposisikan",
    diarsipkan: "Diarsipkan",
    // fallback dashboard kades (legacy keys)
    menunggu_verifikasi: "Menunggu verifikasi Kades",
    siap_disposisi: "Siap disposisi Kades",
};

/** Tingkat surat setelah review Sekdes */
export const TINGKAT_SURAT_LABELS = {
    biasa: "Biasa",
    penting: "Penting",
};

/** Label tampilan untuk key status surat keluar */
export const SURAT_KELUAR_STATUS_LABELS = {
    draft: "Draft",
    terkirim: "Terkirim",
};

/** Indikator sudah/belum ada disposisi di tabel surat masuk */
export const DISPOSISI_FLAG_LABELS = {
    belum: "Belum",
    sudah: "Sudah",
};

export const ROLE_LABELS = {
    admin: "Admin",
    sekdes: "Sekretaris Desa",
    kades: "Kepala Desa",
};

/**
 * @param {Record<string, string>} map
 * @param {string} value
 */
export function badgeLabel(map, value) {
    return map[value] ?? value ?? "—";
}

/**
 * Resolve key status alur dari row surat masuk (fallback jika belum ada status_tampil).
 * @param {{ status?: string, tingkat?: string|null, verified_kades_at?: string|null, diarsipkan_at?: string|null, status_tampil?: string }} letter
 */
export function resolveSuratMasukAlurStatus(letter) {
    if (!letter) {
        return null;
    }

    if (letter.status_tampil) {
        return letter.status_tampil;
    }

    if (letter.diarsipkan_at || letter.status === "diarsipkan") {
        return "diarsipkan";
    }

    if (letter.status === "draft") {
        return "menunggu_review_sekdes";
    }

    if (letter.status === "didisposisikan") {
        return "didisposisikan";
    }

    if (letter.status === "terverifikasi") {
        if (letter.tingkat === "penting" && !letter.verified_kades_at) {
            return "menunggu_verifikasi_kades";
        }
        if (letter.tingkat === "penting" && letter.verified_kades_at) {
            return "siap_disposisi_kades";
        }
        return "direview_sekdes";
    }

    return letter.status ?? null;
}

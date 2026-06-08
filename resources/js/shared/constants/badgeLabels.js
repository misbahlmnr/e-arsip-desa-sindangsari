/** Label tampilan untuk key status surat masuk */
export const SURAT_MASUK_STATUS_LABELS = {
    draft: "Draft",
    terverifikasi: "Terverifikasi",
    didisposisikan: "Didisposisikan",
    diarsipkan: "Diarsipkan",
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

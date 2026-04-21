import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Tanggal kalender (tanpa jam) dalam locale Indonesia, zona Asia/Jakarta.
 * Cocok untuk nilai `Y-m-d` atau string ISO dari server.
 *
 * @param {string|null|undefined} value
 */
export function formatTanggalKalenderWib(value) {
    if (value == null || value === "") {
        return "—";
    }
    const str = String(value).trim();
    const ymd = str.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
        const [y, m, d] = ymd.split("-").map(Number);
        const utcNoon = Date.UTC(y, m - 1, d, 12, 0, 0);
        return new Intl.DateTimeFormat("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(utcNoon);
    }
    const t = Date.parse(str);
    if (Number.isNaN(t)) {
        return str;
    }
    return new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(t);
}

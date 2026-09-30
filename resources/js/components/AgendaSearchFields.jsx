import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const BULAN = [
    ["1", "Januari"],
    ["2", "Februari"],
    ["3", "Maret"],
    ["4", "April"],
    ["5", "Mei"],
    ["6", "Juni"],
    ["7", "Juli"],
    ["8", "Agustus"],
    ["9", "September"],
    ["10", "Oktober"],
    ["11", "November"],
    ["12", "Desember"],
];

function yearChoices() {
    const now = new Date().getFullYear();
    const years = [];
    for (let year = now + 1; year >= now - 10; year -= 1) {
        years.push(String(year));
    }
    return years;
}

/**
 * Pilihan tahun memicu Binary Search. Bulan, tanggal, perihal, dan pihak
 * hanya aktif setelah tahun dipilih.
 *
 * @param {{
 *   filters: Record<string, unknown> | null | undefined;
 *   visit: (params: Record<string, unknown>) => void;
 *   partyKey: string;
 *   partyLabel: string;
 *   yearEnabled?: boolean;
 * }} props
 */
export function AgendaSearchFields({
    filters,
    visit,
    partyKey,
    partyLabel,
    yearEnabled = true,
}) {
    const tahun = filters?.tahun ? String(filters.tahun) : "all";
    const bulan = filters?.bulan ? String(filters.bulan) : "all";
    const yearChosen = yearEnabled && tahun !== "all";
    const [perihal, setPerihal] = useState(filters?.perihal ?? "");
    const [pihak, setPihak] = useState(filters?.[partyKey] ?? "");

    useEffect(() => {
        setPerihal(filters?.perihal ?? "");
    }, [filters?.perihal]);

    useEffect(() => {
        setPihak(filters?.[partyKey] ?? "");
    }, [filters, partyKey]);

    useEffect(() => {
        if (!yearChosen) {
            return undefined;
        }
        const handle = setTimeout(() => {
            const nextPerihal = String(perihal ?? "").trim();
            const nextPihak = String(pihak ?? "").trim();
            const currentPerihal = String(filters?.perihal ?? "").trim();
            const currentPihak = String(filters?.[partyKey] ?? "").trim();
            if (nextPerihal === currentPerihal && nextPihak === currentPihak) {
                return;
            }
            visit({
                page: 1,
                perihal: nextPerihal || undefined,
                [partyKey]: nextPihak || undefined,
            });
        }, 400);
        return () => clearTimeout(handle);
    }, [perihal, pihak, yearChosen, visit, filters, partyKey]);

    return (
        <>
            <Select
                value={yearEnabled ? tahun : "all"}
                disabled={!yearEnabled}
                onValueChange={(value) =>
                    visit({
                        page: 1,
                        tahun: value === "all" ? undefined : value,
                        bulan: undefined,
                        tanggal: undefined,
                        perihal: undefined,
                        [partyKey]: undefined,
                    })
                }
            >
                <SelectTrigger className="w-full sm:w-36 h-11 rounded-xl">
                    <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua tahun</SelectItem>
                    {yearChoices().map((year) => (
                        <SelectItem key={year} value={year}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={yearChosen ? bulan : "all"}
                disabled={!yearChosen}
                onValueChange={(value) =>
                    visit({
                        page: 1,
                        bulan: value === "all" ? undefined : value,
                    })
                }
            >
                <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl">
                    <SelectValue placeholder="Bulan" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua bulan</SelectItem>
                    {BULAN.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                type="date"
                disabled={!yearChosen}
                value={yearChosen ? (filters?.tanggal ?? "") : ""}
                onChange={(event) =>
                    visit({
                        page: 1,
                        tanggal: event.target.value || undefined,
                    })
                }
                className="h-11 w-full sm:w-40 rounded-xl"
                aria-label="Tanggal"
            />
            <Input
                value={yearChosen ? perihal : ""}
                disabled={!yearChosen}
                onChange={(event) => setPerihal(event.target.value)}
                placeholder="Perihal"
                className="h-11 w-full sm:w-40 rounded-xl"
            />
            <Input
                value={yearChosen ? pihak : ""}
                disabled={!yearChosen}
                onChange={(event) => setPihak(event.target.value)}
                placeholder={partyLabel}
                className="h-11 w-full sm:w-40 rounded-xl"
            />
        </>
    );
}

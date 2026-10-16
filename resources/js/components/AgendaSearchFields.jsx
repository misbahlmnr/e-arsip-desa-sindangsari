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
 * Filter tahun memakai binary search pada nomor agenda.
 * Bulan, perihal, dan pihak hanya dipakai setelah tahun dipilih.
 */
export function AgendaSearchFields({
    filters,
    visit,
    partyKey,
    partyLabel,
}) {
    const tahun = filters?.tahun ? String(filters.tahun) : "all";
    const bulan = filters?.bulan ? String(filters.bulan) : "all";
    const yearChosen = tahun !== "all";
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select
                value={tahun}
                onValueChange={(value) =>
                    visit({
                        page: 1,
                        tahun: value,
                        bulan: "all",
                        perihal: undefined,
                        [partyKey]: undefined,
                    })
                }
            >
                <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Tahun agenda" />
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
                onValueChange={(value) => visit({ page: 1, bulan: value })}
            >
                <SelectTrigger className="h-11 rounded-xl">
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
                value={perihal}
                disabled={!yearChosen}
                onChange={(e) => setPerihal(e.target.value)}
                placeholder="Perihal"
                className="h-11 rounded-xl"
            />
            <Input
                value={pihak}
                disabled={!yearChosen}
                onChange={(e) => setPihak(e.target.value)}
                placeholder={partyLabel}
                className="h-11 rounded-xl"
            />
        </div>
    );
}

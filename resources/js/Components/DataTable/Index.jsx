import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileInput, Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const defaultServerSort = { sort_by: "tanggal_terima", sort_dir: "desc" };

/**
 * @typedef {object} LaravelPaginator
 * @property {unknown[]} data
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} per_page
 * @property {number|null} [from]
 * @property {number|null} [to]
 * @property {number} total
 */

/**
 * Data table — server-side (Inertia + Laravel paginator).
 *
 * @param {object} props
 * @param {import('@tanstack/react-table').ColumnDef[]} props.columns
 * @param {LaravelPaginator} [props.pagination] — server mode (Laravel LengthAwarePaginator JSON)
 * @param {object} [props.filters] — server: `{ search, sort_by, sort_dir, per_page }`
 * @param {(params: Record<string, unknown>) => void} [props.visit] — server: `router.get` wrapper from `useServerTable`
 * @param {string} [props.searchInput]
 * @param {(v: string) => void} [props.onSearchInputChange]
 * @param {boolean} [props.loading]
 * @param {string} [props.searchPlaceholder]
 * @param {string} [props.emptyMessage]
 * @param {{ sort_by?: string, sort_dir?: 'asc'|'desc' }} [props.serverSortClearDefaults]
 * @param {import('react').ReactNode} [props.toolbarFilters] — filter controls (e.g. role, status), shown between search and page size
 * @param {import('react').ReactNode} [props.toolbarActions] — primary actions (e.g. create button), shown after page size
 */

export function DataTable({
    columns,
    pagination,
    filters,
    visit,
    searchInput,
    onSearchInputChange,
    loading = false,
    searchPlaceholder,
    emptyMessage,
    serverSortClearDefaults = defaultServerSort,
    toolbarFilters,
    toolbarActions,
}) {
    const tableData = pagination?.data ?? [];

    const pageIndex = Math.max(0, (pagination?.current_page ?? 1) - 1);
    const pageSize = pagination?.per_page ?? 10;
    const pageCount = Math.max(1, pagination?.last_page ?? 1);
    const sortBy = filters?.sort_by ?? serverSortClearDefaults.sort_by;
    const sortDir =
        filters?.sort_dir ?? serverSortClearDefaults.sort_dir ?? "desc";

    const handleServerPagination = useCallback(
        (updater) => {
            const prev = { pageIndex, pageSize };
            const next =
                typeof updater === "function" ? updater(prev) : updater;
            visit?.({
                page: next.pageIndex + 1,
                per_page: next.pageSize,
                search: filters?.search,
                sort_by: filters?.sort_by,
                sort_dir: filters?.sort_dir,
            });
        },
        [
            visit,
            pageIndex,
            pageSize,
            filters?.search,
            filters?.sort_by,
            filters?.sort_dir,
        ],
    );

    const handleServerSorting = useCallback(
        (updater) => {
            const prevSort = [{ id: sortBy, desc: sortDir === "desc" }];
            const next =
                typeof updater === "function" ? updater(prevSort) : updater;
            const first = next?.[0];
            if (!first) {
                visit?.({
                    page: 1,
                    search: filters?.search,
                    sort_by: serverSortClearDefaults.sort_by,
                    sort_dir: serverSortClearDefaults.sort_dir,
                    per_page: filters?.per_page,
                });
                return;
            }
            visit?.({
                page: 1,
                search: filters?.search,
                sort_by: first.id,
                sort_dir: first.desc ? "desc" : "asc",
                per_page: filters?.per_page,
            });
        },
        [
            visit,
            sortBy,
            sortDir,
            filters?.search,
            filters?.per_page,
            serverSortClearDefaults.sort_by,
            serverSortClearDefaults.sort_dir,
        ],
    );

    // TanStack Table + React Compiler: manual server-side mode is intentional.
    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API
    const table = useReactTable({
        data: tableData,
        columns,
        pageCount,
        manualPagination: true,
        manualSorting: true,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            sorting: [{ id: sortBy, desc: sortDir === "desc" }],
        },
        onPaginationChange: handleServerPagination,
        onSortingChange: handleServerSorting,
        getCoreRowModel: getCoreRowModel(),
    });

    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;

    const from = pagination?.from ?? 0;
    const to = pagination?.to ?? 0;
    const total = pagination?.total ?? 0;

    return (
        <div className="surface-card overflow-hidden">
            <div
                className={cn(
                    "flex flex-col md:flex-row md:items-center gap-3 px-6 md:px-8 py-5 border-b border-border",
                )}
            >
                <div className="relative flex-1 min-w-0 max-w-md">
                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder ?? "Cari data..."}
                        value={searchInput ?? ""}
                        onChange={(e) => onSearchInputChange?.(e.target.value)}
                        className="pl-10 h-11 rounded-xl"
                    />
                </div>
                {toolbarFilters ? (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        {toolbarFilters}
                    </div>
                ) : null}
                <Select
                    value={String(pageSize)}
                    onValueChange={(value) =>
                        visit?.({
                            page: 1,
                            per_page: Number(value),
                            search: filters?.search,
                            sort_by: filters?.sort_by,
                            sort_dir: filters?.sort_dir,
                        })
                    }
                >
                    <SelectTrigger className="w-full md:w-44 h-11 rounded-xl shrink-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size} / halaman
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {toolbarActions ? (
                    <div className="flex shrink-0">{toolbarActions}</div>
                ) : null}
            </div>

            {loading ? (
                <div className="px-8 py-10 text-sm text-muted-foreground">
                    Memuat data...
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow
                                        key={headerGroup.id}
                                        className="bg-muted/40 border-b border-border hover:bg-muted/40"
                                    >
                                        {headerGroup.headers.map(
                                            (header, index) => (
                                                <TableHead
                                                    key={header.id}
                                                    className={cn(
                                                        "py-3.5 text-xs font-bold text-muted-foreground uppercase tracking-wider",
                                                        index === 0 &&
                                                            "text-center",
                                                    )}
                                                >
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            ),
                                        )}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="hover:bg-muted/30 transition-colors border-b border-border"
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell, index) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className={cn(
                                                            "text-sm py-4",
                                                            index === 0 &&
                                                                "text-center",
                                                        )}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className={cn(
                                                "px-8 py-20 text-center",
                                                "text-muted-foreground",
                                            )}
                                        >
                                            <div className="mx-auto size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                                                <FileInput className="size-7 text-muted-foreground" />
                                            </div>
                                            <p className="font-semibold text-lg text-foreground">
                                                Tidak ada data ditemukan
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
                                                {emptyMessage ??
                                                    "Coba ubah kata kunci pencarian atau filter."}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div
                        className={cn(
                            "flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-8 py-4 border-t border-border bg-muted/20",
                        )}
                    >
                        <p className="text-xs text-muted-foreground">
                            <>
                                Menampilkan{" "}
                                <span className="font-semibold text-foreground">
                                    {from}
                                </span>
                                -
                                <span className="font-semibold text-foreground">
                                    {to}
                                </span>{" "}
                                dari{" "}
                                <span className="font-semibold text-foreground">
                                    {total}
                                </span>{" "}
                                data
                            </>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-lg"
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    visit?.({
                                        page: currentPage - 1,
                                        per_page: filters?.per_page,
                                        search: filters?.search,
                                        sort_by: filters?.sort_by,
                                        sort_dir: filters?.sort_dir,
                                    })
                                }
                            >
                                Sebelumnya
                            </Button>
                            <span className="text-sm font-semibold tabular-nums px-2">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-lg"
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    visit?.({
                                        page: currentPage + 1,
                                        per_page: filters?.per_page,
                                        search: filters?.search,
                                        sort_by: filters?.sort_by,
                                        sort_dir: filters?.sort_dir,
                                    })
                                }
                            >
                                Berikutnya
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

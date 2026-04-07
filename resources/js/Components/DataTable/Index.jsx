import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { Input } from "@/Components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
 * Data table — client (TanStack filter + local pages) or server (Inertia + Laravel paginator).
 *
 * @param {object} props
 * @param {'client'|'server'} [props.mode='client']
 * @param {import('@tanstack/react-table').ColumnDef[]} props.columns
 * @param {unknown[]} [props.data] — client mode rows; server mode optional if `pagination` has `data`
 * @param {LaravelPaginator} [props.pagination] — server mode (Laravel LengthAwarePaginator JSON)
 * @param {object} [props.filters] — server: `{ search, sort_by, sort_dir, per_page }`
 * @param {(params: Record<string, unknown>) => void} [props.visit] — server: `router.get` wrapper from `useServerTable`
 * @param {string} [props.searchInput]
 * @param {(v: string) => void} [props.onSearchInputChange]
 * @param {boolean} [props.loading]
 * @param {string} [props.searchPlaceholder]
 * @param {string} [props.emptyMessage]
 * @param {{ sort_by?: string, sort_dir?: 'asc'|'desc' }} [props.serverSortClearDefaults]
 */

export function DataTable({
    mode = "client",
    columns,
    data: dataProp,
    pagination,
    filters,
    visit,
    searchInput,
    onSearchInputChange,
    loading = false,
    searchPlaceholder,
    emptyMessage,
    serverSortClearDefaults = defaultServerSort,
}) {
    const isServer = mode === "server";

    const [globalFilter, setGlobalFilter] = useState("");

    const tableData = isServer ? (pagination?.data ?? []) : (dataProp ?? []);

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

    // TanStack Table + React Compiler: manual server mode is intentional.
    // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API
    const table = useReactTable({
        data: tableData,
        columns,
        ...(isServer
            ? {
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
              }
            : {
                  state: {
                      globalFilter,
                  },
                  onGlobalFilterChange: setGlobalFilter,
                  getFilteredRowModel: getFilteredRowModel(),
                  getPaginationRowModel: getPaginationRowModel(),
                  initialState: {
                      pagination: {
                          pageSize: 10,
                      },
                  },
              }),
        getCoreRowModel: getCoreRowModel(),
    });

    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;

    const from = pagination?.from ?? 0;
    const to = pagination?.to ?? 0;
    const total = pagination?.total ?? 0;

    const clientRowCount = table.getRowModel().rows.length;
    const clientDataLen = tableData.length;

    return (
        <div className="space-y-4">
            <div
                className={cn(
                    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
                    !isServer && "sm:justify-between",
                )}
            >
                {isServer ? (
                    <Input
                        placeholder={searchPlaceholder ?? "Cari surat masuk…"}
                        value={searchInput ?? ""}
                        onChange={(e) => onSearchInputChange?.(e.target.value)}
                        className="max-w-md"
                    />
                ) : (
                    <Input
                        placeholder={searchPlaceholder ?? "Cari surat masuk…"}
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                )}
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-sm",
                            isServer
                                ? "text-muted-foreground"
                                : "text-gray-500",
                        )}
                    >
                        Show per page:
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={
                                    isServer
                                        ? "text-muted-foreground"
                                        : "text-gray-500"
                                }
                            >
                                {isServer
                                    ? `${pageSize} entries`
                                    : `${table.getState().pagination.pageSize} entries`}
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {PAGE_SIZE_OPTIONS.map((n) => (
                                <DropdownMenuItem
                                    key={n}
                                    onClick={() =>
                                        isServer
                                            ? visit?.({
                                                  page: 1,
                                                  per_page: n,
                                                  search: filters?.search,
                                                  sort_by: filters?.sort_by,
                                                  sort_dir: filters?.sort_dir,
                                              })
                                            : table.setPageSize(n)
                                    }
                                >
                                    {n}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="text-sm"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
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
                                        "h-24 text-center",
                                        isServer ? "text-muted-foreground" : "",
                                    )}
                                >
                                    {emptyMessage ?? "No results."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div
                className={cn(
                    "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
                    !isServer && "sm:justify-between",
                )}
            >
                <div
                    className={cn(
                        "text-sm",
                        isServer ? "text-muted-foreground" : "text-gray-500",
                    )}
                >
                    {isServer
                        ? `Showing ${from}–${to} of ${total} entries`
                        : `Showing ${clientRowCount} of ${clientDataLen} entries`}
                </div>
                <Pagination className="flex justify-end text-gray-500">
                    <PaginationContent>
                        <PaginationItem>
                            {isServer ? (
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage <= 1) return;
                                        visit?.({
                                            page: currentPage - 1,
                                            per_page: filters?.per_page,
                                            search: filters?.search,
                                            sort_by: filters?.sort_by,
                                            sort_dir: filters?.sort_dir,
                                        });
                                    }}
                                    className={
                                        currentPage <= 1
                                            ? "pointer-events-none opacity-80 cursor-not-allowed"
                                            : ""
                                    }
                                />
                            ) : (
                                <PaginationPrevious
                                    onClick={() => table.previousPage()}
                                    className={
                                        !table.getCanPreviousPage()
                                            ? "pointer-events-none opacity-80 cursor-not-allowed"
                                            : ""
                                    }
                                />
                            )}
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <PaginationItem key={pageNumber}>
                                    {isServer ? (
                                        <PaginationLink
                                            href="#"
                                            isActive={
                                                currentPage === pageNumber
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();
                                                visit?.({
                                                    page: pageNumber,
                                                    per_page: filters?.per_page,
                                                    search: filters?.search,
                                                    sort_by: filters?.sort_by,
                                                    sort_dir: filters?.sort_dir,
                                                });
                                            }}
                                            className={
                                                currentPage === pageNumber
                                                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                                                    : ""
                                            }
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    ) : (
                                        <PaginationLink
                                            isActive={
                                                currentPage === pageNumber
                                            }
                                            onClick={() =>
                                                table.setPageIndex(
                                                    pageNumber - 1,
                                                )
                                            }
                                            className={
                                                currentPage === pageNumber
                                                    ? "bg-primary text-white"
                                                    : ""
                                            }
                                        >
                                            {pageNumber}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            {isServer ? (
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage >= totalPages) return;
                                        visit?.({
                                            page: currentPage + 1,
                                            per_page: filters?.per_page,
                                            search: filters?.search,
                                            sort_by: filters?.sort_by,
                                            sort_dir: filters?.sort_dir,
                                        });
                                    }}
                                    className={
                                        currentPage >= totalPages
                                            ? "pointer-events-none opacity-80 cursor-not-allowed"
                                            : ""
                                    }
                                />
                            ) : (
                                <PaginationNext
                                    onClick={() => table.nextPage()}
                                    className={
                                        !table.getCanNextPage()
                                            ? "pointer-events-none opacity-80 cursor-not-allowed"
                                            : ""
                                    }
                                />
                            )}
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

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
    useReactTable,
} from "@tanstack/react-table";
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
import { Input } from "@/Components/ui/input";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SuratMasukTable({
    letters,
    filters,
    columns,
    searchInput,
    setSearchInput,
    loading,
    visit,
}) {
    const pageIndex = Math.max(0, (letters?.current_page ?? 1) - 1);
    const pageSize = letters?.per_page ?? 10;
    const pageCount = Math.max(1, letters?.last_page ?? 1);
    const sortBy = filters?.sort_by ?? "tanggal_terima";
    const sortDir = filters?.sort_dir ?? "desc";

    // TanStack Table is incompatible with React Compiler memoization; safe here.
    // eslint-disable-next-line react-hooks/incompatible-library -- manual server pagination/sorting
    const table = useReactTable({
        data: letters?.data ?? [],
        columns,
        pageCount,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            sorting: [{ id: sortBy, desc: sortDir === "desc" }],
        },
        manualPagination: true,
        manualSorting: true,
        onPaginationChange: (updater) => {
            const prev = { pageIndex, pageSize };
            const next =
                typeof updater === "function" ? updater(prev) : updater;
            visit({
                page: next.pageIndex + 1,
                per_page: next.pageSize,
                search: filters?.search,
                sort_by: filters?.sort_by,
                sort_dir: filters?.sort_dir,
            });
        },
        onSortingChange: (updater) => {
            const prevSort = [{ id: sortBy, desc: sortDir === "desc" }];
            const next =
                typeof updater === "function" ? updater(prevSort) : updater;
            const first = next?.[0];
            if (!first) {
                visit({
                    page: 1,
                    search: filters?.search,
                    sort_by: "tanggal_terima",
                    sort_dir: "desc",
                    per_page: filters?.per_page,
                });
                return;
            }
            visit({
                page: 1,
                search: filters?.search,
                sort_by: first.id,
                sort_dir: first.desc ? "desc" : "asc",
                per_page: filters?.per_page,
            });
        },
        getCoreRowModel: getCoreRowModel(),
    });

    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;
    const from = letters?.from ?? 0;
    const to = letters?.to ?? 0;
    const total = letters?.total ?? 0;

    return (
        <div className="relative space-y-4">
            {loading && (
                <div
                    className="absolute inset-0 z-10 flex items-start justify-center rounded-md bg-background/60 pt-24"
                    aria-busy="true"
                    aria-label="Memuat data"
                >
                    <span className="text-sm font-medium text-muted-foreground">
                        Memuat…
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Input
                    placeholder="Cari no. surat, pengirim, perihal…"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="max-w-md"
                />
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Per halaman:
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="text-muted-foreground"
                            >
                                {pageSize} baris
                                <ChevronDownIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {[10, 20, 50, 100].map((n) => (
                                <DropdownMenuItem
                                    key={n}
                                    onClick={() =>
                                        visit({
                                            page: 1,
                                            per_page: n,
                                            search: filters?.search,
                                            sort_by: filters?.sort_by,
                                            sort_dir: filters?.sort_dir,
                                        })
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
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                    Menampilkan {from}–{to} dari {total} data
                </div>
                <Pagination
                    className={cn(
                        "flex justify-end text-muted-foreground",
                        totalPages <= 1 && "opacity-60",
                    )}
                >
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage <= 1) return;
                                    visit({
                                        page: currentPage - 1,
                                        per_page: filters?.per_page,
                                        search: filters?.search,
                                        sort_by: filters?.sort_by,
                                        sort_dir: filters?.sort_dir,
                                    });
                                }}
                                className={
                                    currentPage <= 1
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === pageNumber}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            visit({
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
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage >= totalPages) return;
                                    visit({
                                        page: currentPage + 1,
                                        per_page: filters?.per_page,
                                        search: filters?.search,
                                        sort_by: filters?.sort_by,
                                        sort_dir: filters?.sort_dir,
                                    });
                                }}
                                className={
                                    currentPage >= totalPages
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

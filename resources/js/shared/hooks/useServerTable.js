import { router } from "@inertiajs/react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Server-driven table state for Inertia + Laravel paginated endpoints.
 * Debounces search; uses router.get with preserveState / preserveScroll.
 *
 * @param {object} options
 * @param {string} options.routeName Ziggy route name
 * @param {object} options.filters Current filters from Inertia props
 * @param {number} [options.searchDebounceMs=400]
 * @param {string[]} [options.preserveQueryKeys] — extra filter keys (e.g. `role`) kept on pagination/sort unless overridden in `visit`.
 */
export function useServerTable({
    routeName,
    filters,
    searchDebounceMs = 400,
    preserveQueryKeys = [],
}) {
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState(filters?.search ?? "");

    const filtersRef = useRef(filters);

    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync search input with server filters after Inertia navigation
        setSearchInput(filters?.search ?? "");
    }, [filters?.search]);

    const buildQuery = useCallback(
        (params = {}) => {
            const f = filtersRef.current ?? {};
            const query = {
                page: params.page ?? 1,
                search: Object.prototype.hasOwnProperty.call(params, "search")
                    ? params.search || undefined
                    : f.search || undefined,
                sort_by: params.sort_by ?? f.sort_by,
                sort_dir: params.sort_dir ?? f.sort_dir,
                per_page: params.per_page ?? f.per_page,
            };
            for (const k of preserveQueryKeys) {
                if (Object.prototype.hasOwnProperty.call(params, k)) {
                    const v = params[k];
                    query[k] =
                        v === "" ||
                        v === null ||
                        v === undefined ||
                        v === "all"
                            ? undefined
                            : v;
                } else if (
                    f[k] != null &&
                    f[k] !== "" &&
                    f[k] !== "all"
                ) {
                    query[k] = f[k];
                }
            }
            return query;
        },
        [preserveQueryKeys],
    );

    const visit = useCallback(
        (params = {}) => {
            setLoading(true);
            router.get(route(routeName), buildQuery(params), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setLoading(false),
            });
        },
        [routeName, buildQuery],
    );

    useEffect(() => {
        const handle = setTimeout(() => {
            const q = String(searchInput ?? "").trim();
            const current = String(filtersRef.current?.search ?? "").trim();
            if (q === current) {
                return;
            }
            visit(
                buildQuery({
                    page: 1,
                    search: q || undefined,
                }),
            );
        }, searchDebounceMs);

        return () => clearTimeout(handle);
    }, [searchInput, searchDebounceMs, visit, buildQuery]);

    return {
        loading,
        searchInput,
        setSearchInput,
        visit,
    };
}

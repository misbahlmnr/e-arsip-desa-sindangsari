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
 */
export function useServerTable({
    routeName,
    filters,
    searchDebounceMs = 400,
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

    const visit = useCallback(
        (params) => {
            setLoading(true);
            router.get(route(routeName), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onFinish: () => setLoading(false),
            });
        },
        [routeName],
    );

    useEffect(() => {
        const handle = setTimeout(() => {
            const q = String(searchInput ?? "").trim();
            const current = String(filtersRef.current?.search ?? "").trim();
            if (q === current) {
                return;
            }
            visit({
                page: 1,
                search: q || undefined,
                sort_by: filtersRef.current?.sort_by,
                sort_dir: filtersRef.current?.sort_dir,
                per_page: filtersRef.current?.per_page,
            });
        }, searchDebounceMs);

        return () => clearTimeout(handle);
    }, [searchInput, searchDebounceMs, visit]);

    return {
        loading,
        searchInput,
        setSearchInput,
        visit,
    };
}

const LIST_PARAM = "list";

function pageUrl(href) {
    return new URL(href, window.location.origin);
}

function currentListUrl() {
    return window.location.pathname + window.location.search;
}

function toPath(url) {
    return url.pathname + url.search + url.hash;
}

/**
 * Salin URL daftar saat ini (path + query) ke parameter `list` pada href tujuan.
 *
 * @param {string} href
 */
export function withListState(href) {
    const url = pageUrl(href);
    url.searchParams.set(LIST_PARAM, currentListUrl());

    return toPath(url);
}

/**
 * Teruskan parameter `list` yang sudah ada. Tidak membuat parameter baru.
 *
 * @param {string} href
 */
export function carryListState(href) {
    const list = new URLSearchParams(window.location.search).get(LIST_PARAM);

    if (!list) {
        return href;
    }

    const url = pageUrl(href);
    url.searchParams.set(LIST_PARAM, list);

    return toPath(url);
}

/**
 * Pakai URL di parameter `list` hanya bila path-nya sama dengan href daftar.
 *
 * @param {string} fallbackHref
 */
export function resolveListBackHref(fallbackHref) {
    const list = new URLSearchParams(window.location.search).get(LIST_PARAM);

    if (!list) {
        return fallbackHref;
    }

    let listUrl;

    try {
        listUrl = new URL(list, window.location.origin);
    } catch {
        return fallbackHref;
    }

    if (listUrl.origin !== window.location.origin) {
        return fallbackHref;
    }

    const fallback = pageUrl(fallbackHref);

    if (listUrl.pathname !== fallback.pathname) {
        return fallbackHref;
    }

    return toPath(listUrl);
}

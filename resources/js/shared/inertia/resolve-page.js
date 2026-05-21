import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const pages = import.meta.glob('../../features/**/pages/**/*.jsx');

/**
 * Map Laravel Inertia page name to feature file path.
 * Convention: "{feature}/{Page}" → features/{feature}/pages/{Page}.jsx
 *
 * @example surat-masuk/Index → ../../features/surat-masuk/pages/Index.jsx
 */
export function toFeaturePagePath(name) {
    const [feature, ...rest] = name.split('/');

    if (!feature || rest.length === 0) {
        throw new Error(
            `Invalid Inertia page name "${name}". Expected format: feature/Page (e.g. surat-masuk/Index).`,
        );
    }

    return `../../features/${feature}/pages/${rest.join('/')}.jsx`;
}

export function resolvePage(name) {
    return resolvePageComponent(toFeaturePagePath(name), pages);
}

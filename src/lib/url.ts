/** Prefix an internal URL with Astro's configured base path. */
export function sitePath(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalizedPath}` || '/';
}

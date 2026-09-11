import type { CollectionEntry, CollectionKey } from 'astro:content';
import { sitePath } from './url';

export type SiteCollection = 'blog' | 'guides' | 'projects';
export type ContentEntry = CollectionEntry<SiteCollection>;

export function isVisible(entry: ContentEntry): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}

export function byNewest(a: ContentEntry, b: ContentEntry): number {
  return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
}

export function visibleEntries<T extends CollectionKey>(
  entries: CollectionEntry<T>[],
): CollectionEntry<T>[] {
  return entries
    .filter((entry) => import.meta.env.DEV || !entry.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function entryPath(collection: SiteCollection, id: string): string {
  return sitePath(`/${collection}/${id}/`);
}

export function prettyCollection(collection: SiteCollection): string {
  return collection === 'blog'
    ? 'Blog'
    : collection === 'guides'
      ? 'Guide'
      : 'Project';
}

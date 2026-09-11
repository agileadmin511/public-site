import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { visibleEntries } from '../lib/content';

export async function GET() {
  const posts = visibleEntries(await getCollection('blog'));
  const feedSite = new URL(`${SITE.basePath.replace(/\/$/, '')}/`, SITE.url);

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: feedSite,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}

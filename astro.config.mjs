import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkGfm from 'remark-gfm';
import { SITE } from './src/config.ts';

export default defineConfig({
  site: SITE.url,
  base: SITE.basePath,
  output: 'static',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({ remarkPlugins: [remarkGfm] }),
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
});

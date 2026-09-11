import { SITE } from '../config';
import { sitePath } from '../lib/url';

export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL(sitePath('/sitemap-index.xml'), SITE.url)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}

import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';

const output = path.resolve('dist');
const deployedBaseUrl = 'https://agileadmin511.github.io/public-site/';
const requiredFiles = [
  'index.html',
  'about/index.html',
  'blog/index.html',
  'blog/understanding-linux-namespaces/index.html',
  'guides/linux-networking/index.html',
  'projects/static-field-notes/index.html',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
];

test('representative routes and publishing files are generated', async () => {
  await Promise.all(
    requiredFiles.map((file) => access(path.join(output, file))),
  );
});

test('draft routes are absent from production', async () => {
  await assert.rejects(
    access(path.join(output, 'blog/draft-example/index.html')),
  );
  const [index, rss, sitemap] = await Promise.all([
    readFile(path.join(output, 'blog/index.html'), 'utf8'),
    readFile(path.join(output, 'rss.xml'), 'utf8'),
    readFile(path.join(output, 'sitemap-0.xml'), 'utf8'),
  ]);
  for (const document of [index, rss, sitemap]) {
    assert.doesNotMatch(document, /draft-example/i);
  }
});

test('pages contain required metadata and remain JavaScript-free', async () => {
  const html = await readFile(
    path.join(output, 'blog/understanding-linux-namespaces/index.html'),
    'utf8',
  );
  assert.match(
    html,
    /<title>Understanding Linux namespaces · Systems Field Notes<\/title>/,
  );
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<link rel="canonical"/);
  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta name="twitter:card"/);
  assert.match(
    html,
    /href="https:\/\/agileadmin511\.github\.io\/public-site\/blog\/understanding-linux-namespaces\/"/,
  );
  assert.match(html, /href="\/public-site\/_astro\//);
  assert.match(html, /href="\/public-site\/blog\/"/);
  assert.doesNotMatch(html, /(?:href|src)="\/(?!public-site\/)/);
  assert.doesNotMatch(html, /<script\b/i);
});

test('RSS contains published posts', async () => {
  const rss = await readFile(path.join(output, 'rss.xml'), 'utf8');
  assert.match(rss, /Understanding Linux namespaces/);
  assert.match(rss, /<rss\b/);
  assert.match(rss, new RegExp(`<link>${deployedBaseUrl}`));
  assert.match(
    rss,
    /https:\/\/agileadmin511\.github\.io\/public-site\/blog\/understanding-linux-namespaces\//,
  );
});

test('discovery files advertise the deployed project path', async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(path.join(output, 'robots.txt'), 'utf8'),
    readFile(path.join(output, 'sitemap-0.xml'), 'utf8'),
  ]);
  assert.match(robots, new RegExp(`${deployedBaseUrl}sitemap-index\\.xml`));
  assert.match(sitemap, new RegExp(`<loc>${deployedBaseUrl}`));
});

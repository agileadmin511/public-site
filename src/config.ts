export const SITE = {
  name: 'Systems Field Notes',
  shortName: 'SFN',
  tagline: 'Infrastructure · Software · Engineering',
  description:
    'Practical notes on building, operating, and understanding software systems.',
  url: 'https://agileadmin511.github.io',
  basePath: '/public-site',
  author: 'Your Name',
  githubUrl: 'https://github.com/agileadmin511/public-site',
  navigation: [
    { href: '/blog/', label: 'Blog' },
    { href: '/guides/', label: 'Guides' },
    { href: '/projects/', label: 'Projects' },
    { href: '/about/', label: 'About' },
  ],
} as const;

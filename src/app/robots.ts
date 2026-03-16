import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: [
      'https://news24sofia.eu/sitemap.xml',
      'https://news24sofia.eu/sitemap-news.xml',
    ],
  };
}

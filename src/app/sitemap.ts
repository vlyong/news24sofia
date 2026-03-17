import { MetadataRoute } from 'next';
import { fetchAPI, GET_POST_SLUGS } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://news24sofia.eu';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/category/krimi',
    '/category/politics',
    '/category/community',
    '/category/world',
    '/category/sport',
    '/category/exclusive',
    '/category/regioni',
    '/category/sofiya',
    '/category/news24',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'always' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Article Routes
  let articleRoutes: any[] = [];
  try {
    const data = await fetchAPI(GET_POST_SLUGS);
    const posts = data?.posts?.nodes || [];
    
    articleRoutes = posts.map((post: any) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(post.modified || post.date || new Date()),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching slugs for sitemap:', error);
  }

  return [...staticRoutes, ...articleRoutes];
}

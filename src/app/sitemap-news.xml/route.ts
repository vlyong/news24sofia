import { fetchAPI, GET_RECENT_NEWS } from '@/lib/api';

export async function GET() {
  const baseUrl = 'https://news24sofia.eu';
  const data = await fetchAPI(GET_RECENT_NEWS);
  const posts = data?.posts?.nodes || [];

  // Filter posts from the last 48 hours
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentPosts = posts.filter((post: any) => new Date(post.date) >= fortyEightHoursAgo);

  // If no posts in last 48h, take at least the last 10 for the sitemap to not be empty
  const postsToDisplay = recentPosts.length > 0 ? recentPosts : posts.slice(0, 10);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${postsToDisplay
    .map((post: any) => {
      const title = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      return `
  <url>
    <loc>${baseUrl}/article/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>News24Sofia</news:name>
        <news:language>bg</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=600',
    },
  });
}

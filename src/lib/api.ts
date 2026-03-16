export async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers: { [key: string]: string } = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }
  return json.data;
}

export const GET_ALL_POSTS = `
  query GetAllPosts {
    posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($id: ID!, $idType: PostIdType!) {
    post(id: $id, idType: $idType) {
      id
      title
      content
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($categoryName: String!) {
    posts(first: 20, where: { categoryName: $categoryName, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories(first: 100) {
      nodes {
        name
        slug
        count
      }
    }
  }
`;
export const GET_SEARCH_RESULTS = `
  query GetSearchResults($searchTerm: String!) {
    posts(first: 20, where: { search: $searchTerm, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_SLUGS = `
  query GetPostSlugs {
    posts(first: 100) {
      nodes {
        slug
        modified
        date
      }
    }
  }
`;

export const GET_RECENT_NEWS = `
  query GetRecentNews {
    posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        title
        slug
        date
      }
    }
  }
`;

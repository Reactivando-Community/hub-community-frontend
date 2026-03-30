/**
 * Server-side GraphQL fetch utility for SSR metadata generation.
 * This bypasses Apollo Client (which requires browser context) and makes
 * direct fetch requests to the GraphQL BFF.
 */

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hubcommunity.io';

/**
 * Generates the OG image URL for social media previews.
 * Always proxies images through our /api/og-image route so that
 * social media crawlers (WhatsApp, Instagram, Facebook) can reliably
 * access the image from our domain — avoiding CORS/firewall issues
 * with the CMS domain.
 */
export function getOgImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) return `${SITE_URL}/images/logo-square.png`;

  // Always proxy through our API route for reliable social preview
  const fullUrl = imageUrl.startsWith('http')
    ? imageUrl
    : `${SITE_URL}${imageUrl}`;

  return `${SITE_URL}/api/og-image?url=${encodeURIComponent(fullUrl)}`;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      console.error(`GraphQL fetch failed: ${response.status}`);
      return null;
    }

    const json: GraphQLResponse<T> = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
    }

    return json.data || null;
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    return null;
  }
}

// ── Event metadata query ──────────────────────────────────────────────
export const EVENT_METADATA_QUERY = `
  query GetEventBySlugOrId($slugOrId: String!) {
    eventBySlugOrId(slugOrId: $slugOrId) {
      id
      slug
      title
      description
      start_date
      end_date
      images
      communities {
        title
      }
      location {
        title
        city
      }
    }
  }
`;

export interface EventMetadataResponse {
  eventBySlugOrId: {
    id: string;
    slug: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    images: string[];
    communities: Array<{ title: string }>;
    location?: {
      title?: string;
      city?: string;
    };
  } | null;
}

// ── Community metadata query ──────────────────────────────────────────
export const COMMUNITY_METADATA_QUERY = `
  query GetCommunityBySlugOrId($slugOrId: String!) {
    communityBySlugOrId(slugOrId: $slugOrId) {
      id
      slug
      title
      short_description
      members_quantity
      images
      tags {
        value
      }
    }
  }
`;

export interface CommunityMetadataResponse {
  communityBySlugOrId: {
    id: string;
    slug: string;
    title: string;
    short_description: string;
    members_quantity: number;
    images: string[];
    tags: Array<{ value: string }>;
  } | null;
}

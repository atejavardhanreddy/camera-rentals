import { corsOptions, corsJson, corsError } from '@/lib/cors';
import { getCategories } from '@/lib/data';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  try {
    const categories = await getCategories();
    return corsJson(categories, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } });
  } catch (error) {
    console.error('Error fetching categories API:', error);
    return corsError('Failed to fetch categories', 500);
  }
}

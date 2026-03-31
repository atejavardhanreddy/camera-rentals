import { corsOptions, corsJson, corsError } from '@/lib/cors';
import { getAllBrands } from '@/lib/data';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  try {
    const brands = await getAllBrands();
    return corsJson(brands, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } });
  } catch (error) {
    console.error('Error fetching brands API:', error);
    return corsError('Failed to fetch brands', 500);
  }
}

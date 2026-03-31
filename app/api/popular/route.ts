import { corsOptions, corsJson, corsError } from '@/lib/cors';
import { getPopularEquipmentForArea } from '@/lib/data';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET() {
  try {
    const equipment = await getPopularEquipmentForArea(10);
    return corsJson(equipment, { headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' } });
  } catch (error) {
    console.error('Error fetching popular equipment:', error);
    return corsError('Failed to fetch popular equipment', 500);
  }
}

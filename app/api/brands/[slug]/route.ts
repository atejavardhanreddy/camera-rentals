import { NextRequest } from 'next/server';
import { getEquipmentByBrand } from '@/lib/data';
import { corsOptions, corsJson, corsError } from '@/lib/cors';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const equipment = await getEquipmentByBrand(slug);
    return corsJson(equipment, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } });
  } catch (error) {
    console.error(`Error fetching equipment for brand ${slug}:`, error);
    return corsError('Failed to fetch equipment', 500);
  }
}

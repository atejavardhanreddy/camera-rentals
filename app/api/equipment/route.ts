import { NextRequest } from 'next/server';
import { getAllEquipment, getFeaturedEquipment, getEquipmentByBrand, getPopularEquipmentForArea } from '@/lib/data';
import { corsOptions, corsJson, corsError } from '@/lib/cors';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const featured = searchParams.get('featured');
  const brand = searchParams.get('brand');
  const popular = searchParams.get('popular');
  const isKit = searchParams.get('isKit');

  try {
    let result;
    if (featured === 'true') {
      result = await getFeaturedEquipment();
    } else if (brand) {
      result = await getEquipmentByBrand(brand);
    } else if (popular === 'true') {
      result = await getPopularEquipmentForArea(10);
    } else {
      result = await getAllEquipment(
        categoryId ? parseInt(categoryId) : undefined,
        isKit ? isKit === 'true' : undefined
      );
    }
    return corsJson(result, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } });
  } catch (error) {
    console.error('Error fetching equipment API:', error);
    return corsError('Failed to fetch equipment', 500);
  }
}

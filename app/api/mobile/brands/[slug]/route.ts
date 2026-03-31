import { NextRequest, NextResponse } from 'next/server';
import { getEquipmentByBrand } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const brandName = params.slug;
    const equipment = await getEquipmentByBrand(brandName);
    return NextResponse.json(equipment);
  } catch (error) {
    console.error(`Error fetching equipment for brand ${params.slug}:`, error);
    return NextResponse.json({ error: 'Failed to fetch equipment' }, { status: 500 });
  }
}

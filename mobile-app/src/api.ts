import { Category, Equipment } from './types';

export const API_BASE = 'https://rentals.penmenstudios.com/api';

// Wrapper that applies a timeout to any fetch call
async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchFeaturedEquipment = async (): Promise<Equipment[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/equipment?featured=true`);
  if (!response.ok) throw new Error('Failed to fetch featured equipment');
  return response.json();
};

export const fetchAllEquipment = async (categoryId?: number): Promise<Equipment[]> => {
  let url = `${API_BASE}/equipment`;
  if (categoryId) {
    url += `?categoryId=${categoryId}`;
  }
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error('Failed to fetch equipment');
  return response.json();
};

export const fetchEquipmentDetails = async (slug: string): Promise<Equipment> => {
  const response = await fetchWithTimeout(`${API_BASE}/equipment/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch equipment details');
  return response.json();
};

export const fetchBrands = async (): Promise<string[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/brands`);
  if (!response.ok) throw new Error('Failed to fetch brands');
  return response.json();
};

export const fetchEquipmentByBrand = async (brandSlug: string): Promise<Equipment[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/brands/${encodeURIComponent(brandSlug)}`);
  if (!response.ok) throw new Error('Failed to fetch equipment for brand');
  return response.json();
};

export const fetchPopularEquipment = async (): Promise<Equipment[]> => {
  const response = await fetchWithTimeout(`${API_BASE}/popular`);
  if (!response.ok) throw new Error('Failed to fetch popular equipment');
  return response.json();
};

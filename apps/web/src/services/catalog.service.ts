import { apiRequest } from '@/lib/api';
import { ProductDto, CategoryDto } from '@theblinghaven/shared';
import productsManifest from '@/data/products-manifest.json';

export interface CatalogFilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  hallmark?: string;
  search?: string;
}

// In-memory runtime cache
let cachedProducts: ProductDto[] | null = null;
let cachedCategories: CategoryDto[] | null = null;

export const defaultCategories: CategoryDto[] = [
  {
    id: 'cat-rings',
    name: 'Solitaire Rings',
    slug: 'rings',
    description: 'AAA+ CZ & lab solitaires in 18K yellow and white gold.',
    imageUrl: '/uploads/rings_15ca97c8_1s6a0175.jpg',
    isActive: true,
    displayOrder: 1,
    productCount: 42,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-bridal-sets',
    name: 'Royal Bridal Sets',
    slug: 'bridal-sets',
    description: 'Magnificent bridal sets with uncut polki and emeralds.',
    imageUrl: '/uploads/sets_5621e16b_1s6a9422.jpg',
    isActive: true,
    displayOrder: 2,
    productCount: 38,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-earrings',
    name: 'Fine Statement Earrings',
    slug: 'earrings',
    description: 'Chandelier drops, chandbalis, and diamond studs.',
    imageUrl: '/uploads/earrings_01462b03_1s6a0431.jpg',
    isActive: true,
    displayOrder: 3,
    productCount: 65,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-bangles',
    name: 'Heritage Bangles & Kadas',
    slug: 'bangles',
    description: '22K micro gold plated bridal bangles with safety clasps.',
    imageUrl: '/uploads/bangles_0deb44c0_1s6a9953.jpg',
    isActive: true,
    displayOrder: 4,
    productCount: 54,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-artisan-silver',
    name: 'Artisan 925 Silver',
    slug: 'artisan-silver',
    description: 'Hand-chiseled 92.5% sterling silver oxidised jewellery.',
    imageUrl: '/uploads/artisan_473a2ce6_1s6a0279.jpg',
    isActive: true,
    displayOrder: 5,
    productCount: 40,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export async function getProducts(params?: CatalogFilterParams): Promise<ProductDto[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') queryParams.set('category', params.category);
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params?.search) queryParams.set('search', params.search);

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const res = await apiRequest<any>(`/catalog/products${queryStr}`);
    const list = Array.isArray(res) ? res : res?.data || [];

    if (list.length > 0) {
      cachedProducts = list;
      return filterAndSortProducts(list, params);
    }
  } catch {
    // Graceful fallback to static manifest
  }

  // Fallback to rich bundled manifest
  const fallbackList = (productsManifest as any[]) || [];
  cachedProducts = fallbackList;
  return filterAndSortProducts(fallbackList, params);
}

export async function getProductBySlug(slug: string): Promise<ProductDto | null> {
  const normalizedSlug = slug.toLowerCase().trim();

  // Try API first
  try {
    const res = await apiRequest<any>(`/catalog/products/${normalizedSlug}`);
    const product = res?.data || res;
    if (product && product.id) return product;
  } catch {
    // Continue to in-memory lookup
  }

  // Check manifest cache
  const list = cachedProducts || (productsManifest as any[]) || [];
  const found = list.find(
    (p: any) =>
      p.slug?.toLowerCase() === normalizedSlug ||
      p.id?.toLowerCase() === normalizedSlug ||
      p.sku?.toLowerCase() === normalizedSlug
  );

  return found || null;
}

export async function getCategories(): Promise<CategoryDto[]> {
  if (cachedCategories) return cachedCategories;

  try {
    const res = await apiRequest<any>('/catalog/categories');
    const list = Array.isArray(res) ? res : res?.data || [];
    if (list.length > 0) {
      cachedCategories = list;
      return list;
    }
  } catch {}

  cachedCategories = defaultCategories;
  return defaultCategories;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductDto[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.isFeatured);
  return featured.length > 0 ? featured.slice(0, limit) : all.slice(0, limit);
}

function filterAndSortProducts(products: ProductDto[], params?: CatalogFilterParams): ProductDto[] {
  let result = [...products];

  if (params?.category && params.category !== 'all') {
    const target = params.category.toLowerCase();
    result = result.filter(
      (p) =>
        (p as any).categorySlug?.toLowerCase() === target ||
        p.categoryId?.toLowerCase() === target ||
        (p.categoryName && p.categoryName.toLowerCase().includes(target))
    );
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (params?.minPrice !== undefined) {
    result = result.filter((p) => p.basePriceUsd >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    result = result.filter((p) => p.basePriceUsd <= params.maxPrice!);
  }

  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.basePriceUsd - b.basePriceUsd);
        break;
      case 'price-desc':
        result.sort((a, b) => b.basePriceUsd - a.basePriceUsd);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  return result;
}

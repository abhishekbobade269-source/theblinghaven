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
    name: 'Rings',
    slug: 'rings',
    description: 'Solitaires, cocktail rings & eternity bands.',
    imageUrl: '/uploads/rings_15ca97c8_1s6a0175.jpg',
    isActive: true,
    displayOrder: 1,
    productCount: 42,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-bridal-sets',
    name: 'Necklaces & Sets',
    slug: 'bridal-sets',
    description: 'Handcrafted chokers, bridal sets & statement necklaces.',
    imageUrl: '/uploads/sets_5621e16b_1s6a9422.jpg',
    isActive: true,
    displayOrder: 2,
    productCount: 38,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Studs, jhumkas, drops & chandeliers.',
    imageUrl: '/uploads/earrings_01462b03_1s6a0431.jpg',
    isActive: true,
    displayOrder: 3,
    productCount: 65,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-bangles',
    name: 'Bangles & Bracelets',
    slug: 'bangles',
    description: 'Traditional kadas, bangles & tennis bracelets.',
    imageUrl: '/uploads/bangles_0deb44c0_1s6a9953.jpg',
    isActive: true,
    displayOrder: 4,
    productCount: 54,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-artisan-silver',
    name: 'Silver Jewellery',
    slug: 'artisan-silver',
    description: '925 sterling silver chains, pendants & daily wear.',
    imageUrl: '/uploads/handmade_2ffa5211_1s6a0379.jpg',
    isActive: true,
    displayOrder: 5,
    productCount: 34,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export function normalizeCategorySlug(rawSlug?: string): string {
  if (!rawSlug) return '';
  const s = rawSlug.toLowerCase().trim();
  if (s === 'bridal' || s === 'bridal-sets' || s === 'bridal-jewellery' || s === 'sets' || s === 'necklaces') {
    return 'bridal-sets';
  }
  if (s === 'silver' || s === 'artisan-silver' || s === 'silver-jewellery' || s === 'artisan' || s === 'handmade') {
    return 'artisan-silver';
  }
  if (s === 'bangles' || s === 'bangle' || s === 'kadas' || s === 'kada' || s === 'bracelets') {
    return 'bangles';
  }
  if (s === 'rings' || s === 'ring') {
    return 'rings';
  }
  if (s === 'earrings' || s === 'earring' || s === 'jhumkas') {
    return 'earrings';
  }
  return s;
}

export async function getProducts(params?: CatalogFilterParams): Promise<ProductDto[]> {
  let apiProducts: ProductDto[] = [];
  try {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      queryParams.set('category', normalizeCategorySlug(params.category));
    }
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params?.search) queryParams.set('search', params.search);

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const res = await apiRequest<any>(`/catalog/products${queryStr}`);
    apiProducts = Array.isArray(res) ? res : res?.data || [];
  } catch {
    // Graceful fallback to static manifest
  }

  // Combine full 300-item rich manifest with any newly seeded/admin products from API
  const manifestList = (productsManifest as any[]) || [];
  const productMap = new Map<string, ProductDto>();

  for (const item of manifestList) {
    const normSlug = normalizeCategorySlug(item.categorySlug || item.categoryId);
    const enrichedItem: ProductDto = {
      ...item,
      categorySlug: normSlug,
      categoryId: normSlug,
    };
    productMap.set(item.slug || item.sku || item.id, enrichedItem);
  }

  for (const item of apiProducts) {
    const rawCat = (item as any).categorySlug || item.categoryId || item.categoryName || '';
    const normSlug = normalizeCategorySlug(rawCat);
    const enrichedItem: ProductDto = {
      ...item,
      categorySlug: normSlug || (item as any).categorySlug,
    };
    productMap.set(item.slug || item.sku || item.id, enrichedItem);
  }

  const combined = Array.from(productMap.values());
  cachedProducts = combined;
  return filterAndSortProducts(combined, params);
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
    const rawTarget = params.category.toLowerCase().trim();
    const normalizedTarget = normalizeCategorySlug(rawTarget);
    const targetWithSpaces = rawTarget.replace(/[-_]/g, ' ');

    result = result.filter((p) => {
      const catSlug = (p as any).categorySlug?.toLowerCase() || '';
      const catId = p.categoryId?.toLowerCase() || '';
      const catName = p.categoryName?.toLowerCase() || '';
      const sku = (p.sku || '').toLowerCase();
      const title = (p.title || '').toLowerCase();

      // 1. Direct match on normalized slug or id
      if (
        catSlug === normalizedTarget ||
        catSlug === rawTarget ||
        catId === normalizedTarget ||
        catId === rawTarget ||
        catName === targetWithSpaces
      ) {
        return true;
      }

      // 2. Specialized semantic category matching
      if (normalizedTarget === 'bridal-sets') {
        return (
          catSlug === 'bridal-sets' ||
          catId === 'bridal-sets' ||
          catName.includes('bridal') ||
          catName.includes('sets') ||
          catName.includes('choker') ||
          catName.includes('necklace') ||
          sku.startsWith('tbh-brd') ||
          sku.includes('-brd-') ||
          title.includes('bridal') ||
          title.includes('choker') ||
          title.includes('necklace') ||
          title.includes('haar')
        );
      }

      if (normalizedTarget === 'artisan-silver') {
        return (
          catSlug === 'artisan-silver' ||
          catId === 'artisan-silver' ||
          catName.includes('silver') ||
          catName.includes('artisan') ||
          catName.includes('handmade') ||
          sku.startsWith('tbh-slv') ||
          sku.includes('-slv-') ||
          title.includes('silver') ||
          title.includes('filigree') ||
          title.includes('tribal') ||
          title.includes('oxidised')
        );
      }

      if (normalizedTarget === 'bangles') {
        return (
          catSlug === 'bangles' ||
          catId === 'bangles' ||
          catName.includes('bangle') ||
          catName.includes('kada') ||
          sku.startsWith('tbh-ban') ||
          sku.includes('-ban-') ||
          title.includes('bangle') ||
          title.includes('kada') ||
          title.includes('bracelet')
        );
      }

      if (normalizedTarget === 'rings') {
        return (
          catSlug === 'rings' ||
          catId === 'rings' ||
          catName.includes('ring') ||
          sku.startsWith('tbh-rng') ||
          sku.includes('-rng-') ||
          title.includes('ring') ||
          title.includes('solitaire') ||
          title.includes('band')
        );
      }

      if (normalizedTarget === 'earrings') {
        return (
          catSlug === 'earrings' ||
          catId === 'earrings' ||
          catName.includes('earring') ||
          catName.includes('jhumka') ||
          sku.startsWith('tbh-ear') ||
          sku.includes('-ear-') ||
          title.includes('earring') ||
          title.includes('jhumka') ||
          title.includes('stud') ||
          title.includes('chandbali')
        );
      }

      return catName.includes(targetWithSpaces) || catName.includes(rawTarget);
    });
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

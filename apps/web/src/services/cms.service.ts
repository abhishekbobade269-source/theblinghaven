import { apiRequest } from '@/lib/api';
import { HeroBannerDto, PageControlDto, InstagramPostDto } from '@theblinghaven/shared';
export type { HeroBannerDto, PageControlDto, InstagramPostDto };
import cmsManifest from '@/data/cms-manifest.json';

// In-memory runtime cache for 0ms route checks and zero storage pollution
const pageControlCache = new Map<string, PageControlDto>();
let cachedBanners: HeroBannerDto[] | null = null;
let cachedInstagramPosts: InstagramPostDto[] | null = null;

// Pre-populate with bundled manifest on module load
if (cmsManifest?.pageControls) {
  (cmsManifest.pageControls as any[]).forEach((p) => {
    if (p.pageRoute) pageControlCache.set(p.pageRoute, p);
  });
}

export async function getPageControl(route: string): Promise<PageControlDto> {
  const normalized = route.endsWith('/') && route.length > 1 ? route.slice(0, -1) : route;

  // Return from memory cache if available
  if (pageControlCache.has(normalized)) {
    return pageControlCache.get(normalized)!;
  }

  try {
    const res = await apiRequest<any>(`/cms/page-controls/route?path=${encodeURIComponent(normalized)}`);
    const data = res?.data || res;
    if (data && data.pageRoute) {
      pageControlCache.set(normalized, data);
      return data;
    }
  } catch {}

  const fallback: PageControlDto = {
    id: `pc_${normalized.replace(/[^a-z0-9]/gi, '_')}`,
    pageRoute: normalized,
    pageTitle: 'The Bling Haven Canada',
    pageType: 'CORE_SYSTEM',
    status: 'ACTIVE',
    hideFromNavigation: false,
    productIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  pageControlCache.set(normalized, fallback);
  return fallback;
}

export async function getAllPageControls(): Promise<PageControlDto[]> {
  try {
    const res = await apiRequest<any>('/cms/page-controls');
    const list = Array.isArray(res) ? res : res?.data || [];
    if (list.length > 0) {
      list.forEach((p: PageControlDto) => {
        if (p.pageRoute) pageControlCache.set(p.pageRoute, p);
      });
      return list;
    }
  } catch {}

  return Array.from(pageControlCache.values());
}

const DEFAULT_HERO_BANNERS: HeroBannerDto[] = [
  {
    id: 'banner-1',
    title: 'Haute Joaillerie & Royal Kundan Heirlooms',
    subtitle: 'Handcrafted AAA+ Solitaires, 22K Micro Gold Plated Bridal Chokers & Fine Jewelry in Toronto.',
    imageUrl: '/uploads/sets_5621e16b_1s6a9422.jpg',
    ctaText: 'Explore Collection',
    ctaLink: '/catalog',
    badgeText: 'Maison Heritage 2026',
    isActive: true,
    displayOrder: 1,
    alignment: 'LEFT',
    createdAt: '2026-08-15T12:00:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
  {
    id: 'banner-2',
    title: 'Solitaire Statement Rings & Precious Bands',
    subtitle: 'Anti-tarnish 18K solid gold prong settings with certified hallmarked brilliance.',
    imageUrl: '/uploads/rings_15ca97c8_1s6a0175.jpg',
    ctaText: 'Shop Solitaires',
    ctaLink: '/rings',
    badgeText: 'Trending Masterpiece',
    isActive: true,
    displayOrder: 2,
    alignment: 'LEFT',
    createdAt: '2026-08-15T12:00:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
  {
    id: 'banner-3',
    title: 'Austrian Crystal & Heritage Kadas',
    subtitle: 'Artisanal bridal jewels engineered for eternal luster and sacred ceremonies.',
    imageUrl: '/uploads/earrings_d696144e_1s6a9783.jpg',
    ctaText: 'View All Parures',
    ctaLink: '/catalog',
    badgeText: 'Toronto Atelier',
    isActive: true,
    displayOrder: 3,
    alignment: 'LEFT',
    createdAt: '2026-08-15T12:00:00.000Z',
    updatedAt: '2026-08-15T12:00:00.000Z',
  },
];

export async function getHeroBanners(): Promise<HeroBannerDto[]> {
  if (cachedBanners && cachedBanners.length > 0) return cachedBanners;

  try {
    const res = await apiRequest<any>('/admin/cms/banners');
    const list = Array.isArray(res) ? res : res?.data || [];
    if (list.length > 0) {
      cachedBanners = list;
      return list;
    }
  } catch {}

  const fallback: HeroBannerDto[] =
    (cmsManifest as any).heroBanners?.length > 0 ? (cmsManifest as any).heroBanners : DEFAULT_HERO_BANNERS;
  cachedBanners = fallback;
  return fallback;
}

export function getCachedHeroBannersSync(): HeroBannerDto[] {
  return cachedBanners && cachedBanners.length > 0 ? cachedBanners : DEFAULT_HERO_BANNERS;
}

export async function getInstagramPosts(): Promise<InstagramPostDto[]> {
  if (cachedInstagramPosts && cachedInstagramPosts.length > 0) return cachedInstagramPosts;

  try {
    const res = await apiRequest<any>('/admin/cms/instagram-feed');
    const list = Array.isArray(res) ? res : res?.data || [];
    if (list.length > 0) {
      cachedInstagramPosts = list;
      return list;
    }
  } catch {}

  cachedInstagramPosts = (cmsManifest.instagramPosts as any[]) || [];
  return cachedInstagramPosts;
}

export function getCachedPageControlSync(route: string): PageControlDto | null {
  const normalized = route.endsWith('/') && route.length > 1 ? route.slice(0, -1) : route;
  return pageControlCache.get(normalized) || null;
}

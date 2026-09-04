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

  cachedBanners = (cmsManifest.heroBanners as any[]) || [];
  return cachedBanners;
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

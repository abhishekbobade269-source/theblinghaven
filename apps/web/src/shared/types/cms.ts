export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface CmsPageDto {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string; // Markdown or rich HTML / structured JSON blocks
  seoTitle?: string;
  seoDescription?: string;
  status: PageStatus;
  publishedAt?: string;
  updatedAt: string;
  createdAt: string;
}

export interface HeroBannerDto {
  id: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  alignment: 'LEFT' | 'CENTER' | 'RIGHT';
  createdAt: string;
  updatedAt: string;
}

export interface CreateCmsPageDto {
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: PageStatus;
}

export interface UpdateCmsPageDto {
  title?: string;
  subtitle?: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: PageStatus;
}

export interface CreateHeroBannerDto {
  title: string;
  subtitle?: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  alignment?: 'LEFT' | 'CENTER' | 'RIGHT';
}

export interface UpdateHeroBannerDto {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
  alignment?: 'LEFT' | 'CENTER' | 'RIGHT';
}

export interface PageControlDto {
  id: string;
  pageRoute: string;
  pageTitle: string;
  pageType: string;
  status: 'ACTIVE' | 'COMING_SOON' | 'UNDER_MAINTENANCE' | 'ON_HOLD' | 'DISABLED';
  customHeadline?: string | null;
  customSubtext?: string | null;
  heroBannerUrl?: string | null;
  badgeText?: string | null;
  productIds?: string[] | string;
  hideFromNavigation?: boolean;
  estimatedReturnAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstagramPostDto {
  id: string;
  mediaType: string;
  mediaUrl: string;
  permalink?: string;
  caption?: string;
  likes?: number;
  views?: number;
  comments?: number;
  createdAt?: string;
}

export interface InstagramConfigDto {
  id: string;
  username?: string;
  accountName?: string;
  followersCount?: number;
  isLiveConnected?: boolean;
  autoSyncEnabled?: boolean;
}

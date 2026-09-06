export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'ARCHIVED';

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export interface CollectionDto {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  heroBannerUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

export interface JewelrySpecsDto {
  metalType: string;         // e.g. "18K Gold", "22K Gold", "925 Silver"
  metalPurity: string;       // e.g. "18K (750)", "22K (916)"
  metalColor: string;        // e.g. "Yellow Gold", "White Gold", "Rose Gold"
  grossWeightGrams: number;  // Total weight
  netWeightGrams: number;    // Gold weight only
  diamondWeightCarats?: number;
  diamondColor?: string;     // D, E, F, G, H
  diamondClarity?: string;   // FL, IF, VVS1, VVS2, VS1, VS2
  diamondCut?: string;       // Ideal, Excellent, Very Good
  gemstoneDetails?: string;  // e.g. "Burmese Ruby 1.2ct", "Colombian Emerald 0.8ct"
  hallmarkCertificate?: string; // e.g. "BIS Hallmarked", "GIA Certified #748291"
  ringSize?: string;         // e.g. "US 6.5"
  bangleSize?: string;       // e.g. "2.4"
}

export interface ProductDto {
  id: string;
  sku: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  basePriceUsd: number;
  comparePriceUsd?: number;
  costPriceUsd?: number;
  categoryId: string;
  categorySlug?: string;
  categoryName?: string;
  collectionId?: string;
  collectionSlug?: string;
  collectionName?: string;
  specs: JewelrySpecsDto;
  primaryImageUrl: string;
  galleryImages: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  status: ProductStatus;
  isFeatured: boolean;
  isBestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  sku: string;
  title: string;
  slug?: string;
  subtitle?: string;
  description: string;
  basePriceUsd: number;
  comparePriceUsd?: number;
  costPriceUsd?: number;
  categoryId: string;
  collectionId?: string;
  specs: JewelrySpecsDto;
  primaryImageUrl: string;
  galleryImages?: string[];
  stockQuantity?: number;
  lowStockThreshold?: number;
  status?: ProductStatus;
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export interface UpdateProductDto {
  sku?: string;
  title?: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  basePriceUsd?: number;
  comparePriceUsd?: number;
  costPriceUsd?: number;
  categoryId?: string;
  collectionId?: string;
  specs?: Partial<JewelrySpecsDto>;
  primaryImageUrl?: string;
  galleryImages?: string[];
  stockQuantity?: number;
  lowStockThreshold?: number;
  status?: ProductStatus;
  isFeatured?: boolean;
  isBestseller?: boolean;
}

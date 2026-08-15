export type MediaCategory =
  | 'BANGLES'
  | 'BRIDAL'
  | 'EARRINGS'
  | 'RINGS'
  | 'HANDMADE'
  | 'SETS'
  | 'BANNERS'
  | 'GENERAL';

export interface MediaAssetDto {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  category: MediaCategory;
  altText?: string;
  tags: string[];
  createdAt: string;
}

export interface UploadMediaResponseDto {
  asset: MediaAssetDto;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { MediaAssetDto, MediaCategory, AuditEventType } from '@theblinghaven/shared';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(params: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: MediaAssetDto[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const page = Number(params.page) || 1;
    const limit = Math.min(Number(params.limit) || 24, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.category && params.category !== 'ALL') {
      where.category = params.category;
    }
    if (params.search) {
      where.OR = [
        { originalName: { contains: params.search } },
        { filename: { contains: params.search } },
        { altText: { contains: params.search } },
        { tags: { contains: params.search } },
      ];
    }

    const [total, assets] = await Promise.all([
      this.prisma.mediaAsset.count({ where }),
      this.prisma.mediaAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const data: MediaAssetDto[] = assets.map((a) => ({
      id: a.id,
      filename: a.filename,
      originalName: a.originalName,
      url: a.url,
      thumbnailUrl: a.thumbnailUrl || a.url,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
      width: a.width || undefined,
      height: a.height || undefined,
      category: a.category as MediaCategory,
      altText: a.altText || undefined,
      tags: a.tags ? JSON.parse(a.tags) : [],
      createdAt: a.createdAt.toISOString(),
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<MediaAssetDto> {
    const a = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });
    if (!a) {
      throw new NotFoundException('Media asset not found.');
    }
    return {
      id: a.id,
      filename: a.filename,
      originalName: a.originalName,
      url: a.url,
      thumbnailUrl: a.thumbnailUrl || a.url,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
      width: a.width || undefined,
      height: a.height || undefined,
      category: a.category as MediaCategory,
      altText: a.altText || undefined,
      tags: a.tags ? JSON.parse(a.tags) : [],
      createdAt: a.createdAt.toISOString(),
    };
  }

  async create(data: {
    filename: string;
    originalName: string;
    url: string;
    thumbnailUrl?: string;
    mimeType: string;
    sizeBytes: number;
    width?: number;
    height?: number;
    category?: MediaCategory;
    altText?: string;
    tags?: string[];
    actorId?: string;
  }): Promise<MediaAssetDto> {
    const asset = await this.prisma.mediaAsset.create({
      data: {
        filename: data.filename,
        originalName: data.originalName,
        url: data.url,
        thumbnailUrl: data.thumbnailUrl || data.url,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        width: data.width,
        height: data.height,
        category: data.category || 'GENERAL',
        altText: data.altText,
        tags: JSON.stringify(data.tags || ['jewelry', 'upload']),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.MEDIA_ASSET_UPLOADED,
      userId: data.actorId,
      resourceType: 'MediaAsset',
      resourceId: asset.id,
      metadata: { filename: asset.filename, size: asset.sizeBytes },
    });

    return this.findOne(asset.id);
  }

  async delete(id: string, actorId?: string): Promise<void> {
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Media asset not found.');
    }

    await this.prisma.mediaAsset.delete({ where: { id } });

    await this.auditService.log({
      eventType: AuditEventType.MEDIA_ASSET_DELETED,
      userId: actorId,
      resourceType: 'MediaAsset',
      resourceId: id,
      metadata: { filename: asset.filename },
    });
  }
}

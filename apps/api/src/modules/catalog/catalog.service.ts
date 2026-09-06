import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  CategoryDto,
  CollectionDto,
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  ProductStatus,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // ---------------- CATEGORIES ----------------

  async findAllCategories(): Promise<CategoryDto[]> {
    const cats = await this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return cats.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || undefined,
      imageUrl: c.imageUrl || undefined,
      parentId: c.parentId,
      displayOrder: c.displayOrder,
      isActive: c.isActive,
      productCount: c._count.products,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  // ---------------- COLLECTIONS ----------------

  async findAllCollections(): Promise<CollectionDto[]> {
    const cols = await this.prisma.collection.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });

    return cols.map((col) => ({
      id: col.id,
      name: col.name,
      slug: col.slug,
      tagline: col.tagline || undefined,
      description: col.description || undefined,
      heroBannerUrl: col.heroBannerUrl || undefined,
      isFeatured: col.isFeatured,
      displayOrder: col.displayOrder,
      isActive: col.isActive,
      productCount: col._count.products,
      createdAt: col.createdAt.toISOString(),
    }));
  }

  // ---------------- PRODUCTS ----------------

  async findAllProducts(params: {
    search?: string;
    categoryId?: string;
    collectionId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ProductDto[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const page = Number(params.page) || 1;
    const limit = Math.min(Number(params.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.categoryId && params.categoryId !== 'ALL') {
      where.OR = [
        { categoryId: params.categoryId },
        { category: { slug: params.categoryId } },
      ];
    }
    if (params.collectionId && params.collectionId !== 'ALL') {
      where.OR = [
        { collectionId: params.collectionId },
        { collection: { slug: params.collectionId } },
      ];
    }
    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }
    if (params.search) {
      where.OR = [
        { title: { contains: params.search } },
        { sku: { contains: params.search } },
        { description: { contains: params.search } },
      ];
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          collection: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const data: ProductDto[] = products.map((p) => ({
      id: p.id,
      sku: p.sku,
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle || undefined,
      description: p.description,
      basePriceUsd: p.basePriceUsd,
      comparePriceUsd: p.comparePriceUsd || undefined,
      costPriceUsd: p.costPriceUsd || undefined,
      categoryId: p.categoryId,
      categorySlug: p.category?.slug,
      categoryName: p.category?.name,
      collectionId: p.collectionId || undefined,
      collectionName: p.collection?.name,
      specs: JSON.parse(p.specs),
      primaryImageUrl: p.primaryImageUrl,
      galleryImages: JSON.parse(p.galleryImages || '[]'),
      stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      status: p.status as ProductStatus,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
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

  async findProductById(id: string): Promise<ProductDto> {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true, slug: true } },
        collection: { select: { name: true, slug: true } },
      },
    });

    if (!p) {
      throw new NotFoundException('Jewelry product not found.');
    }

    return {
      id: p.id,
      sku: p.sku,
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle || undefined,
      description: p.description,
      basePriceUsd: p.basePriceUsd,
      comparePriceUsd: p.comparePriceUsd || undefined,
      costPriceUsd: p.costPriceUsd || undefined,
      categoryId: p.categoryId,
      categorySlug: p.category?.slug,
      categoryName: p.category?.name,
      collectionId: p.collectionId || undefined,
      collectionName: p.collection?.name,
      specs: JSON.parse(p.specs),
      primaryImageUrl: p.primaryImageUrl,
      galleryImages: JSON.parse(p.galleryImages || '[]'),
      stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      status: p.status as ProductStatus,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  async findProductBySlug(slug: string): Promise<ProductDto> {
    const p = await this.prisma.product.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        category: { select: { name: true, slug: true } },
        collection: { select: { name: true, slug: true } },
      },
    });

    if (!p) {
      throw new NotFoundException(`Product '${slug}' not found.`);
    }

    return {
      id: p.id,
      sku: p.sku,
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle || undefined,
      description: p.description,
      basePriceUsd: p.basePriceUsd,
      comparePriceUsd: p.comparePriceUsd || undefined,
      costPriceUsd: p.costPriceUsd || undefined,
      categoryId: p.categoryId,
      categoryName: p.category?.name,
      collectionId: p.collectionId || undefined,
      collectionName: p.collection?.name,
      specs: JSON.parse(p.specs),
      primaryImageUrl: p.primaryImageUrl,
      galleryImages: JSON.parse(p.galleryImages || '[]'),
      stockQuantity: p.stockQuantity,
      lowStockThreshold: p.lowStockThreshold,
      status: p.status as ProductStatus,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }

  async createProduct(dto: CreateProductDto, actorId?: string): Promise<ProductDto> {
    const sku = dto.sku.toUpperCase().trim();
    const slug = dto.slug || dto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await this.prisma.product.findFirst({
      where: { OR: [{ sku }, { slug }] },
    });
    if (existing) {
      throw new ConflictException('A product with this SKU or slug already exists.');
    }

    const product = await this.prisma.product.create({
      data: {
        sku,
        title: dto.title.trim(),
        slug,
        subtitle: dto.subtitle?.trim(),
        description: dto.description,
        basePriceUsd: dto.basePriceUsd,
        comparePriceUsd: dto.comparePriceUsd,
        costPriceUsd: dto.costPriceUsd,
        categoryId: dto.categoryId,
        collectionId: dto.collectionId,
        specs: JSON.stringify(dto.specs),
        primaryImageUrl: dto.primaryImageUrl,
        galleryImages: JSON.stringify(dto.galleryImages || [dto.primaryImageUrl]),
        stockQuantity: dto.stockQuantity ?? 1,
        lowStockThreshold: dto.lowStockThreshold ?? 1,
        status: dto.status || 'ACTIVE',
        isFeatured: dto.isFeatured ?? false,
        isBestseller: dto.isBestseller ?? false,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.CATALOG_PRODUCT_CREATED,
      userId: actorId,
      resourceType: 'Product',
      resourceId: product.id,
      metadata: { sku: product.sku, title: product.title, price: product.basePriceUsd },
    });

    return this.findProductById(product.id);
  }

  async updateProduct(id: string, dto: UpdateProductDto, actorId?: string): Promise<ProductDto> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found.');
    }

    let updatedSpecs = existing.specs;
    if (dto.specs) {
      const currentSpecs = JSON.parse(existing.specs);
      updatedSpecs = JSON.stringify({ ...currentSpecs, ...dto.specs });
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.subtitle !== undefined && { subtitle: dto.subtitle?.trim() }),
        ...(dto.description && { description: dto.description }),
        ...(dto.basePriceUsd !== undefined && { basePriceUsd: dto.basePriceUsd }),
        ...(dto.comparePriceUsd !== undefined && { comparePriceUsd: dto.comparePriceUsd }),
        ...(dto.costPriceUsd !== undefined && { costPriceUsd: dto.costPriceUsd }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.collectionId !== undefined && { collectionId: dto.collectionId }),
        ...(dto.specs && { specs: updatedSpecs }),
        ...(dto.primaryImageUrl && { primaryImageUrl: dto.primaryImageUrl }),
        ...(dto.galleryImages && { galleryImages: JSON.stringify(dto.galleryImages) }),
        ...(dto.stockQuantity !== undefined && { stockQuantity: dto.stockQuantity }),
        ...(dto.lowStockThreshold !== undefined && { lowStockThreshold: dto.lowStockThreshold }),
        ...(dto.status && { status: dto.status }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
        ...(dto.isBestseller !== undefined && { isBestseller: dto.isBestseller }),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.CATALOG_PRODUCT_UPDATED,
      userId: actorId,
      resourceType: 'Product',
      resourceId: updated.id,
      metadata: { sku: updated.sku, changes: dto },
    });

    return this.findProductById(updated.id);
  }

  async deleteProduct(id: string, actorId?: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    await this.prisma.product.delete({ where: { id } });

    await this.auditService.log({
      eventType: AuditEventType.CATALOG_PRODUCT_DELETED,
      userId: actorId,
      resourceType: 'Product',
      resourceId: id,
      metadata: { sku: product.sku, title: product.title },
    });
  }
}

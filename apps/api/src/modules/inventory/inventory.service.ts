import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  InventoryItemDto,
  InventoryLogDto,
  AdjustStockDto,
  StockChangeType,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAllInventory(params: {
    search?: string;
    lowStockOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: InventoryItemDto[]; meta: { total: number; lowStockCount: number } }> {
    const where: any = {};
    if (params.search) {
      where.OR = [
        { title: { contains: params.search } },
        { sku: { contains: params.search } },
        { vaultLocation: { contains: params.search } },
      ];
    }

    const products = await this.prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    const items: InventoryItemDto[] = products.map((p) => {
      const available = Math.max(0, p.stockQuantity - p.reservedQuantity);
      const isLowStock = available <= p.lowStockThreshold;
      return {
        productId: p.id,
        sku: p.sku,
        title: p.title,
        primaryImageUrl: p.primaryImageUrl,
        categoryName: p.category?.name,
        stockQuantity: p.stockQuantity,
        reservedQuantity: p.reservedQuantity,
        availableQuantity: available,
        lowStockThreshold: p.lowStockThreshold,
        vaultLocation: p.vaultLocation,
        isLowStock,
        status: p.status,
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    const filtered = params.lowStockOnly ? items.filter((i) => i.isLowStock) : items;
    const lowStockCount = items.filter((i) => i.isLowStock).length;

    return {
      data: filtered,
      meta: {
        total: items.length,
        lowStockCount,
      },
    };
  }

  async adjustStock(
    dto: AdjustStockDto,
    actorId?: string,
    actorEmail?: string,
  ): Promise<InventoryItemDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { category: { select: { name: true } } },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    if (dto.newQuantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative.');
    }

    const previousQuantity = product.stockQuantity;
    const quantityChange = dto.newQuantity - previousQuantity;

    const newStatus =
      dto.newQuantity === 0
        ? 'OUT_OF_STOCK'
        : product.status === 'OUT_OF_STOCK'
        ? 'ACTIVE'
        : product.status;

    // Update Product Stock
    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        stockQuantity: dto.newQuantity,
        status: newStatus,
        ...(dto.vaultLocation && { vaultLocation: dto.vaultLocation }),
      },
      include: { category: { select: { name: true } } },
    });

    // Create Immutable Inventory Log
    await this.prisma.inventoryLog.create({
      data: {
        productId: product.id,
        sku: product.sku,
        productTitle: product.title,
        changeType: dto.changeType,
        quantityChange,
        previousQuantity,
        newQuantity: dto.newQuantity,
        reason: dto.reason,
        actorId,
        actorEmail: actorEmail || 'Admin Actor',
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.INVENTORY_ADJUSTED,
      userId: actorId,
      userEmail: actorEmail,
      resourceType: 'Inventory',
      resourceId: product.id,
      metadata: {
        sku: product.sku,
        changeType: dto.changeType,
        quantityChange,
        previous: previousQuantity,
        new: dto.newQuantity,
        reason: dto.reason,
      },
    });

    const available = Math.max(0, updated.stockQuantity - updated.reservedQuantity);
    return {
      productId: updated.id,
      sku: updated.sku,
      title: updated.title,
      primaryImageUrl: updated.primaryImageUrl,
      categoryName: updated.category?.name,
      stockQuantity: updated.stockQuantity,
      reservedQuantity: updated.reservedQuantity,
      availableQuantity: available,
      lowStockThreshold: updated.lowStockThreshold,
      vaultLocation: updated.vaultLocation,
      isLowStock: available <= updated.lowStockThreshold,
      status: updated.status,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async getLogs(productId?: string): Promise<InventoryLogDto[]> {
    const where = productId ? { productId } : {};
    const logs = await this.prisma.inventoryLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return logs.map((l) => ({
      id: l.id,
      productId: l.productId,
      sku: l.sku,
      productTitle: l.productTitle,
      changeType: l.changeType as StockChangeType,
      quantityChange: l.quantityChange,
      previousQuantity: l.previousQuantity,
      newQuantity: l.newQuantity,
      reason: l.reason,
      actorId: l.actorId || undefined,
      actorEmail: l.actorEmail || undefined,
      createdAt: l.createdAt.toISOString(),
    }));
  }
}

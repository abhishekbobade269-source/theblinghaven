import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  PromotionDto,
  PromotionType,
  CreatePromotionDto,
  ValidateCouponDto,
  CouponValidationResultDto,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(): Promise<PromotionDto[]> {
    const promos = await this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return promos.map((p) => this.mapPromotion(p));
  }

  async findById(id: string): Promise<PromotionDto> {
    const p = await this.prisma.promotion.findUnique({ where: { id } });
    if (!p) {
      throw new NotFoundException('Promotion not found.');
    }
    return this.mapPromotion(p);
  }

  async create(dto: CreatePromotionDto, actorId?: string): Promise<PromotionDto> {
    const code = dto.code.toUpperCase().trim();
    const existing = await this.prisma.promotion.findUnique({ where: { code } });
    if (existing) {
      throw new ConflictException(`Promotion code '${code}' already exists.`);
    }

    const promo = await this.prisma.promotion.create({
      data: {
        code,
        name: dto.name.trim(),
        description: dto.description?.trim(),
        type: dto.type,
        value: dto.value,
        minPurchaseAmountUsd: dto.minPurchaseAmountUsd,
        maxDiscountAmountUsd: dto.maxDiscountAmountUsd,
        vipTierRequired: dto.vipTierRequired,
        categoryId: dto.categoryId,
        collectionId: dto.collectionId,
        usageLimit: dto.usageLimit,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.PROMOTION_CREATED,
      userId: actorId,
      resourceType: 'Promotion',
      resourceId: promo.id,
      metadata: { code: promo.code, value: promo.value, type: promo.type },
    });

    return this.mapPromotion(promo);
  }

  async delete(id: string, actorId?: string): Promise<void> {
    const promo = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promo) {
      throw new NotFoundException('Promotion not found.');
    }

    await this.prisma.promotion.delete({ where: { id } });

    await this.auditService.log({
      eventType: AuditEventType.PROMOTION_DELETED,
      userId: actorId,
      resourceType: 'Promotion',
      resourceId: id,
      metadata: { code: promo.code },
    });
  }

  async validateCoupon(dto: ValidateCouponDto): Promise<CouponValidationResultDto> {
    const code = dto.code.toUpperCase().trim();
    const promo = await this.prisma.promotion.findUnique({ where: { code } });

    if (!promo || !promo.isActive) {
      return {
        isValid: false,
        code,
        discountAmountUsd: 0,
        discountMessage: 'Invalid or inactive promotional code.',
      };
    }

    // Check usage limits
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return {
        isValid: false,
        code,
        discountAmountUsd: 0,
        discountMessage: 'This invitation code has reached its maximum allocation.',
      };
    }

    // Check minimum purchase amount
    if (promo.minPurchaseAmountUsd && dto.cartSubtotalUsd < promo.minPurchaseAmountUsd) {
      return {
        isValid: false,
        code,
        discountAmountUsd: 0,
        discountMessage: `Minimum acquisition order of $${promo.minPurchaseAmountUsd.toLocaleString()} USD required for this privilege.`,
      };
    }

    // Check VIP Tier exclusivity
    if (promo.vipTierRequired) {
      const allowedTiers = promo.vipTierRequired === 'ROYAL_CONCIERGE'
        ? ['ROYAL_CONCIERGE']
        : promo.vipTierRequired === 'GOLD_PATRON'
        ? ['ROYAL_CONCIERGE', 'GOLD_PATRON']
        : ['ROYAL_CONCIERGE', 'GOLD_PATRON', 'SILVER'];

      if (!dto.vipTier || !allowedTiers.includes(dto.vipTier)) {
        return {
          isValid: false,
          code,
          discountAmountUsd: 0,
          discountMessage: `This private invitation is reserved exclusively for ${promo.vipTierRequired.replace('_', ' ')} patrons.`,
        };
      }
    }

    // Calculate discount amount
    let discountAmountUsd = 0;
    if (promo.type === 'PERCENTAGE_OFF') {
      discountAmountUsd = (dto.cartSubtotalUsd * promo.value) / 100;
      if (promo.maxDiscountAmountUsd && discountAmountUsd > promo.maxDiscountAmountUsd) {
        discountAmountUsd = promo.maxDiscountAmountUsd;
      }
    } else if (promo.type === 'FIXED_AMOUNT_OFF') {
      discountAmountUsd = Math.min(promo.value, dto.cartSubtotalUsd);
    } else if (promo.type === 'FREE_ARMORED_SHIPPING') {
      discountAmountUsd = 0; // Armored freight waiver
    }

    return {
      isValid: true,
      code: promo.code,
      discountAmountUsd: Math.round(discountAmountUsd),
      discountMessage: `Privilege applied: ${promo.name}`,
      promotion: this.mapPromotion(promo),
    };
  }

  private mapPromotion(p: any): PromotionDto {
    return {
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description || undefined,
      type: p.type as PromotionType,
      value: p.value,
      minPurchaseAmountUsd: p.minPurchaseAmountUsd || undefined,
      maxDiscountAmountUsd: p.maxDiscountAmountUsd || undefined,
      vipTierRequired: p.vipTierRequired || undefined,
      categoryId: p.categoryId || undefined,
      collectionId: p.collectionId || undefined,
      usageLimit: p.usageLimit || undefined,
      usageCount: p.usageCount,
      startDate: p.startDate ? p.startDate.toISOString() : undefined,
      endDate: p.endDate ? p.endDate.toISOString() : undefined,
      isActive: p.isActive,
      createdAt: p.createdAt.toISOString(),
    };
  }
}

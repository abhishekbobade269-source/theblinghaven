import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  CurrencyRateDto,
  PriceOverrideDto,
  UpdateCurrencyRateDto,
  SetPriceOverrideDto,
  CurrencyConversionResultDto,
  RoundingRule,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class PricingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getAllRates(): Promise<CurrencyRateDto[]> {
    const rates = await this.prisma.currencyRate.findMany({
      orderBy: { currencyCode: 'asc' },
    });

    return rates.map((r) => {
      const effectiveRate = r.rateToUsd * (1 + r.fxBufferPercent / 100);
      return {
        id: r.id,
        currencyCode: r.currencyCode,
        currencyName: r.currencyName,
        symbol: r.symbol,
        rateToUsd: r.rateToUsd,
        fxBufferPercent: r.fxBufferPercent,
        effectiveRate: parseFloat(effectiveRate.toFixed(4)),
        roundingRule: r.roundingRule as RoundingRule,
        isActive: r.isActive,
        updatedAt: r.updatedAt.toISOString(),
      };
    });
  }

  async updateRate(
    currencyCode: string,
    dto: UpdateCurrencyRateDto,
    actorId?: string,
  ): Promise<CurrencyRateDto> {
    const existing = await this.prisma.currencyRate.findUnique({
      where: { currencyCode: currencyCode.toUpperCase() },
    });
    if (!existing) {
      throw new NotFoundException(`Currency '${currencyCode}' not found.`);
    }

    const updated = await this.prisma.currencyRate.update({
      where: { currencyCode: currencyCode.toUpperCase() },
      data: {
        ...(dto.rateToUsd !== undefined && { rateToUsd: dto.rateToUsd }),
        ...(dto.fxBufferPercent !== undefined && { fxBufferPercent: dto.fxBufferPercent }),
        ...(dto.roundingRule && { roundingRule: dto.roundingRule }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.CURRENCY_RATE_UPDATED,
      userId: actorId,
      resourceType: 'CurrencyRate',
      resourceId: updated.currencyCode,
      metadata: { currency: updated.currencyCode, changes: dto },
    });

    const effectiveRate = updated.rateToUsd * (1 + updated.fxBufferPercent / 100);
    return {
      id: updated.id,
      currencyCode: updated.currencyCode,
      currencyName: updated.currencyName,
      symbol: updated.symbol,
      rateToUsd: updated.rateToUsd,
      fxBufferPercent: updated.fxBufferPercent,
      effectiveRate: parseFloat(effectiveRate.toFixed(4)),
      roundingRule: updated.roundingRule as RoundingRule,
      isActive: updated.isActive,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async convert(
    amount: number,
    from: string,
    to: string,
  ): Promise<CurrencyConversionResultDto> {
    const fromCode = from.toUpperCase();
    const toCode = to.toUpperCase();

    const [fromRateRecord, toRateRecord] = await Promise.all([
      fromCode === 'USD' ? null : this.prisma.currencyRate.findUnique({ where: { currencyCode: fromCode } }),
      toCode === 'USD' ? null : this.prisma.currencyRate.findUnique({ where: { currencyCode: toCode } }),
    ]);

    const fromEffective = fromCode === 'USD' ? 1.0 : (fromRateRecord ? fromRateRecord.rateToUsd * (1 + fromRateRecord.fxBufferPercent / 100) : 1.0);
    const toEffective = toCode === 'USD' ? 1.0 : (toRateRecord ? toRateRecord.rateToUsd * (1 + toRateRecord.fxBufferPercent / 100) : 1.0);

    const amountInUsd = amount / fromEffective;
    let converted = amountInUsd * toEffective;

    // Apply Rounding Rule
    const roundingRule = toRateRecord?.roundingRule || 'ROUND_WHOLE_LUXURY';
    if (roundingRule === 'ROUND_WHOLE_LUXURY') {
      converted = Math.round(converted);
    } else if (roundingRule === 'ROUND_99') {
      converted = Math.floor(converted) + 0.99;
    } else {
      converted = parseFloat(converted.toFixed(2));
    }

    const symbol = toRateRecord?.symbol || (toCode === 'USD' ? '$' : toCode);

    return {
      fromCurrency: fromCode,
      toCurrency: toCode,
      originalAmount: amount,
      convertedAmount: converted,
      formattedAmount: `${symbol} ${converted.toLocaleString()}`,
      effectiveRate: parseFloat((toEffective / fromEffective).toFixed(4)),
    };
  }

  async getOverrides(): Promise<PriceOverrideDto[]> {
    const overrides = await this.prisma.priceOverride.findMany({
      include: {
        product: { select: { sku: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return overrides.map((o) => ({
      id: o.id,
      productId: o.productId,
      sku: o.product.sku,
      productTitle: o.product.title,
      currencyCode: o.currencyCode,
      manualPrice: o.manualPrice,
      reason: o.reason || undefined,
      updatedAt: o.updatedAt.toISOString(),
    }));
  }

  async setOverride(dto: SetPriceOverrideDto, actorId?: string): Promise<PriceOverrideDto> {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const override = await this.prisma.priceOverride.upsert({
      where: {
        productId_currencyCode: {
          productId: dto.productId,
          currencyCode: dto.currencyCode.toUpperCase(),
        },
      },
      create: {
        productId: dto.productId,
        sku: product.sku,
        productTitle: product.title,
        currencyCode: dto.currencyCode.toUpperCase(),
        manualPrice: dto.manualPrice,
        reason: dto.reason,
      },
      update: {
        manualPrice: dto.manualPrice,
        reason: dto.reason,
      },
      include: {
        product: { select: { sku: true, title: true } },
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.PRICE_OVERRIDE_UPDATED,
      userId: actorId,
      resourceType: 'PriceOverride',
      resourceId: override.id,
      metadata: { sku: product.sku, currency: dto.currencyCode, price: dto.manualPrice },
    });

    return {
      id: override.id,
      productId: override.productId,
      sku: override.product.sku,
      productTitle: override.product.title,
      currencyCode: override.currencyCode,
      manualPrice: override.manualPrice,
      reason: override.reason || undefined,
      updatedAt: override.updatedAt.toISOString(),
    };
  }

  async deleteOverride(id: string, actorId?: string): Promise<void> {
    const override = await this.prisma.priceOverride.findUnique({ where: { id } });
    if (!override) {
      throw new NotFoundException('Price override not found.');
    }

    await this.prisma.priceOverride.delete({ where: { id } });

    await this.auditService.log({
      eventType: AuditEventType.PRICE_OVERRIDE_DELETED,
      userId: actorId,
      resourceType: 'PriceOverride',
      resourceId: id,
      metadata: { sku: override.sku, currency: override.currencyCode },
    });
  }
}

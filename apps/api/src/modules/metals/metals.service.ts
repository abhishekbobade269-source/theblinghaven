import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { PricingService } from '../pricing/pricing.service';
import {
  MetalPriceRateDto,
  UpdateMetalPriceDto,
  CalculateJewelryPriceDto,
  JewelryPriceBreakdownDto,
  AuditEventType,
  MetalType,
  MetalPurityCode,
} from '@theblinghaven/shared';

@Injectable()
export class MetalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly pricingService: PricingService,
  ) {}

  async findAllRates(): Promise<MetalPriceRateDto[]> {
    const rates = await this.prisma.metalPriceRate.findMany({
      orderBy: { spotPriceUsdPerGram: 'desc' },
    });
    return rates.map((r) => this.mapRate(r));
  }

  async findByPurityCode(purityCode: string): Promise<MetalPriceRateDto> {
    const rate = await this.prisma.metalPriceRate.findUnique({
      where: { purityCode },
    });
    if (!rate) {
      throw new NotFoundException(`Metal purity rate '${purityCode}' not found.`);
    }
    return this.mapRate(rate);
  }

  async updateRate(
    id: string,
    dto: UpdateMetalPriceDto,
    actorId?: string,
    actorEmail?: string,
  ): Promise<MetalPriceRateDto> {
    const existing = await this.prisma.metalPriceRate.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Metal rate with ID '${id}' not found.`);
    }

    const updated = await this.prisma.metalPriceRate.update({
      where: { id },
      data: {
        ...(dto.spotPriceUsdPerGram !== undefined && { spotPriceUsdPerGram: dto.spotPriceUsdPerGram }),
        ...(dto.dailyChangePercent !== undefined && { dailyChangePercent: dto.dailyChangePercent }),
        ...(dto.isMarketOpen !== undefined && { isMarketOpen: dto.isMarketOpen }),
        ...(dto.makingChargesDefaultUsdPerGram !== undefined && {
          makingChargesDefaultUsdPerGram: dto.makingChargesDefaultUsdPerGram,
        }),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.CURRENCY_RATE_UPDATED,
      userId: actorId,
      userEmail: actorEmail,
      resourceType: 'MetalPriceRate',
      resourceId: id,
      metadata: {
        purityCode: updated.purityCode,
        previousSpotUsd: existing.spotPriceUsdPerGram,
        newSpotUsd: updated.spotPriceUsdPerGram,
        dailyChangePercent: updated.dailyChangePercent,
      },
    });

    return this.mapRate(updated);
  }

  async syncLiveMarketRates(): Promise<MetalPriceRateDto[]> {
    const all = await this.prisma.metalPriceRate.findMany();
    for (const r of all) {
      // Subtle realistic tick (+/- 0.15% to 0.35%)
      const deltaPercent = (Math.random() * 0.4 - 0.18);
      const newSpot = Math.round(r.spotPriceUsdPerGram * (1 + deltaPercent / 100) * 100) / 100;
      const newDailyChange = Math.round((r.dailyChangePercent + deltaPercent) * 100) / 100;

      await this.prisma.metalPriceRate.update({
        where: { id: r.id },
        data: {
          spotPriceUsdPerGram: newSpot,
          dailyChangePercent: newDailyChange,
          updatedAt: new Date(),
        },
      });
    }
    return this.findAllRates();
  }

  async calculateBreakdown(dto: CalculateJewelryPriceDto): Promise<JewelryPriceBreakdownDto> {
    const metalRate = await this.findByPurityCode(dto.purityCode);

    // 1. Metal Base Valuation
    const netGrams = dto.netGoldWeightGrams || dto.grossWeightGrams || 10.0;
    const goldBaseValueUsd = Math.round(netGrams * metalRate.spotPriceUsdPerGram * 100) / 100;

    // 2. Craftsmanship Making Charges
    let baseMakingRate = dto.customMakingChargeUsdPerGram || metalRate.makingChargesDefaultUsdPerGram;
    const tierMultiplier =
      dto.craftsmanshipTier === 'ROYAL_HERITAGE'
        ? 2.2
        : dto.craftsmanshipTier === 'MASTER_ARTISAN'
        ? 1.5
        : 1.0;

    const makingChargeRateUsdPerGram = Math.round(baseMakingRate * tierMultiplier * 100) / 100;
    const grossGrams = dto.grossWeightGrams || netGrams;
    const totalMakingChargesUsd = Math.round(grossGrams * makingChargeRateUsdPerGram * 100) / 100;

    // 3. Gemstone & Hallmarking
    const gemstoneValuationUsd = dto.gemstoneValuationUsd || 0;
    const hallmarkingAndCertificationUsd = 150; // BIS 916 laser stamp & GIA dossier

    const estimatedTotalUsd = Math.round(
      goldBaseValueUsd + totalMakingChargesUsd + gemstoneValuationUsd + hallmarkingAndCertificationUsd,
    );

    // 4. Multi-Currency Conversion
    const targetCurrency = dto.currencyCode || 'USD';
    let estimatedTotalLocal = estimatedTotalUsd;
    let formattedTotalLocal = `$ ${estimatedTotalUsd.toLocaleString()}`;

    if (targetCurrency !== 'USD') {
      try {
        const rates = await this.pricingService.getAllRates();
        const r = rates.find((rate) => rate.currencyCode === targetCurrency);
        if (r) {
          const raw = estimatedTotalUsd * r.effectiveRate;
          estimatedTotalLocal = Math.round(raw);
          formattedTotalLocal = `${r.symbol} ${estimatedTotalLocal.toLocaleString()}`;
        }
      } catch {
        // Default to USD formatting
      }
    }

    return {
      purityCode: metalRate.purityCode,
      purityName: metalRate.purityName,
      spotPriceUsdPerGram: metalRate.spotPriceUsdPerGram,
      netGoldWeightGrams: netGrams,
      goldBaseValueUsd,
      gemstoneValuationUsd,
      makingChargeRateUsdPerGram,
      totalMakingChargesUsd,
      hallmarkingAndCertificationUsd,
      estimatedTotalUsd,
      currencyCode: targetCurrency,
      estimatedTotalLocal,
      formattedTotalLocal,
    };
  }

  private mapRate(r: any): MetalPriceRateDto {
    return {
      id: r.id,
      metalType: r.metalType as MetalType,
      purityCode: r.purityCode as MetalPurityCode,
      purityName: r.purityName,
      spotPriceUsdPerGram: r.spotPriceUsdPerGram,
      marketSource: r.marketSource,
      dailyChangePercent: r.dailyChangePercent,
      isMarketOpen: r.isMarketOpen,
      makingChargesDefaultUsdPerGram: r.makingChargesDefaultUsdPerGram,
      updatedAt: r.updatedAt.toISOString(),
    };
  }
}

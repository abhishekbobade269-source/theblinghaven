import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  TaxRuleDto,
  CalculateTaxDto,
  TaxCalculationResultDto,
  UpdateTaxRuleDto,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class TaxesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(): Promise<TaxRuleDto[]> {
    const rules = await this.prisma.taxRule.findMany({
      orderBy: [{ countryCode: 'asc' }, { regionCode: 'asc' }],
    });

    return rules.map((r) => this.mapTaxRule(r));
  }

  async update(id: string, dto: UpdateTaxRuleDto, actorId?: string): Promise<TaxRuleDto> {
    const rule = await this.prisma.taxRule.findUnique({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Tax rule not found.');
    }

    const updated = await this.prisma.taxRule.update({
      where: { id },
      data: {
        ...(dto.taxName && { taxName: dto.taxName }),
        ...(dto.taxRatePercent !== undefined && { taxRatePercent: dto.taxRatePercent }),
        ...(dto.customsDutyPercent !== undefined && { customsDutyPercent: dto.customsDutyPercent }),
        ...(dto.isTaxIncludedInPrice !== undefined && { isTaxIncludedInPrice: dto.isTaxIncludedInPrice }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.TAX_RULE_UPDATED,
      userId: actorId,
      resourceType: 'TaxRule',
      resourceId: updated.id,
      metadata: { country: updated.countryCode, changes: dto },
    });

    return this.mapTaxRule(updated);
  }

  async calculateTax(dto: CalculateTaxDto): Promise<TaxCalculationResultDto> {
    const countryCode = dto.countryCode.toUpperCase().trim();
    const regionCode = dto.regionCode ? dto.regionCode.toUpperCase().trim() : null;

    // Find specific regional rule or fallback to country base rule
    let rule = await this.prisma.taxRule.findFirst({
      where: { countryCode, regionCode, isActive: true },
    });
    if (!rule) {
      rule = await this.prisma.taxRule.findFirst({
        where: { countryCode, regionCode: null, isActive: true },
      });
    }

    const taxName = rule?.taxName || 'International Tax / Duty';
    const countryName = rule?.countryName || countryCode;
    const taxRatePercent = rule?.taxRatePercent || 0.0;
    const customsDutyPercent = rule?.customsDutyPercent || 0.0;
    const isTaxIncludedInPrice = rule?.isTaxIncludedInPrice || false;

    let taxAmountUsd = 0;
    let customsDutyAmountUsd = 0;

    if (!isTaxIncludedInPrice) {
      taxAmountUsd = (dto.subtotalUsd * taxRatePercent) / 100;
    }
    customsDutyAmountUsd = (dto.subtotalUsd * customsDutyPercent) / 100;

    const totalTaxAndDutiesUsd = taxAmountUsd + customsDutyAmountUsd;
    const finalTotalUsd = dto.subtotalUsd + (isTaxIncludedInPrice ? customsDutyAmountUsd : totalTaxAndDutiesUsd);

    // Multi-currency conversion
    const currencyCode = dto.currencyCode || 'USD';
    const rateRecord =
      currencyCode === 'USD'
        ? null
        : await this.prisma.currencyRate.findUnique({ where: { currencyCode } });

    const effectiveRate = rateRecord
      ? rateRecord.rateToUsd * (1 + rateRecord.fxBufferPercent / 100)
      : 1.0;
    const finalTotalLocal = Math.round(finalTotalUsd * effectiveRate);
    const symbol = rateRecord?.symbol || (currencyCode === 'USD' ? '$' : currencyCode);

    return {
      countryCode,
      countryName,
      taxName,
      taxRatePercent,
      taxAmountUsd: Math.round(taxAmountUsd),
      customsDutyPercent,
      customsDutyAmountUsd: Math.round(customsDutyAmountUsd),
      totalTaxAndDutiesUsd: Math.round(totalTaxAndDutiesUsd),
      isTaxIncludedInPrice,
      finalTotalUsd: Math.round(finalTotalUsd),
      currencyCode,
      finalTotalLocal,
      formattedTotalLocal: `${symbol} ${finalTotalLocal.toLocaleString()}`,
    };
  }

  private mapTaxRule(r: any): TaxRuleDto {
    return {
      id: r.id,
      countryCode: r.countryCode,
      countryName: r.countryName,
      regionCode: r.regionCode || undefined,
      taxName: r.taxName,
      taxRatePercent: r.taxRatePercent,
      customsDutyPercent: r.customsDutyPercent,
      isTaxIncludedInPrice: r.isTaxIncludedInPrice,
      isActive: r.isActive,
      notes: r.notes || undefined,
      updatedAt: r.updatedAt.toISOString(),
    };
  }
}

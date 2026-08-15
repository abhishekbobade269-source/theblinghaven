import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  BespokeRequestDto,
  BespokeStatus,
  SubmitBespokeDto,
  UpdateBespokeDto,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class BespokeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(status?: BespokeStatus, category?: string): Promise<BespokeRequestDto[]> {
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const requests = await this.prisma.bespokeRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return requests.map((r) => this.mapBespoke(r));
  }

  async findById(id: string): Promise<BespokeRequestDto> {
    const r = await this.prisma.bespokeRequest.findUnique({ where: { id } });
    if (!r) {
      throw new NotFoundException('Bespoke request not found.');
    }
    return this.mapBespoke(r);
  }

  async submit(dto: SubmitBespokeDto): Promise<BespokeRequestDto> {
    const count = await this.prisma.bespokeRequest.count();
    const referenceNumber = `BESPOKE-2026-${String(count + 1).padStart(3, '0')}`;

    // Lookup customer VIP tier if exists
    const customer = await this.prisma.customer.findUnique({
      where: { email: dto.clientEmail.toLowerCase().trim() },
    });

    const bespoke = await this.prisma.bespokeRequest.create({
      data: {
        referenceNumber,
        clientName: dto.clientName.trim(),
        clientEmail: dto.clientEmail.toLowerCase().trim(),
        clientPhone: dto.clientPhone?.trim(),
        clientCountry: dto.clientCountry.trim(),
        vipTier: customer?.vipTier || undefined,
        category: dto.category,
        metalPreference: dto.metalPreference,
        gemstonePreference: dto.gemstonePreference?.trim(),
        estimatedCaratWeight: dto.estimatedCaratWeight,
        diamondShape: dto.diamondShape?.trim(),
        ringOrWristSize: dto.ringOrWristSize?.trim(),
        engravingText: dto.engravingText?.trim(),
        budgetRangeUsd: dto.budgetRangeUsd,
        inspirationPhotoUrl: dto.inspirationPhotoUrl,
        designBrief: dto.designBrief.trim(),
        status: 'SUBMITTED',
      },
    });

    return this.mapBespoke(bespoke);
  }

  async update(id: string, dto: UpdateBespokeDto, actorId?: string): Promise<BespokeRequestDto> {
    const existing = await this.prisma.bespokeRequest.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Bespoke request not found.');
    }

    const updated = await this.prisma.bespokeRequest.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.assignedGoldsmith && { assignedGoldsmith: dto.assignedGoldsmith }),
        ...(dto.quotedAmountUsd !== undefined && { quotedAmountUsd: dto.quotedAmountUsd }),
        ...(dto.cadRenderUrl && { cadRenderUrl: dto.cadRenderUrl }),
        ...(dto.estimatedCompletionWeeks !== undefined && {
          estimatedCompletionWeeks: dto.estimatedCompletionWeeks,
        }),
        ...(dto.atelierNotes && { atelierNotes: dto.atelierNotes }),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.BESPOKE_REQUEST_UPDATED,
      userId: actorId,
      resourceType: 'BespokeRequest',
      resourceId: updated.id,
      metadata: { status: updated.status, quotedAmountUsd: updated.quotedAmountUsd },
    });

    return this.mapBespoke(updated);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.bespokeRequest.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Bespoke Request not found.');
    await this.prisma.bespokeRequest.delete({ where: { id } });
    return { success: true, message: `Bespoke Commission #${existing.referenceNumber} deleted.` };
  }

  private mapBespoke(r: any): BespokeRequestDto {
    return {
      id: r.id,
      referenceNumber: r.referenceNumber,
      clientName: r.clientName,
      clientEmail: r.clientEmail,
      clientPhone: r.clientPhone || undefined,
      clientCountry: r.clientCountry,
      vipTier: r.vipTier || undefined,
      category: r.category,
      metalPreference: r.metalPreference,
      gemstonePreference: r.gemstonePreference || undefined,
      estimatedCaratWeight: r.estimatedCaratWeight || undefined,
      diamondShape: r.diamondShape || undefined,
      ringOrWristSize: r.ringOrWristSize || undefined,
      engravingText: r.engravingText || undefined,
      budgetRangeUsd: r.budgetRangeUsd,
      inspirationPhotoUrl: r.inspirationPhotoUrl || undefined,
      designBrief: r.designBrief,
      status: r.status as BespokeStatus,
      assignedGoldsmith: r.assignedGoldsmith || undefined,
      quotedAmountUsd: r.quotedAmountUsd || undefined,
      cadRenderUrl: r.cadRenderUrl || undefined,
      estimatedCompletionWeeks: r.estimatedCompletionWeeks || undefined,
      atelierNotes: r.atelierNotes || undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }
}

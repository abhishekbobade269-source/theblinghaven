import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  TryOnOverlayDto,
  TryOnConsultationDto,
  SubmitTryOnConsultationDto,
  JewelryTryOnCategory,
  TryOnAnchorType,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class TryOnService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAllOverlays(category?: string): Promise<TryOnOverlayDto[]> {
    const overlays = await this.prisma.tryOnOverlay.findMany({
      where: category ? { category: category.toUpperCase() } : undefined,
      orderBy: { title: 'asc' },
    });

    return overlays.map((o) => ({
      id: o.id,
      productId: o.productId || undefined,
      sku: o.sku,
      title: o.title,
      category: o.category as JewelryTryOnCategory,
      overlayImageUrl: o.overlayImageUrl,
      defaultScale: o.defaultScale,
      defaultRotation: o.defaultRotation,
      anchorType: o.anchorType as TryOnAnchorType,
      sparkleRefractionEnabled: o.sparkleRefractionEnabled,
      basePriceCad: o.basePriceCad,
    }));
  }

  async submitConsultation(dto: SubmitTryOnConsultationDto): Promise<TryOnConsultationDto> {
    const consultation = await this.prisma.tryOnConsultation.create({
      data: {
        clientName: dto.clientName,
        clientEmail: dto.clientEmail,
        clientPhone: dto.clientPhone || null,
        productSku: dto.productSku,
        productTitle: dto.productTitle,
        category: dto.category,
        scaleApplied: dto.scaleApplied || 1.0,
        rotationApplied: dto.rotationApplied || 0.0,
        skinToneSelected: dto.skinToneSelected || 'WARM_OLIVE',
        capturedLookImageUrl: dto.capturedLookImageUrl || null,
        preferredSalon: dto.preferredSalon || 'Toronto Yorkville Haute Salon',
        notes: dto.notes || null,
        status: 'PENDING_ADVISOR_REVIEW',
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userEmail: dto.clientEmail,
      resourceType: 'TryOnConsultation',
      resourceId: consultation.id,
      metadata: {
        clientName: dto.clientName,
        productSku: dto.productSku,
        preferredSalon: dto.preferredSalon,
      },
    });

    return this.mapConsultation(consultation);
  }

  async findAllConsultations(): Promise<TryOnConsultationDto[]> {
    const list = await this.prisma.tryOnConsultation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map((c) => this.mapConsultation(c));
  }

  async updateConsultationStatus(id: string, status: string): Promise<TryOnConsultationDto> {
    const existing = await this.prisma.tryOnConsultation.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Consultation request not found.');
    }

    const updated = await this.prisma.tryOnConsultation.update({
      where: { id },
      data: { status },
    });

    return this.mapConsultation(updated);
  }

  private mapConsultation(c: any): TryOnConsultationDto {
    return {
      id: c.id,
      clientName: c.clientName,
      clientEmail: c.clientEmail,
      clientPhone: c.clientPhone || undefined,
      productSku: c.productSku,
      productTitle: c.productTitle,
      category: c.category as JewelryTryOnCategory,
      scaleApplied: c.scaleApplied,
      rotationApplied: c.rotationApplied,
      skinToneSelected: c.skinToneSelected,
      capturedLookImageUrl: c.capturedLookImageUrl || undefined,
      preferredSalon: c.preferredSalon,
      notes: c.notes || undefined,
      status: c.status as any,
      createdAt: c.createdAt.toISOString(),
    };
  }
}

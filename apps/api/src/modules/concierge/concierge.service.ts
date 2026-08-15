import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  ConciergeInquiryDto,
  InquiryType,
  InquiryStatus,
  CreateInquiryDto,
  UpdateInquiryDto,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class ConciergeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(type?: InquiryType, status?: InquiryStatus): Promise<ConciergeInquiryDto[]> {
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const inquiries = await this.prisma.conciergeInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return inquiries.map((i) => this.mapInquiry(i));
  }

  async findById(id: string): Promise<ConciergeInquiryDto> {
    const i = await this.prisma.conciergeInquiry.findUnique({ where: { id } });
    if (!i) {
      throw new NotFoundException('Inquiry not found.');
    }
    return this.mapInquiry(i);
  }

  async create(dto: CreateInquiryDto): Promise<ConciergeInquiryDto> {
    // Check if customer is registered VIP
    const customer = await this.prisma.customer.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    const inquiry = await this.prisma.conciergeInquiry.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone?.trim(),
        country: dto.country.trim(),
        vipTier: customer?.vipTier || undefined,
        type: dto.type,
        status: 'NEW',
        subject: dto.subject.trim(),
        message: dto.message.trim(),
        preferredSalonLocation: dto.preferredSalonLocation?.trim(),
        preferredAppointmentDate: dto.preferredAppointmentDate
          ? new Date(dto.preferredAppointmentDate)
          : null,
      },
    });

    return this.mapInquiry(inquiry);
  }

  async update(id: string, dto: UpdateInquiryDto, actorId?: string): Promise<ConciergeInquiryDto> {
    const existing = await this.prisma.conciergeInquiry.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Inquiry not found.');
    }

    const updated = await this.prisma.conciergeInquiry.update({
      where: { id },
      data: {
        ...(dto.status && { status: dto.status }),
        ...(dto.assignedAdvisor && { assignedAdvisor: dto.assignedAdvisor }),
        ...(dto.internalNotes && { internalNotes: dto.internalNotes }),
        ...(dto.preferredAppointmentDate && {
          preferredAppointmentDate: new Date(dto.preferredAppointmentDate),
        }),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.CONCIERGE_INQUIRY_UPDATED,
      userId: actorId,
      resourceType: 'ConciergeInquiry',
      resourceId: updated.id,
      metadata: { status: updated.status, assignedAdvisor: updated.assignedAdvisor },
    });

    return this.mapInquiry(updated);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.conciergeInquiry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Inquiry not found.');
    await this.prisma.conciergeInquiry.delete({ where: { id } });
    return { success: true, message: `Inquiry #${id} deleted successfully.` };
  }

  private mapInquiry(i: any): ConciergeInquiryDto {
    return {
      id: i.id,
      fullName: i.fullName,
      email: i.email,
      phone: i.phone || undefined,
      country: i.country,
      vipTier: i.vipTier || undefined,
      type: i.type as InquiryType,
      status: i.status as InquiryStatus,
      subject: i.subject,
      message: i.message,
      preferredSalonLocation: i.preferredSalonLocation || undefined,
      preferredAppointmentDate: i.preferredAppointmentDate
        ? i.preferredAppointmentDate.toISOString()
        : undefined,
      assignedAdvisor: i.assignedAdvisor || undefined,
      internalNotes: i.internalNotes || undefined,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
    };
  }
}

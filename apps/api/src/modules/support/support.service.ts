import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  SupportTicketDto,
  TicketResponseDto,
  CreateTicketDto,
  AddTicketResponseDto,
  UpdateTicketStatusDto,
  TicketCategory,
  TicketPriority,
  TicketStatus,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class SupportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async createTicket(dto: CreateTicketDto): Promise<SupportTicketDto> {
    const seq = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `TBH-TKT-2026-${seq}`;

    const ticket = await this.prisma.supportTicket.create({
      data: {
        ticketNumber,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        category: dto.category,
        priority: dto.priority || 'STANDARD',
        status: 'OPEN',
        subject: dto.subject,
        description: dto.description,
        relatedOrderNumber: dto.relatedOrderNumber,
        relatedProductSku: dto.relatedProductSku,
      },
      include: {
        responses: { orderBy: { timestamp: 'asc' } },
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userEmail: dto.customerEmail,
      resourceType: 'SupportTicket',
      resourceId: ticket.id,
      metadata: { ticketNumber: ticket.ticketNumber, category: dto.category },
    });

    return this.mapTicket(ticket);
  }

  async getTicketByNumber(ticketNumber: string): Promise<SupportTicketDto> {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { ticketNumber },
      include: {
        responses: {
          where: { isInternalNote: false },
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket '${ticketNumber}' was not found in our client registry.`);
    }

    return this.mapTicket(ticket);
  }

  async getAllTicketsAdmin(status?: string, category?: string, priority?: string): Promise<SupportTicketDto[]> {
    const where: any = {};
    if (status && status !== 'ALL') where.status = status;
    if (category && category !== 'ALL') where.category = category;
    if (priority && priority !== 'ALL') where.priority = priority;

    const tickets = await this.prisma.supportTicket.findMany({
      where,
      include: {
        responses: { orderBy: { timestamp: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tickets.map((t) => this.mapTicket(t));
  }

  async getTicketByIdAdmin(id: string): Promise<SupportTicketDto> {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id },
      include: {
        responses: { orderBy: { timestamp: 'asc' } },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found.');
    }

    return this.mapTicket(ticket);
  }

  async addTicketResponseByNumberOrId(idOrNumber: string, dto: AddTicketResponseDto): Promise<SupportTicketDto> {
    let ticket = await this.prisma.supportTicket.findUnique({ where: { id: idOrNumber } });
    if (!ticket) {
      ticket = await this.prisma.supportTicket.findUnique({ where: { ticketNumber: idOrNumber } });
    }
    if (!ticket) {
      throw new NotFoundException('Ticket not found.');
    }

    await this.prisma.ticketResponse.create({
      data: {
        ticketId: ticket.id,
        senderRole: dto.senderRole,
        senderName: dto.senderName,
        message: dto.message,
        isInternalNote: dto.isInternalNote || false,
      },
    });

    const updated = await this.prisma.supportTicket.update({
      where: { id: ticket.id },
      data: {
        status: dto.statusUpdate || (dto.senderRole === 'SUPPORT_AGENT' ? 'WAITING_CLIENT' : 'IN_REVIEW'),
      },
      include: {
        responses: { orderBy: { timestamp: 'asc' } },
      },
    });

    return this.mapTicket(updated);
  }

  async addTicketResponse(id: string, dto: AddTicketResponseDto): Promise<SupportTicketDto> {
    return this.addTicketResponseByNumberOrId(id, dto);
  }

  async updateTicketStatus(id: string, dto: UpdateTicketStatusDto): Promise<SupportTicketDto> {
    const existing = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Ticket not found.');
    }

    const updated = await this.prisma.supportTicket.update({
      where: { id },
      data: {
        status: dto.status,
        assignedAgent: dto.assignedAgent || existing.assignedAgent,
        staffNotes: dto.staffNotes || existing.staffNotes,
      },
      include: {
        responses: { orderBy: { timestamp: 'asc' } },
      },
    });

    return this.mapTicket(updated);
  }

  async deleteTicket(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.prisma.supportTicket.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Ticket not found.');
    }

    await this.prisma.ticketResponse.deleteMany({ where: { ticketId: id } });
    await this.prisma.supportTicket.delete({ where: { id } });
    return { success: true, message: `Support Ticket #${existing.ticketNumber} permanently deleted.` };
  }

  private mapTicket(t: any): SupportTicketDto {
    return {
      id: t.id,
      ticketNumber: t.ticketNumber,
      customerName: t.customerName,
      customerEmail: t.customerEmail,
      customerPhone: t.customerPhone || undefined,
      category: t.category as TicketCategory,
      priority: t.priority as TicketPriority,
      status: t.status as TicketStatus,
      subject: t.subject,
      description: t.description,
      relatedOrderNumber: t.relatedOrderNumber || undefined,
      relatedProductSku: t.relatedProductSku || undefined,
      assignedAgent: t.assignedAgent || undefined,
      staffNotes: t.staffNotes || undefined,
      responses: (t.responses || []).map((r: any) => ({
        id: r.id,
        ticketId: r.ticketId,
        senderRole: r.senderRole as 'CLIENT' | 'SUPPORT_AGENT',
        senderName: r.senderName,
        message: r.message,
        isInternalNote: r.isInternalNote,
        timestamp: r.timestamp.toISOString(),
      })),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  }
}

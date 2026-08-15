import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditEventType, AuditLogDto } from '@theblinghaven/shared';

export interface CreateAuditLogParams {
  eventType: AuditEventType;
  userId?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  metadata?: Record<string, any> | null;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: CreateAuditLogParams): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          eventType: params.eventType,
          userId: params.userId || null,
          userEmail: params.userEmail || null,
          userRole: params.userRole || null,
          ipAddress: params.ipAddress || null,
          userAgent: params.userAgent || null,
          resourceType: params.resourceType || null,
          resourceId: params.resourceId || null,
          metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        },
      });

      this.logger.log(
        `[AUDIT] ${params.eventType} - Actor: ${params.userEmail || 'System'} - Resource: ${
          params.resourceType || 'None'
        }:${params.resourceId || 'N/A'}`,
      );
    } catch (error) {
      this.logger.error('Failed to create audit log entry:', error);
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    eventType?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: AuditLogDto[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const page = Number(params.page) || 1;
    const limit = Math.min(Number(params.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.eventType) {
      where.eventType = params.eventType;
    }
    if (params.userId) {
      where.userId = params.userId;
    }
    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    const [total, records] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const data: AuditLogDto[] = records.map((r) => ({
      id: r.id,
      eventType: r.eventType as AuditEventType,
      userId: r.userId,
      userEmail: r.userEmail,
      userRole: r.userRole,
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      resourceType: r.resourceType,
      resourceId: r.resourceId,
      metadata: r.metadata ? JSON.parse(r.metadata) : null,
      createdAt: r.createdAt.toISOString(),
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
}

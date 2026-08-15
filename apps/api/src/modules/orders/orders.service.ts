import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  OrderDto,
  OrderItemDto,
  OrderTimelineDto,
  OrderStatus,
  PaymentStatus,
  ShippingCarrier,
  CreateOrderDto,
  UpdateOrderStatusDto,
  AuditEventType,
} from '@theblinghaven/shared';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(params: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: OrderDto[]; meta: { total: number; totalRevenueUsd: number } }> {
    const where: any = {};
    if (params.status && params.status !== 'ALL') {
      where.status = params.status;
    }
    if (params.search) {
      where.OR = [
        { orderNumber: { contains: params.search } },
        { customerName: { contains: params.search } },
        { customerEmail: { contains: params.search } },
        { trackingNumber: { contains: params.search } },
      ];
    }

    const [total, orders, aggregateRevenue] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
          timeline: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmountUsd: true },
      }),
    ]);

    const data: OrderDto[] = orders.map((o) => this.mapOrder(o));

    return {
      data,
      meta: {
        total,
        totalRevenueUsd: aggregateRevenue._sum.totalAmountUsd || 0,
      },
    };
  }

  async findById(id: string): Promise<OrderDto> {
    const o = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!o) {
      throw new NotFoundException('Luxury jewelry order not found.');
    }

    return this.mapOrder(o);
  }

  async createOrder(dto: CreateOrderDto, actorId?: string): Promise<OrderDto> {
    const customer = await this.prisma.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) {
      throw new NotFoundException('Customer not found.');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one jewelry piece.');
    }

    // Fetch products
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    const prodMap = new Map(products.map((p) => [p.id, p]));

    let subtotalUsd = 0;
    const orderItemsData = dto.items.map((item) => {
      const p = prodMap.get(item.productId);
      if (!p) {
        throw new NotFoundException(`Product ${item.productId} not found.`);
      }
      const itemTotal = p.basePriceUsd * item.quantity;
      subtotalUsd += itemTotal;

      const specs = JSON.parse(p.specs || '{}');
      return {
        productId: p.id,
        sku: p.sku,
        title: p.title,
        primaryImageUrl: p.primaryImageUrl,
        quantity: item.quantity,
        unitPriceUsd: p.basePriceUsd,
        totalPriceUsd: itemTotal,
        selectedRingSize: item.selectedRingSize || specs.ringSize,
        selectedBangleSize: item.selectedBangleSize || specs.bangleSize,
        customEngraving: item.customEngraving,
        hallmarkCertificate: specs.hallmarkCertificate,
      };
    });

    const currencyCode = dto.currencyCode || 'USD';
    const currencyRate =
      currencyCode === 'USD'
        ? null
        : await this.prisma.currencyRate.findUnique({ where: { currencyCode } });

    const effectiveRate = currencyRate
      ? currencyRate.rateToUsd * (1 + currencyRate.fxBufferPercent / 100)
      : 1.0;
    const totalAmountLocal = Math.round(subtotalUsd * effectiveRate);
    const currencySymbol = currencyRate?.symbol || (currencyCode === 'USD' ? '$' : currencyCode);

    const orderNumber = `TBH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerVipTier: customer.vipTier,
        status: 'PENDING_VERIFICATION',
        paymentStatus: 'PAID',
        paymentMethod: dto.paymentMethod || 'CREDIT_CARD_VAULT',
        currencyCode,
        currencySymbol,
        totalAmountUsd: subtotalUsd,
        totalAmountLocal,
        subtotalUsd,
        shippingAddress: JSON.stringify(dto.shippingAddress),
        customerNotes: dto.customerNotes,
        items: {
          create: orderItemsData,
        },
        timeline: {
          create: {
            status: 'PENDING_VERIFICATION',
            notes: 'Order placed and locked in private checkout vault.',
            actorEmail: customer.email,
          },
        },
      },
      include: {
        items: true,
        timeline: true,
      },
    });

    // Update Customer Spend Accumulator
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSpendUsd: customer.totalSpendUsd + subtotalUsd,
        totalOrdersCount: customer.totalOrdersCount + 1,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userId: actorId,
      resourceType: 'Order',
      resourceId: order.id,
      metadata: { orderNumber: order.orderNumber, totalUsd: subtotalUsd },
    });

    return this.mapOrder(order);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    actorId?: string,
    actorEmail?: string,
  ): Promise<OrderDto> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.shippingCarrier && { shippingCarrier: dto.shippingCarrier }),
        ...(dto.trackingNumber && { trackingNumber: dto.trackingNumber }),
        ...(dto.deliverySignatureName && { deliverySignatureName: dto.deliverySignatureName }),
      },
    });

    // Add Timeline Step
    await this.prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        status: dto.status,
        notes: dto.notes || `Order status moved to ${dto.status}.`,
        actorEmail: actorEmail || 'Concierge Operations',
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userId: actorId,
      userEmail: actorEmail,
      resourceType: 'Order',
      resourceId: order.id,
      metadata: {
        orderNumber: order.orderNumber,
        previousStatus: order.status,
        newStatus: dto.status,
        notes: dto.notes,
      },
    });

    return this.findById(order.id);
  }

  async checkoutStorefrontOrder(data: any): Promise<OrderDto> {
    // 1. Find or create customer
    let customer = await this.prisma.customer.findUnique({
      where: { email: data.customerEmail },
    });

    if (!customer) {
      const nameParts = (data.customerName || 'Private Client').split(' ');
      const firstName = nameParts[0] || 'Private';
      const lastName = nameParts.slice(1).join(' ') || 'Client';

      customer = await this.prisma.customer.create({
        data: {
          email: data.customerEmail,
          firstName,
          lastName,
          phone: data.customerPhone || null,
          vipTier: data.customerVipTier || 'STANDARD',
          country: data.shippingAddress?.country || 'International',
          city: data.shippingAddress?.city || null,
          totalSpendUsd: 0,
          totalOrdersCount: 0,
        },
      });
    }

    // 2. Generate Order Number
    const orderCount = await this.prisma.order.count();
    const orderNumber = `TBH-2026-${(8800 + orderCount + 1).toString().padStart(4, '0')}`;

    const currencySymbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED',
      INR: '₹',
      CAD: 'C$',
      AUD: 'A$',
      SGD: 'S$',
    };

    const currencySymbol = currencySymbols[data.currencyCode] || '$';

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        customerVipTier: data.customerVipTier || customer.vipTier,
        status: 'VAULT_ALLOCATION_PENDING',
        paymentStatus: 'PAID',
        paymentMethod: 'WHITE_GLOVE_CHECKOUT',
        currencyCode: data.currencyCode || 'USD',
        currencySymbol,
        totalAmountUsd: data.totalAmountUsd,
        totalAmountLocal: data.totalAmountLocal || data.totalAmountUsd,
        subtotalUsd: data.subtotalUsd || data.totalAmountUsd,
        taxAmountUsd: data.taxAmountUsd || 0,
        shippingAmountUsd: 0,
        shippingAddress: JSON.stringify(data.shippingAddress || {}),
        shippingCarrier: data.shippingCarrier || 'FERRARI_GROUP_SECURE',
        customerNotes: data.customerNotes || null,
        items: {
          create: (data.items || []).map((i: any) => ({
            productId: i.productId,
            sku: i.sku,
            title: i.title,
            primaryImageUrl: i.primaryImageUrl,
            quantity: i.quantity,
            unitPriceUsd: i.unitPriceUsd,
            totalPriceUsd: i.totalPriceUsd,
            selectedRingSize: i.selectedRingSize || null,
            selectedBangleSize: i.selectedBangleSize || null,
            customEngraving: i.customEngraving || null,
            hallmarkCertificate: i.hallmarkCertificate || 'BIS 916 & GIA Certified',
          })),
        },
        timeline: {
          create: {
            status: 'VAULT_ALLOCATION_PENDING',
            notes: `High jewelry order placed via Storefront Checkout. Armored transit assigned to ${data.shippingCarrier || 'Ferrari Group Secure'}.`,
            actorEmail: 'storefront@theblinghaven.shop',
          },
        },
      },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    });

    // Update customer stats
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalSpendUsd: { increment: data.totalAmountUsd },
        totalOrdersCount: { increment: 1 },
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.ORDER_STATUS_CHANGED,
      userEmail: data.customerEmail,
      resourceType: 'Order',
      resourceId: order.id,
      metadata: { orderNumber: order.orderNumber, totalAmountUsd: data.totalAmountUsd },
    });

    return this.mapOrder(order);
  }

  async findTracking(query: string): Promise<OrderDto> {
    const q = query.trim();
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: q },
          { id: q },
        ],
      },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${query} not found.`);
    }

    return this.mapOrder(order);
  }

  private mapOrder(o: any): OrderDto {
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      customerId: o.customerId,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone || undefined,
      customerVipTier: o.customerVipTier,
      status: o.status as OrderStatus,
      paymentStatus: o.paymentStatus as PaymentStatus,
      paymentMethod: o.paymentMethod,
      currencyCode: o.currencyCode,
      currencySymbol: o.currencySymbol,
      totalAmountUsd: o.totalAmountUsd,
      totalAmountLocal: o.totalAmountLocal,
      subtotalUsd: o.subtotalUsd,
      taxAmountUsd: o.taxAmountUsd,
      shippingAmountUsd: o.shippingAmountUsd,
      shippingAddress: JSON.parse(o.shippingAddress || '{}'),
      shippingCarrier: o.shippingCarrier as ShippingCarrier,
      trackingNumber: o.trackingNumber || undefined,
      insuredValueUsd: o.insuredValueUsd || undefined,
      deliverySignatureName: o.deliverySignatureName || undefined,
      customerNotes: o.customerNotes || undefined,
      conciergeNotes: o.conciergeNotes || undefined,
      items: o.items.map((i: any) => ({
        id: i.id,
        orderId: i.orderId,
        productId: i.productId,
        sku: i.sku,
        title: i.title,
        primaryImageUrl: i.primaryImageUrl,
        quantity: i.quantity,
        unitPriceUsd: i.unitPriceUsd,
        totalPriceUsd: i.totalPriceUsd,
        selectedRingSize: i.selectedRingSize || undefined,
        selectedBangleSize: i.selectedBangleSize || undefined,
        customEngraving: i.customEngraving || undefined,
        hallmarkCertificate: i.hallmarkCertificate || undefined,
      })),
      timeline: (o.timeline || []).map((t: any) => ({
        id: t.id,
        orderId: t.orderId,
        status: t.status as OrderStatus,
        notes: t.notes,
        actorEmail: t.actorEmail || undefined,
        createdAt: t.createdAt.toISOString(),
      })),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    };
  }
}

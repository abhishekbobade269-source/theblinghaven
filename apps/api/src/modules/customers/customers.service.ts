import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  CustomerDto,
  CustomerVipTier,
  CreateCustomerDto,
  UpdateCustomerDto,
  AuditEventType,
} from '@theblinghaven/shared';
import * as argon2 from 'argon2';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(params: {
    search?: string;
    vipTier?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: CustomerDto[]; meta: { total: number; royalConciergeCount: number } }> {
    const where: any = {};
    if (params.vipTier && params.vipTier !== 'ALL') {
      where.vipTier = params.vipTier;
    }
    if (params.search) {
      where.OR = [
        { firstName: { contains: params.search } },
        { lastName: { contains: params.search } },
        { email: { contains: params.search } },
        { country: { contains: params.search } },
        { city: { contains: params.search } },
      ];
    }

    const [total, customers, royalCount] = await Promise.all([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        orderBy: { totalSpendUsd: 'desc' },
      }),
      this.prisma.customer.count({ where: { vipTier: 'ROYAL_CONCIERGE' } }),
    ]);

    const data: CustomerDto[] = customers.map((c) => ({
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      fullName: `${c.firstName} ${c.lastName}`,
      email: c.email,
      phone: c.phone || undefined,
      country: c.country,
      city: c.city || undefined,
      vipTier: c.vipTier as CustomerVipTier,
      totalSpendUsd: c.totalSpendUsd,
      totalOrdersCount: c.totalOrdersCount,
      averageOrderValueUsd:
        c.totalOrdersCount > 0 ? Math.round(c.totalSpendUsd / c.totalOrdersCount) : 0,
      preferences: JSON.parse(c.preferences || '{}'),
      conciergeNotes: c.conciergeNotes || undefined,
      assignedAdvisor: c.assignedAdvisor || undefined,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    }));

    return {
      data,
      meta: {
        total,
        royalConciergeCount: royalCount,
      },
    };
  }

  async findById(id: string): Promise<CustomerDto> {
    const c = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!c) {
      throw new NotFoundException('Private client not found.');
    }

    return {
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      fullName: `${c.firstName} ${c.lastName}`,
      email: c.email,
      phone: c.phone || undefined,
      country: c.country,
      city: c.city || undefined,
      vipTier: c.vipTier as CustomerVipTier,
      totalSpendUsd: c.totalSpendUsd,
      totalOrdersCount: c.totalOrdersCount,
      averageOrderValueUsd:
        c.totalOrdersCount > 0 ? Math.round(c.totalSpendUsd / c.totalOrdersCount) : 0,
      preferences: JSON.parse(c.preferences || '{}'),
      conciergeNotes: c.conciergeNotes || undefined,
      assignedAdvisor: c.assignedAdvisor || undefined,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }

  async create(dto: CreateCustomerDto, actorId?: string): Promise<CustomerDto> {
    const email = dto.email.toLowerCase().trim();
    const existing = await this.prisma.customer.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException(`Client with email '${email}' already exists.`);
    }

    const created = await this.prisma.customer.create({
      data: {
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        email,
        phone: dto.phone?.trim(),
        country: dto.country?.trim() || 'United States',
        city: dto.city?.trim(),
        vipTier: dto.vipTier || 'STANDARD',
        preferences: JSON.stringify(dto.preferences || {}),
        conciergeNotes: dto.conciergeNotes?.trim(),
        assignedAdvisor: (dto as any).assignedAdvisor?.trim(),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.USER_CREATED,
      userId: actorId,
      resourceType: 'Customer',
      resourceId: created.id,
      metadata: { email: created.email, vipTier: created.vipTier },
    });

    return this.findById(created.id);
  }

  async update(id: string, dto: UpdateCustomerDto, actorId?: string): Promise<CustomerDto> {
    const c = await this.prisma.customer.findUnique({ where: { id } });
    if (!c) {
      throw new NotFoundException('Private client not found.');
    }

    const updated = await this.prisma.customer.update({
      where: { id },
      data: {
        firstName: dto.firstName !== undefined ? dto.firstName.trim() : undefined,
        lastName: dto.lastName !== undefined ? dto.lastName.trim() : undefined,
        phone: dto.phone !== undefined ? dto.phone?.trim() : undefined,
        country: dto.country !== undefined ? dto.country.trim() : undefined,
        city: dto.city !== undefined ? dto.city?.trim() : undefined,
        vipTier: dto.vipTier !== undefined ? dto.vipTier : undefined,
        preferences:
          dto.preferences !== undefined
            ? JSON.stringify(dto.preferences)
            : undefined,
        conciergeNotes:
          dto.conciergeNotes !== undefined ? dto.conciergeNotes?.trim() : undefined,
        assignedAdvisor:
          (dto as any).assignedAdvisor !== undefined ? (dto as any).assignedAdvisor?.trim() : undefined,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.USER_UPDATED,
      userId: actorId,
      resourceType: 'Customer',
      resourceId: updated.id,
      metadata: { email: updated.email, vipTier: updated.vipTier },
    });

    return this.findById(updated.id);
  }

  // -------------------------------------------------------------
  // STOREFRONT CUSTOMER AUTH & PROFILE METHODS
  // -------------------------------------------------------------

  async storefrontRegister(body: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone?: string;
    country?: string;
  }) {
    const email = body.email.toLowerCase().trim();
    let customer = await this.prisma.customer.findUnique({ where: { email } });

    if (customer) {
      throw new ConflictException('An account with this email address already exists. Please log in.');
    }

    const passwordHash = body.password ? await argon2.hash(body.password) : undefined;
    const initialPrefs = {
      passwordHash,
      wishlist: [],
      savedAddresses: [],
      preferredCurrency: 'CAD',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(body.firstName + ' ' + body.lastName)}&backgroundColor=d4af37&textColor=09090c`,
    };

    customer = await this.prisma.customer.create({
      data: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        email,
        phone: body.phone?.trim(),
        country: body.country?.trim() || 'Canada',
        vipTier: 'STANDARD',
        preferences: JSON.stringify(initialPrefs),
      },
    });

    const token = this.generateCustomerToken(customer);
    return {
      token,
      customer: this.formatCustomerProfile(customer),
    };
  }

  async storefrontLogin(email: string, password?: string) {
    const cleanEmail = email.toLowerCase().trim();
    const customer = await this.prisma.customer.findUnique({ where: { email: cleanEmail } });

    if (!customer) {
      throw new UnauthorizedException('No account found with this email. Please create an account.');
    }

    const prefs = JSON.parse(customer.preferences || '{}');
    if (prefs.passwordHash && password) {
      const isValid = await argon2.verify(prefs.passwordHash, password);
      if (!isValid) {
        throw new UnauthorizedException('Incorrect password. Please try again.');
      }
    }

    const token = this.generateCustomerToken(customer);
    return {
      token,
      customer: this.formatCustomerProfile(customer),
    };
  }

  async storefrontOAuthLogin(body: {
    provider: 'google' | 'microsoft';
    email: string;
    name: string;
    avatarUrl?: string;
    providerId?: string;
  }) {
    const email = body.email.toLowerCase().trim();
    let customer = await this.prisma.customer.findUnique({ where: { email } });

    const nameParts = body.name.trim().split(' ');
    const firstName = nameParts[0] || 'Patron';
    const lastName = nameParts.slice(1).join(' ') || 'Maison';

    if (!customer) {
      const initialPrefs = {
        oauthProvider: body.provider,
        oauthProviderId: body.providerId,
        avatarUrl: body.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(body.name)}&backgroundColor=d4af37&textColor=09090c`,
        wishlist: [],
        savedAddresses: [],
        preferredCurrency: 'CAD',
      };

      customer = await this.prisma.customer.create({
        data: {
          firstName,
          lastName,
          email,
          country: 'Canada',
          vipTier: 'SILVER',
          preferences: JSON.stringify(initialPrefs),
        },
      });
    } else {
      const prefs = JSON.parse(customer.preferences || '{}');
      prefs.oauthProvider = body.provider;
      if (body.avatarUrl && !prefs.avatarUrl) {
        prefs.avatarUrl = body.avatarUrl;
      }
      customer = await this.prisma.customer.update({
        where: { id: customer.id },
        data: {
          preferences: JSON.stringify(prefs),
        },
      });
    }

    const token = this.generateCustomerToken(customer);
    return {
      token,
      customer: this.formatCustomerProfile(customer),
    };
  }

  async getStorefrontProfile(authHeader?: string, emailHeader?: string) {
    let email = emailHeader;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = Buffer.from(authHeader.replace('Bearer ', ''), 'base64').toString();
        const parsed = JSON.parse(decoded);
        if (parsed.email) email = parsed.email;
      } catch {}
    }

    if (!email) {
      throw new UnauthorizedException('Authentication required to view profile.');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        orders: {
          include: { items: true, timeline: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found.');
    }

    return this.formatCustomerProfile(customer);
  }

  async updateStorefrontProfile(body: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    city?: string;
    preferredCurrency?: string;
    defaultAddress?: any;
  }) {
    const email = body.email.toLowerCase().trim();
    const customer = await this.prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      throw new NotFoundException('Customer profile not found.');
    }

    const prefs = JSON.parse(customer.preferences || '{}');
    if (body.preferredCurrency) prefs.preferredCurrency = body.preferredCurrency;
    if (body.defaultAddress) prefs.defaultAddress = body.defaultAddress;

    const updated = await this.prisma.customer.update({
      where: { id: customer.id },
      data: {
        firstName: body.firstName !== undefined ? body.firstName.trim() : undefined,
        lastName: body.lastName !== undefined ? body.lastName.trim() : undefined,
        phone: body.phone !== undefined ? body.phone?.trim() : undefined,
        country: body.country !== undefined ? body.country.trim() : undefined,
        city: body.city !== undefined ? body.city?.trim() : undefined,
        preferences: JSON.stringify(prefs),
      },
    });

    return this.formatCustomerProfile(updated);
  }

  async changeStorefrontPassword(body: {
    email: string;
    currentPassword?: string;
    newPassword: string;
  }) {
    const email = body.email.toLowerCase().trim();
    const customer = await this.prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      throw new NotFoundException('Customer profile not found.');
    }

    const prefs = JSON.parse(customer.preferences || '{}');
    if (prefs.passwordHash && body.currentPassword) {
      const isMatch = await argon2.verify(prefs.passwordHash, body.currentPassword);
      if (!isMatch) {
        throw new BadRequestException('Current password does not match.');
      }
    }

    prefs.passwordHash = await argon2.hash(body.newPassword);
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { preferences: JSON.stringify(prefs) },
    });

    return { success: true, message: 'Password successfully updated.' };
  }

  async toggleWishlist(email: string, productId: string) {
    const cleanEmail = email.toLowerCase().trim();
    const customer = await this.prisma.customer.findUnique({ where: { email: cleanEmail } });
    if (!customer) {
      throw new NotFoundException('Customer profile not found.');
    }

    const prefs = JSON.parse(customer.preferences || '{}');
    let wishlist: string[] = Array.isArray(prefs.wishlist) ? prefs.wishlist : [];

    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter((id) => id !== productId);
    } else {
      wishlist.push(productId);
    }

    prefs.wishlist = wishlist;
    await this.prisma.customer.update({
      where: { id: customer.id },
      data: { preferences: JSON.stringify(prefs) },
    });

    const products = await this.prisma.product.findMany({
      where: { id: { in: wishlist } },
      include: {
        category: true,
      },
    });

    return {
      wishlistIds: wishlist,
      products,
    };
  }

  async getCustomerOrders(email?: string) {
    if (!email) return [];
    const orders = await this.prisma.order.findMany({
      where: { customerEmail: email.toLowerCase().trim() },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  }

  async getCustomerCoupons(email?: string) {
    const promos = await this.prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { value: 'desc' },
    });

    return promos.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description,
      type: p.type,
      value: p.value,
      minPurchaseAmountUsd: p.minPurchaseAmountUsd,
      maxDiscountAmountUsd: p.maxDiscountAmountUsd,
      vipTierRequired: p.vipTierRequired,
      endDate: p.endDate?.toISOString() || null,
    }));
  }

  private generateCustomerToken(customer: any): string {
    const payload = {
      sub: customer.id,
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
      role: 'CUSTOMER',
      timestamp: Date.now(),
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private formatCustomerProfile(c: any) {
    const prefs = JSON.parse(c.preferences || '{}');
    return {
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      fullName: `${c.firstName} ${c.lastName}`,
      email: c.email,
      phone: c.phone || '',
      country: c.country || 'Canada',
      city: c.city || '',
      vipTier: c.vipTier,
      totalSpendUsd: c.totalSpendUsd || 0,
      totalOrdersCount: c.totalOrdersCount || 0,
      avatarUrl: prefs.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.firstName + ' ' + c.lastName)}&backgroundColor=d4af37&textColor=09090c`,
      preferredCurrency: prefs.preferredCurrency || 'CAD',
      wishlist: Array.isArray(prefs.wishlist) ? prefs.wishlist : [],
      defaultAddress: prefs.defaultAddress || null,
      oauthProvider: prefs.oauthProvider || null,
      orders: c.orders || [],
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }
}

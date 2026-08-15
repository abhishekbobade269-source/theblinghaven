import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { AuditService } from '../audit/audit.service';
import {
  AdminRole,
  AdminUserDto,
  AuditEventType,
  Permission,
  ROLE_PERMISSIONS,
  ROLE_METADATA,
  RoleMatrixItemDto,
  AuditLogDto,
} from '@theblinghaven/shared';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
  ) {}

  async getRolePermissions(role: AdminRole): Promise<Permission[]> {
    if (role === AdminRole.SUPER_ADMIN) {
      return Object.values(Permission);
    }
    const override = await this.prisma.rolePermissionOverride.findUnique({
      where: { role },
    });
    if (override && override.permissions) {
      try {
        return JSON.parse(override.permissions);
      } catch (e) {
        // fallback
      }
    }
    return ROLE_PERMISSIONS[role] || [];
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<{ data: AdminUserDto[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const page = Number(params.page) || 1;
    const limit = Math.min(Number(params.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.role) {
      where.role = params.role;
    }
    if (params.search) {
      where.OR = [
        { email: { contains: params.search } },
        { firstName: { contains: params.search } },
        { lastName: { contains: params.search } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.adminUser.count({ where }),
      this.prisma.adminUser.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const data: AdminUserDto[] = await Promise.all(
      users.map(async (u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role as AdminRole,
        permissions: await this.getRolePermissions(u.role as AdminRole),
        mfaEnabled: u.mfaEnabled,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt?.toISOString() || null,
        createdAt: u.createdAt.toISOString(),
      })),
    );

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

  async findOne(id: string): Promise<AdminUserDto> {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    const permissions = await this.getRolePermissions(user.role as AdminRole);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as AdminRole,
      permissions,
      mfaEnabled: user.mfaEnabled,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
    };
  }

  async create(
    data: {
      email: string;
      password?: string;
      firstName: string;
      lastName: string;
      role: AdminRole;
    },
    actorId?: string,
  ): Promise<AdminUserDto> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const existing = await this.prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException('An admin user with this email already exists.');
    }

    const defaultPassword = data.password || 'BlingHavenTemp2026!';
    const passwordHash = await this.authService.hashPassword(defaultPassword);

    const user = await this.prisma.adminUser.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        role: data.role,
        isActive: true,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.USER_CREATED,
      userId: actorId,
      resourceType: 'AdminUser',
      resourceId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return this.findOne(user.id);
  }

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      role?: AdminRole;
      isActive?: boolean;
    },
    actorId?: string,
  ): Promise<AdminUserDto> {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    if (data.isActive === false && user.role === AdminRole.SUPER_ADMIN) {
      const superAdminCount = await this.prisma.adminUser.count({
        where: { role: AdminRole.SUPER_ADMIN, isActive: true },
      });
      if (superAdminCount <= 1) {
        throw new BadRequestException('Cannot deactivate the sole remaining active Super Administrator.');
      }
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data: {
        ...(data.firstName && { firstName: data.firstName.trim() }),
        ...(data.lastName && { lastName: data.lastName.trim() }),
        ...(data.role && { role: data.role }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.USER_UPDATED,
      userId: actorId,
      resourceType: 'AdminUser',
      resourceId: updated.id,
      metadata: { changed: data },
    });

    return this.findOne(updated.id);
  }

  async unlockUser(id: string, actorId?: string): Promise<void> {
    await this.prisma.adminUser.update({
      where: { id },
      data: { failedLoginAttempts: 0, lockoutUntil: null },
    });

    await this.auditService.log({
      eventType: AuditEventType.USER_UPDATED,
      userId: actorId,
      resourceType: 'AdminUser',
      resourceId: id,
      metadata: { action: 'UNLOCKED_ACCOUNT' },
    });
  }

  async getRolesMatrix(): Promise<RoleMatrixItemDto[]> {
    const roles = Object.values(AdminRole);
    const [counts, overrides] = await Promise.all([
      Promise.all(roles.map((role) => this.prisma.adminUser.count({ where: { role, isActive: true } }))),
      this.prisma.rolePermissionOverride.findMany(),
    ]);

    const overrideMap = new Map<string, Permission[]>();
    for (const ov of overrides) {
      try {
        overrideMap.set(ov.role, JSON.parse(ov.permissions));
      } catch (e) {
        // ignore
      }
    }

    return roles.map((role, idx) => {
      const meta = ROLE_METADATA[role] || {
        label: role,
        description: 'Privileged role',
        color: '#C5A880',
      };
      const permissions =
        role === AdminRole.SUPER_ADMIN
          ? Object.values(Permission)
          : overrideMap.get(role) || ROLE_PERMISSIONS[role] || [];

      return {
        role,
        label: meta.label,
        description: meta.description,
        color: meta.color,
        userCount: counts[idx],
        permissions,
      };
    });
  }

  async updateRolePermissions(
    role: AdminRole,
    permissions: Permission[],
    actorId?: string,
  ): Promise<RoleMatrixItemDto> {
    if (role === AdminRole.SUPER_ADMIN) {
      throw new BadRequestException('Super Administrator inherently maintains all permissions.');
    }

    await this.prisma.rolePermissionOverride.upsert({
      where: { role },
      create: {
        role,
        permissions: JSON.stringify(permissions),
      },
      update: {
        permissions: JSON.stringify(permissions),
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.USER_UPDATED,
      userId: actorId,
      resourceType: 'RoleMatrix',
      resourceId: role,
      metadata: { role, permissionsCount: permissions.length },
    });

    const matrix = await this.getRolesMatrix();
    return matrix.find((m) => m.role === role)!;
  }

  async getUserAuditHistory(id: string): Promise<AuditLogDto[]> {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    const logs = await this.prisma.auditLog.findMany({
      where: {
        OR: [{ userId: id }, { resourceId: id }, { userEmail: user.email }],
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return logs.map((l) => ({
      id: l.id,
      eventType: l.eventType as AuditEventType,
      userId: l.userId,
      userEmail: l.userEmail,
      userRole: l.userRole as AdminRole,
      resourceType: l.resourceType,
      resourceId: l.resourceId,
      ipAddress: l.ipAddress,
      userAgent: l.userAgent,
      metadata: l.metadata ? JSON.parse(l.metadata) : null,
      createdAt: l.createdAt.toISOString(),
    }));
  }
}

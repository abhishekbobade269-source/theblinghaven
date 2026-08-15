import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { AdminRole, AuditEventType } from '@theblinghaven/shared';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  try {
    const argon2 = require('argon2');
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  } catch (e) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `scrypt:${salt}:${hash}`;
  }
}

async function main() {
  console.log('🌱 Seeding The Bling Haven Admin Users...');

  const superAdminPassword = await hashPassword('Admin@BlingHaven2026!');
  const managerPassword = await hashPassword('Manager@BlingHaven2026!');

  const users = [
    {
      email: 'admin@theblinghaven.shop',
      passwordHash: superAdminPassword,
      firstName: 'Aria',
      lastName: 'Vance',
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
      mfaEnabled: false,
    },
    {
      email: 'catalog@theblinghaven.shop',
      passwordHash: managerPassword,
      firstName: 'Elena',
      lastName: 'Rostova',
      role: AdminRole.CATALOG_MANAGER,
      isActive: true,
      mfaEnabled: false,
    },
    {
      email: 'orders@theblinghaven.shop',
      passwordHash: managerPassword,
      firstName: 'Julian',
      lastName: 'Sterling',
      role: AdminRole.ORDER_MANAGER,
      isActive: true,
      mfaEnabled: false,
    },
    {
      email: 'finance@theblinghaven.shop',
      passwordHash: managerPassword,
      firstName: 'Marcus',
      lastName: 'Chen',
      role: AdminRole.FINANCE,
      isActive: true,
      mfaEnabled: false,
    },
    {
      email: 'security@theblinghaven.shop',
      passwordHash: managerPassword,
      firstName: 'Seraphina',
      lastName: 'Kovacs',
      role: AdminRole.SECURITY_ADMIN,
      isActive: true,
      mfaEnabled: false,
    },
  ];

  for (const user of users) {
    const existing = await prisma.adminUser.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      const created = await prisma.adminUser.create({
        data: user,
      });

      await prisma.auditLog.create({
        data: {
          eventType: AuditEventType.USER_CREATED,
          userId: created.id,
          userEmail: created.email,
          userRole: created.role,
          resourceType: 'AdminUser',
          resourceId: created.id,
          metadata: JSON.stringify({ note: 'Initial system seed user' }),
        },
      });

      console.log(`✅ Created ${user.role}: ${user.email}`);
    } else {
      console.log(`ℹ️ User ${user.email} already exists.`);
    }
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

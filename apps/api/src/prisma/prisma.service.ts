import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to PostgreSQL Database.');
    
    // Auto-bootstrap super admin user if table is empty
    try {
      const adminCount = await this.adminUser.count();
      if (adminCount === 0) {
        this.logger.log('🌱 Initializing default Admin accounts in fresh PostgreSQL database...');
        let passwordHash: string;
        try {
          const argon2 = require('argon2');
          passwordHash = await argon2.hash('Admin@BlingHaven2026!', {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1,
          });
        } catch {
          const salt = crypto.randomBytes(16).toString('hex');
          const hash = crypto.scryptSync('Admin@BlingHaven2026!', salt, 64).toString('hex');
          passwordHash = `scrypt:${salt}:${hash}`;
        }

        await this.adminUser.create({
          data: {
            email: 'admin@theblinghaven.shop',
            passwordHash,
            firstName: 'Abhishek',
            lastName: 'Bobade',
            role: 'SUPER_ADMIN',
            isActive: true,
            mfaEnabled: false,
          },
        });
        this.logger.log('✅ Default Super Admin account created: admin@theblinghaven.shop');
      }

      const catCount = await this.category.count();
      if (catCount === 0) {
        this.logger.log('🌱 Initializing default luxury jewelry categories...');
        const initialCategories = [
          { name: 'Bridal Sets', slug: 'bridal-sets', description: 'Royal Kundan, Polki & Heritage Bridal Symphony' },
          { name: 'Earrings', slug: 'earrings', description: 'Chandbali, Jhumkas & Statement Drops' },
          { name: 'Rings', slug: 'rings', description: 'Solitaire Statement Rings & 925 Silver Bands' },
          { name: 'Bangles', slug: 'bangles', description: 'Handcrafted Kadas & American Diamond Bangles' },
          { name: 'Artisan Silver', slug: 'artisan-silver', description: '925 Sterling Silver & Oxidised Heirlooms' },
        ];
        for (const cat of initialCategories) {
          await this.category.create({ data: cat });
        }
        this.logger.log('✅ Default categories initialized.');
      }
    } catch (err) {
      this.logger.warn(`Database bootstrap check: ${(err as any)?.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

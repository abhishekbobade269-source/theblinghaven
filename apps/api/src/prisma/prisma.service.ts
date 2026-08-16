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

      // Bootstrap CMS dynamic tables
      try {
        await this.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS page_controls (
            id VARCHAR(120) PRIMARY KEY,
            pageRoute VARCHAR(255) UNIQUE NOT NULL,
            pageTitle VARCHAR(255) NOT NULL,
            pageType VARCHAR(60) DEFAULT 'CORE_SYSTEM',
            status VARCHAR(60) DEFAULT 'ACTIVE',
            customHeadline TEXT,
            customSubtext TEXT,
            heroBannerUrl TEXT,
            badgeText VARCHAR(120),
            productIds TEXT DEFAULT '[]',
            hideFromNavigation INTEGER DEFAULT 0,
            estimatedReturnAt VARCHAR(120),
            createdAt VARCHAR(120),
            updatedAt VARCHAR(120)
          );
        `);

        await this.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS instagram_config (
            id VARCHAR(120) PRIMARY KEY,
            username VARCHAR(255),
            accountName VARCHAR(255),
            password VARCHAR(255),
            accessToken TEXT,
            appId VARCHAR(255),
            appSecret VARCHAR(255),
            profilePicUrl TEXT,
            followersCount INTEGER DEFAULT 52400,
            isLiveConnected INTEGER DEFAULT 1,
            autoSyncEnabled INTEGER DEFAULT 1,
            lastSyncedAt VARCHAR(120),
            updatedAt VARCHAR(120)
          );
        `);

        await this.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS instagram_posts (
            id VARCHAR(120) PRIMARY KEY,
            mediaType VARCHAR(60),
            mediaUrl TEXT,
            permalink TEXT,
            caption TEXT,
            likes INTEGER DEFAULT 0,
            views INTEGER DEFAULT 0,
            comments INTEGER DEFAULT 0,
            createdAt VARCHAR(120)
          );
        `);

        const countRes: any = await this.$queryRawUnsafe(`SELECT count(*) as count FROM page_controls`);
        const rowCount = Number(countRes[0]?.count || 0);
        if (rowCount === 0) {
          this.logger.log('🌱 Seeding initial core page controls...');
          const initialRoutes = [
            { id: 'pc-1', pageRoute: '/', pageTitle: 'Homepage & High-Jewellery Portal', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-2', pageRoute: '/rings', pageTitle: 'Diamond & Gemstone Rings', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-3', pageRoute: '/bridal-sets', pageTitle: 'Royal Bridal & Solitaire Sets', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-4', pageRoute: '/earrings', pageTitle: 'Fine Earrings & Statement Drops', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-5', pageRoute: '/bangles', pageTitle: 'Heritage Gold & Diamond Bangles', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-6', pageRoute: '/artisan-silver', pageTitle: 'Handmade 925 Artisan Silver', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-7', pageRoute: '/try-on', pageTitle: 'Virtual Try-On AR Studio', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-8', pageRoute: '/bespoke', pageTitle: 'Bespoke Atelier & Custom Orders', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-9', pageRoute: '/vip-lounge', pageTitle: 'VIP Patron Lounge', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-10', pageRoute: '/verify', pageTitle: 'IGI / GIA Certificate & Hallmark Verification', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-11', pageRoute: '/about', pageTitle: 'Our Heritage & Story', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-12', pageRoute: '/craftsmanship', pageTitle: 'Artisanal Craftsmanship & Metallurgy', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-13', pageRoute: '/policies', pageTitle: 'Insured Shipping, Returns & Authenticity', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
            { id: 'pc-14', pageRoute: '/faq', pageTitle: 'Frequently Asked Questions', pageType: 'CORE_SYSTEM', status: 'ACTIVE' },
          ];
          const now = new Date().toISOString();
          for (const r of initialRoutes) {
            await this.$executeRaw`
              INSERT INTO page_controls (id, pageRoute, pageTitle, pageType, status, productIds, hideFromNavigation, createdAt, updatedAt)
              VALUES (${r.id}, ${r.pageRoute}, ${r.pageTitle}, ${r.pageType}, ${r.status}, '[]', 0, ${now}, ${now})
            `;
          }
          this.logger.log('✅ Core page controls seeded.');
        }
      } catch (cmsErr) {
        this.logger.warn(`CMS table init: ${(cmsErr as any)?.message}`);
      }
    } catch (err) {
      this.logger.warn(`Database bootstrap check: ${(err as any)?.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

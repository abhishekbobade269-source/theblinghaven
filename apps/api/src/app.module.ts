import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MediaModule } from './modules/media/media.module';
import { CmsModule } from './modules/cms/cms.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PromotionsModule } from './modules/promotions/promotions.module';
import { TaxesModule } from './modules/taxes/taxes.module';
import { ConciergeModule } from './modules/concierge/concierge.module';
import { BespokeModule } from './modules/bespoke/bespoke.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MetalsModule } from './modules/metals/metals.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { TryOnModule } from './modules/tryon/tryon.module';
import { VipModule } from './modules/vip/vip.module';
import { VaultsModule } from './modules/vaults/vaults.module';
import { AiConciergeModule } from './modules/ai-concierge/ai-concierge.module';
import { FiscalCloseModule } from './modules/fiscal-close/fiscal-close.module';
import { SupportModule } from './modules/support/support.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 120, // 120 requests per minute default
      },
    ]),
    PrismaModule,
    AuditModule,
    AuthModule,
    UsersModule,
    DashboardModule,
    MediaModule,
    CmsModule,
    CatalogModule,
    InventoryModule,
    PricingModule,
    CustomersModule,
    OrdersModule,
    PromotionsModule,
    TaxesModule,
    ConciergeModule,
    BespokeModule,
    ReportsModule,
    MetalsModule,
    CertificatesModule,
    TryOnModule,
    VipModule,
    VaultsModule,
    AiConciergeModule,
    FiscalCloseModule,
    SupportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

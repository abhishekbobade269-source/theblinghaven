import { Module } from '@nestjs/common';
import { MetalsService } from './metals.service';
import { MetalsController } from './metals.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [PrismaModule, AuditModule, PricingModule],
  controllers: [MetalsController],
  providers: [MetalsService],
  exports: [MetalsService],
})
export class MetalsModule {}

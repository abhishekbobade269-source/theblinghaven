import { Module } from '@nestjs/common';
import { FiscalCloseService } from './fiscal-close.service';
import { FiscalCloseController } from './fiscal-close.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [FiscalCloseController],
  providers: [FiscalCloseService],
  exports: [FiscalCloseService],
})
export class FiscalCloseModule {}

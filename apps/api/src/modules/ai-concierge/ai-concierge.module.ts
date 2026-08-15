import { Module } from '@nestjs/common';
import { AiConciergeService } from './ai-concierge.service';
import { AiConciergeController } from './ai-concierge.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [AiConciergeController],
  providers: [AiConciergeService],
  exports: [AiConciergeService],
})
export class AiConciergeModule {}

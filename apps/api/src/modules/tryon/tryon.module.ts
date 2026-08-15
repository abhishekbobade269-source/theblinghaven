import { Module } from '@nestjs/common';
import { TryOnService } from './tryon.service';
import { TryOnController } from './tryon.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [TryOnController],
  providers: [TryOnService],
  exports: [TryOnService],
})
export class TryOnModule {}

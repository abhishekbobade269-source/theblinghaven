import { Module } from '@nestjs/common';
import { BespokeController } from './bespoke.controller';
import { BespokeService } from './bespoke.service';

@Module({
  controllers: [BespokeController],
  providers: [BespokeService],
  exports: [BespokeService],
})
export class BespokeModule {}

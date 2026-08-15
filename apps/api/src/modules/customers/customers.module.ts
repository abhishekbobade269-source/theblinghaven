import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomerStorefrontController } from './customer-storefront.controller';
import { CustomersService } from './customers.service';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [CustomersController, CustomerStorefrontController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}

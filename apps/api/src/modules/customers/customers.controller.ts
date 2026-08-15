import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import {
  Permission,
  CreateCustomerDto,
  UpdateCustomerDto,
} from '@theblinghaven/shared';

@ApiTags('VIP Clienteling & Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'List all VIP clients with LTV & tier filters' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'vipTier', required: false, type: String })
  async getCustomers(
    @Query('search') search?: string,
    @Query('vipTier') vipTier?: string,
  ) {
    return this.customersService.findAll({ search, vipTier });
  }

  @Get(':id')
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'Get single private client profile with preferences and history' })
  async getCustomerById(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  @Post()
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Register new VIP client profile' })
  async createCustomer(
    @Body() dto: CreateCustomerDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.customersService.create(dto, actorId);
  }

  @Put(':id')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Update VIP client preferences, tier, and concierge notes' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.customersService.update(id, dto, actorId);
  }
}

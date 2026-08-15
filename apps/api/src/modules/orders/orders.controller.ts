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
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  CreateOrderDto,
  UpdateOrderStatusDto,
} from '@theblinghaven/shared';

@ApiTags('High-Value Orders & Fulfillment')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // -------------------------------------------------------------
  // PUBLIC STOREFRONT CHECKOUT & TRACKING
  // -------------------------------------------------------------
  @Public()
  @Post('orders/checkout')
  @ApiOperation({ summary: 'Public storefront customer checkout endpoint' })
  async checkoutStorefront(@Body() data: any) {
    return this.ordersService.checkoutStorefrontOrder(data);
  }

  @Public()
  @Get('orders/track/:query')
  @ApiOperation({ summary: 'Public order tracking lookup by orderNumber or ID' })
  async trackOrder(@Param('query') query: string) {
    return this.ordersService.findTracking(query);
  }

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATED ORDERS
  // -------------------------------------------------------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/orders')
  @RequirePermissions(Permission.ORDERS_READ)
  @ApiOperation({ summary: 'List all luxury orders with multi-currency revenue indicators' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getOrders(
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.ordersService.findAll({ search, status });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/orders/:id')
  @RequirePermissions(Permission.ORDERS_READ)
  @ApiOperation({ summary: 'Get single order with timeline, certificates, and insured dispatch' })
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/orders')
  @RequirePermissions(Permission.ORDERS_WRITE)
  @ApiOperation({ summary: 'Create new high-value jewelry order' })
  async createOrder(@Body() dto: CreateOrderDto, @CurrentUser('id') actorId: string) {
    return this.ordersService.createOrder(dto, actorId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('admin/orders/:id/status')
  @RequirePermissions(Permission.ORDERS_WRITE)
  @ApiOperation({ summary: 'Transition order through luxury fulfillment stages' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser('id') actorId: string,
    @CurrentUser('email') actorEmail: string,
  ) {
    return this.ordersService.updateStatus(id, dto, actorId, actorEmail);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  UpdateCurrencyRateDto,
  SetPriceOverrideDto,
} from '@theblinghaven/shared';

@ApiTags('Multi-Currency Pricing')
@Controller()
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // ---------------- PUBLIC STOREFRONT PRICING ----------------

  @Public()
  @Get('pricing/rates')
  @ApiOperation({ summary: 'Public: Get all active currency exchange rates' })
  async getPublicRates() {
    return this.pricingService.getAllRates();
  }

  @Public()
  @Get('pricing/convert')
  @ApiOperation({ summary: 'Public: Convert price between currencies with luxury rounding' })
  @ApiQuery({ name: 'amount', required: true, type: Number })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: true, type: String })
  async convertCurrency(
    @Query('amount') amount: number,
    @Query('from') from = 'USD',
    @Query('to') to: string,
  ) {
    return this.pricingService.convert(Number(amount), from, to);
  }

  // ---------------- ADMIN PRICING MANAGEMENT ----------------

  @Get('admin/pricing/rates')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Admin: Get full currency rate table with buffers' })
  async getAdminRates() {
    return this.pricingService.getAllRates();
  }

  @Put('admin/pricing/rates/:currencyCode')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Update currency exchange rate, FX buffer or rounding rule' })
  async updateRate(
    @Param('currencyCode') currencyCode: string,
    @Body() dto: UpdateCurrencyRateDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.pricingService.updateRate(currencyCode, dto, actorId);
  }

  @Get('admin/pricing/overrides')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Admin: List all manual regional price overrides' })
  async getOverrides() {
    return this.pricingService.getOverrides();
  }

  @Post('admin/pricing/overrides')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Set manual price override for specific SKU and currency' })
  async setOverride(
    @Body() dto: SetPriceOverrideDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.pricingService.setOverride(dto, actorId);
  }

  @Delete('admin/pricing/overrides/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Delete regional price override' })
  async deleteOverride(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    await this.pricingService.deleteOverride(id, actorId);
    return { success: true, message: 'Price override removed.' };
  }
}

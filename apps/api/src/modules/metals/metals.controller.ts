import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MetalsService } from './metals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  UpdateMetalPriceDto,
  CalculateJewelryPriceDto,
} from '@theblinghaven/shared';

@ApiTags('Precious Metals & Live Bullion Pricing')
@Controller()
export class MetalsController {
  constructor(private readonly metalsService: MetalsService) {}

  // -------------------------------------------------------------
  // PUBLIC METAL SPOT RATES & LIVE PRICING CALCULATOR
  // -------------------------------------------------------------
  @Public()
  @Get('metals/rates')
  @ApiOperation({ summary: 'Get live LBMA gold, platinum, and silver spot prices per gram' })
  async getPublicRates() {
    return this.metalsService.findAllRates();
  }

  @Public()
  @Post('metals/calculate-breakdown')
  @ApiOperation({ summary: 'Calculate transparent jewelry price breakdown (Metal + Gemstones + Making Charges)' })
  async calculateBreakdown(@Body() dto: CalculateJewelryPriceDto) {
    return this.metalsService.calculateBreakdown(dto);
  }

  @Public()
  @Post('metals/sync-market')
  @ApiOperation({ summary: 'Sync live market spot rates from LBMA & TSX feed' })
  async syncMarketRates() {
    return this.metalsService.syncLiveMarketRates();
  }

  // -------------------------------------------------------------
  // ADMIN BULLION OVERRIDES & CRAFTSMANSHIP CHARGES
  // -------------------------------------------------------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/metals/rates')
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'List all precious metal rates with market sources' })
  async getAdminRates() {
    return this.metalsService.findAllRates();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('admin/metals/rates/:id')
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Update live spot price per gram and benchmark making charges' })
  async updateRate(
    @Param('id') id: string,
    @Body() dto: UpdateMetalPriceDto,
    @CurrentUser('id') actorId: string,
    @CurrentUser('email') actorEmail: string,
  ) {
    return this.metalsService.updateRate(id, dto, actorId, actorEmail);
  }
}

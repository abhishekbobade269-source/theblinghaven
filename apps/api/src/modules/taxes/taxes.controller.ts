import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaxesService } from './taxes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  CalculateTaxDto,
  UpdateTaxRuleDto,
} from '@theblinghaven/shared';

@ApiTags('Global Taxes & Customs')
@Controller()
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  // ---------------- PUBLIC STOREFRONT TAX CALCULATOR ----------------

  @Public()
  @Post('taxes/calculate')
  @ApiOperation({ summary: 'Public: Dynamic cross-border VAT, GST, and customs duties calculator' })
  async calculateTax(@Body() dto: CalculateTaxDto) {
    return this.taxesService.calculateTax(dto);
  }

  // ---------------- ADMIN TAX MANAGEMENT ----------------

  @Get('admin/taxes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Admin: List all country and state tax/customs rules' })
  async getTaxRules() {
    return this.taxesService.findAll();
  }

  @Put('admin/taxes/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Update tax percentage, customs duty, or price inclusion toggle' })
  async updateTaxRule(
    @Param('id') id: string,
    @Body() dto: UpdateTaxRuleDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.taxesService.update(id, dto, actorId);
  }
}

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CurrencyCode } from '@theblinghaven/shared';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Admin Dashboard & Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Get aggregated luxury commerce KPI metrics with currency conversion' })
  @ApiQuery({ name: 'currency', required: false, enum: ['USD', 'EUR', 'GBP', 'AED', 'INR', 'CAD', 'AUD', 'SGD'] })
  async getKpis(@Query('currency') currency?: CurrencyCode) {
    return this.dashboardService.getKpis(currency || 'USD');
  }

  @Get('revenue-chart')
  @ApiOperation({ summary: 'Get historical time-series revenue and volume data' })
  @ApiQuery({ name: 'range', required: false, enum: ['7d', '30d', '90d', '1y'] })
  @ApiQuery({ name: 'currency', required: false, enum: ['USD', 'EUR', 'GBP', 'AED', 'INR', 'CAD', 'AUD', 'SGD'] })
  async getRevenueChart(
    @Query('range') range?: '7d' | '30d' | '90d' | '1y',
    @Query('currency') currency?: CurrencyCode,
  ) {
    return this.dashboardService.getRevenueChart(range || '30d', currency || 'USD');
  }

  @Get('top-categories')
  @ApiOperation({ summary: 'Get sales distribution across top jewelry categories' })
  @ApiQuery({ name: 'currency', required: false, enum: ['USD', 'EUR', 'GBP', 'AED', 'INR', 'CAD', 'AUD', 'SGD'] })
  async getTopCategories(@Query('currency') currency?: CurrencyCode) {
    return this.dashboardService.getTopCategories(currency || 'USD');
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get live commerce and security operations activity feed' })
  @ApiQuery({ name: 'currency', required: false, enum: ['USD', 'EUR', 'GBP', 'AED', 'INR', 'CAD', 'AUD', 'SGD'] })
  async getRecentActivity(@Query('currency') currency?: CurrencyCode) {
    return this.dashboardService.getRecentActivities(currency || 'USD');
  }
}

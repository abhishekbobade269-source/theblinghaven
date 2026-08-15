import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators';
import { Permission, ReportType } from '@theblinghaven/shared';

@ApiTags('Executive Analytics & Compliance Reports')
@Controller('admin/reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('analytics')
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Admin: Executive financial analytics and multi-currency metrics' })
  async getAnalytics(@Query('period') period?: string) {
    return this.reportsService.getAnalytics(period || 'ALL');
  }

  @Get('export/:reportType')
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Admin: Export BIS Hallmarking, VAT Tax, or Vault Valuation report (JSON or CSV)' })
  async exportReport(
    @Param('reportType') reportType: ReportType,
    @Query('format') format: 'json' | 'csv' = 'json',
    @Res() res: Response,
  ) {
    let data: any[] = [];
    let filename = `${reportType}-${new Date().toISOString().slice(0, 10)}`;

    if (reportType === 'hallmark-audit') {
      data = await this.reportsService.getHallmarkAuditReport();
    } else if (reportType === 'tax-filing') {
      data = await this.reportsService.getTaxFilingReport();
    } else if (reportType === 'inventory-valuation') {
      data = await this.reportsService.getInventoryValuationReport();
    } else if (reportType === 'chain-of-custody') {
      data = await this.reportsService.getChainOfCustodyReport();
    }

    if (format === 'csv') {
      const csv = this.reportsService.generateCsv(reportType, data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      return res.send(csv);
    }

    return res.json({
      success: true,
      reportType,
      generatedAt: new Date().toISOString(),
      recordCount: data.length,
      data,
    });
  }
}

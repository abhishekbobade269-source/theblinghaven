import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FiscalCloseService } from './fiscal-close.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators';
import {
  Permission,
  GenerateFiscalCloseDto,
  CertifyFiscalCloseDto,
} from '@theblinghaven/shared';

@ApiTags('Enterprise EOD Fiscal Close & Multi-Vault Balance Sheet')
@Controller('admin/fiscal-close')
export class FiscalCloseController {
  constructor(private readonly fiscalCloseService: FiscalCloseService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'List recent daily EOD fiscal closures' })
  async getFiscalClosures() {
    return this.fiscalCloseService.getRecentFiscalClosures();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('generate')
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Generate and reconcile daily EOD fiscal close' })
  async generateFiscalClose(@Body() dto: GenerateFiscalCloseDto) {
    return this.fiscalCloseService.generateFiscalClose(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/certify')
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Executive CFO certification and cryptographic sign-off' })
  async certifyFiscalClose(
    @Param('id') id: string,
    @Body() dto: CertifyFiscalCloseDto,
    @Req() req: any,
  ) {
    const auditorEmail = dto.auditorEmail || req.user?.email || 'cfo@theblinghaven.shop';
    return this.fiscalCloseService.certifyFiscalClose(id, {
      ...dto,
      auditorEmail,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Get fiscal close record details' })
  async getFiscalCloseById(@Param('id') id: string) {
    return this.fiscalCloseService.getFiscalCloseById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @RequirePermissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Delete a fiscal close record' })
  async deleteFiscalClose(@Param('id') id: string) {
    return this.fiscalCloseService.deleteFiscalClose(id);
  }
}

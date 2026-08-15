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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TryOnService } from './tryon.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, Public } from '../../common/decorators';
import { Permission, SubmitTryOnConsultationDto } from '@theblinghaven/shared';

@ApiTags('AR Virtual Try-On & Fitting Studio')
@Controller()
export class TryOnController {
  constructor(private readonly tryOnService: TryOnService) {}

  // -------------------------------------------------------------
  // PUBLIC AR TRY-ON ASSETS & LOOK CONSULTATIONS
  // -------------------------------------------------------------
  @Public()
  @Get('try-on/overlays')
  @ApiOperation({ summary: 'Get transparent jewelry overlays with precision anchor points' })
  async getOverlays(@Query('category') category?: string) {
    return this.tryOnService.findAllOverlays(category);
  }

  @Public()
  @Post('try-on/share-consultation')
  @ApiOperation({ summary: 'Submit virtual try-on look to personal jewelry director' })
  async submitConsultation(@Body() dto: SubmitTryOnConsultationDto) {
    return this.tryOnService.submitConsultation(dto);
  }

  // -------------------------------------------------------------
  // ADMIN TRY-ON CONSULTATION DESK
  // -------------------------------------------------------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/try-on/consultations')
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'List all client virtual try-on consultations' })
  async getConsultations() {
    return this.tryOnService.findAllConsultations();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('admin/try-on/consultations/:id/status')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Update consultation status' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.tryOnService.updateConsultationStatus(id, status);
  }
}

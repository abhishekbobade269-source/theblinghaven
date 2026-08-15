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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConciergeService } from './concierge.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  CreateInquiryDto,
  UpdateInquiryDto,
  InquiryType,
  InquiryStatus,
} from '@theblinghaven/shared';

@ApiTags('Concierge & VIP Appointments')
@Controller()
export class ConciergeController {
  constructor(private readonly conciergeService: ConciergeService) {}

  // ---------------- PUBLIC STOREFRONT CONCIERGE DESK ----------------

  @Public()
  @Post('concierge/inquire')
  @ApiOperation({ summary: 'Public: Submit private salon viewing or high-jewelry inquiry' })
  async createInquiry(@Body() dto: CreateInquiryDto) {
    return this.conciergeService.create(dto);
  }

  // ---------------- ADMIN CONCIERGE OPERATIONS ----------------

  @Get('admin/concierge')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'Admin: List all luxury inquiries and salon appointments' })
  async getInquiries(
    @Query('type') type?: InquiryType,
    @Query('status') status?: InquiryStatus,
  ) {
    return this.conciergeService.findAll(type, status);
  }

  @Get('admin/concierge/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'Admin: Get single concierge inquiry details' })
  async getInquiryById(@Param('id') id: string) {
    return this.conciergeService.findById(id);
  }

  @Put('admin/concierge/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Admin: Update inquiry status, assign advisor, schedule date' })
  async updateInquiry(
    @Param('id') id: string,
    @Body() dto: UpdateInquiryDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.conciergeService.update(id, dto, actorId);
  }

  @Delete('admin/concierge/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Admin: Permanently delete concierge inquiry' })
  async deleteInquiry(@Param('id') id: string) {
    return this.conciergeService.delete(id);
  }
}

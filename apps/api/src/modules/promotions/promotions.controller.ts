import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  CreatePromotionDto,
  ValidateCouponDto,
} from '@theblinghaven/shared';

@ApiTags('Promotions & VIP Privileges')
@Controller()
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  // ---------------- PUBLIC STOREFRONT VALIDATION ----------------

  @Public()
  @Post('promotions/validate')
  @ApiOperation({ summary: 'Public: Validate coupon code against cart and VIP tier' })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.promotionsService.validateCoupon(dto);
  }

  // ---------------- ADMIN PROMOTIONS MANAGEMENT ----------------

  @Get('admin/promotions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.PROMOTIONS_MANAGE)
  @ApiOperation({ summary: 'Admin: List all promotional codes and atelier invitations' })
  async getPromotions() {
    return this.promotionsService.findAll();
  }

  @Post('admin/promotions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.PROMOTIONS_MANAGE)
  @ApiOperation({ summary: 'Admin: Create new VIP coupon or atelier offer' })
  async createPromotion(
    @Body() dto: CreatePromotionDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.promotionsService.create(dto, actorId);
  }

  @Delete('admin/promotions/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.PROMOTIONS_MANAGE)
  @ApiOperation({ summary: 'Admin: Delete promotional code' })
  async deletePromotion(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    await this.promotionsService.delete(id, actorId);
    return { success: true, message: 'Promotion revoked.' };
  }
}

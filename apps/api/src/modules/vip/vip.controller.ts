import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VipService } from './vip.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, Public } from '../../common/decorators';
import {
  Permission,
  AuthenticateVipDto,
  SendVipMessageDto,
  ReplyVipMessageDto,
  ReserveVaultDropDto,
} from '@theblinghaven/shared';

@ApiTags('VIP Member Lounge & Secret Vault Drops')
@Controller()
export class VipController {
  constructor(private readonly vipService: VipService) {}

  // -------------------------------------------------------------
  // PUBLIC VIP GATE & CONSUMER LOUNGE
  // -------------------------------------------------------------
  @Public()
  @Post('vip/authenticate')
  @ApiOperation({ summary: 'Validate VIP Invitation Key and grant lounge access' })
  async authenticate(@Body() dto: AuthenticateVipDto) {
    return this.vipService.authenticateVip(dto.invitationKey);
  }

  @Public()
  @Get('vip/secret-drops')
  @ApiOperation({ summary: 'List unreleased Secret Vault 1-of-1 drops' })
  async getSecretDrops(@Query('tier') tier?: string) {
    return this.vipService.findSecretDrops(tier);
  }

  @Public()
  @Post('vip/reserve-drop')
  @ApiOperation({ summary: 'Place private acquisition hold on Secret Vault drop' })
  async reserveDrop(@Body() dto: ReserveVaultDropDto) {
    return this.vipService.reserveVaultDrop(dto);
  }

  @Public()
  @Get('vip/chat/history/:clientEmail')
  @ApiOperation({ summary: 'Get 1-on-1 advisor chat history for client' })
  async getChatHistory(@Param('clientEmail') clientEmail: string) {
    return this.vipService.getChatHistory(clientEmail);
  }

  @Public()
  @Post('vip/chat/send')
  @ApiOperation({ summary: 'Send message to personal jewelry director' })
  async sendMessage(@Body() dto: SendVipMessageDto) {
    return this.vipService.sendClientMessage(dto);
  }

  // -------------------------------------------------------------
  // ADMIN VIP CLIENTELING & SECRET DROPS MANAGEMENT
  // -------------------------------------------------------------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/vip/members')
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'List registered VIP members and spending tiers' })
  async getMembers() {
    return this.vipService.findAllMembers();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/vip/secret-drops')
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Mint and schedule a new Secret Vault 1-of-1 drop' })
  async mintSecretDrop(@Body() dto: any) {
    return this.vipService.mintSecretDrop(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/vip/chat/reply')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Advisor replies to VIP client in private channel' })
  async replyMessage(@Body() dto: ReplyVipMessageDto) {
    return this.vipService.sendAdvisorReply(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('admin/vip/members/:id')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Delete VIP member record' })
  async deleteMember(@Param('id') id: string) {
    return this.vipService.deleteMember(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('admin/vip/secret-drops/:id')
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Delete secret vault drop' })
  async deleteSecretDrop(@Param('id') id: string) {
    return this.vipService.deleteSecretDrop(id);
  }
}

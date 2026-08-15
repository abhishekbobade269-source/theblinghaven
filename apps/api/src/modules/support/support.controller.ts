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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, Public } from '../../common/decorators';
import {
  Permission,
  CreateTicketDto,
  AddTicketResponseDto,
  UpdateTicketStatusDto,
} from '@theblinghaven/shared';

@ApiTags('Luxury Customer Support & High-Jewelry Ticket Desk')
@Controller()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Public()
  @Post('support/tickets')
  @ApiOperation({ summary: 'Submit a new customer support ticket' })
  async createTicket(@Body() dto: CreateTicketDto) {
    return this.supportService.createTicket(dto);
  }

  @Public()
  @Get('support/tickets/track/:ticketNumber')
  @ApiOperation({ summary: 'Track a support ticket by ticket number' })
  async getTicketByNumberTrack(@Param('ticketNumber') ticketNumber: string) {
    return this.supportService.getTicketByNumber(ticketNumber);
  }

  @Public()
  @Get('support/tickets/:ticketNumber')
  @ApiOperation({ summary: 'Get support ticket by ticket number' })
  async getTicketByNumber(@Param('ticketNumber') ticketNumber: string) {
    return this.supportService.getTicketByNumber(ticketNumber);
  }

  @Public()
  @Post('support/tickets/:ticketNumber/reply')
  @ApiOperation({ summary: 'Public client reply to support ticket' })
  async clientReply(
    @Param('ticketNumber') ticketNumber: string,
    @Body() dto: AddTicketResponseDto,
  ) {
    return this.supportService.addTicketResponseByNumberOrId(ticketNumber, {
      ...dto,
      senderRole: 'CLIENT',
      isInternalNote: false,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/support/tickets')
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'List support tickets for admin support desk' })
  async getTickets(
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('priority') priority?: string,
  ) {
    return this.supportService.getAllTicketsAdmin(status, category, priority);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/support/tickets/:id')
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'Get ticket details and conversation thread' })
  async getTicketById(@Param('id') id: string) {
    return this.supportService.getTicketByIdAdmin(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/support/tickets/:id/reply')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Reply to a support ticket or add internal staff note' })
  async addResponse(
    @Param('id') id: string,
    @Body() dto: AddTicketResponseDto,
    @Req() req: any,
  ) {
    const senderName = dto.senderName || req.user?.firstName || 'Support Director';
    return this.supportService.addTicketResponseByNumberOrId(id, {
      ...dto,
      senderName,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('admin/support/tickets/:id/status')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Update ticket resolution status or assigned agent' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    return this.supportService.updateTicketStatus(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('admin/support/tickets/:id')
  @RequirePermissions(Permission.CUSTOMERS_WRITE)
  @ApiOperation({ summary: 'Permanently delete a support ticket' })
  async deleteTicket(@Param('id') id: string) {
    return this.supportService.deleteTicket(id);
  }
}

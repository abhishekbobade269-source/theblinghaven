import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VaultsService } from './vaults.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators';
import {
  Permission,
  CreateArmoredTransferDto,
  UpdateTransferStatusDto,
} from '@theblinghaven/shared';

@ApiTags('Multi-Vault Network & Armored Freight Dispatch')
@Controller()
export class VaultsController {
  constructor(private readonly vaultsService: VaultsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/vaults')
  @RequirePermissions(Permission.INVENTORY_READ)
  @ApiOperation({ summary: 'List international luxury vaults and reserves' })
  async getVaults() {
    return this.vaultsService.findAllVaults();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/vaults/transfers')
  @RequirePermissions(Permission.INVENTORY_READ)
  @ApiOperation({ summary: 'List all armored freight transfer manifests' })
  async getTransfers() {
    return this.vaultsService.findTransfers();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('admin/vaults/transfers')
  @RequirePermissions(Permission.INVENTORY_ADJUST)
  @ApiOperation({ summary: 'Dispatch an armored inter-vault shipment' })
  async createTransfer(@Body() dto: CreateArmoredTransferDto) {
    return this.vaultsService.createTransfer(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('admin/vaults/transfers/:id/status')
  @RequirePermissions(Permission.INVENTORY_ADJUST)
  @ApiOperation({ summary: 'Update armored transfer status and waypoint' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTransferStatusDto,
  ) {
    return this.vaultsService.updateTransferStatus(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('admin/vaults/transfers/:id')
  @RequirePermissions(Permission.INVENTORY_ADJUST)
  @ApiOperation({ summary: 'Delete or cancel an armored transfer manifest' })
  async deleteTransfer(@Param('id') id: string) {
    return this.vaultsService.deleteTransfer(id);
  }
}

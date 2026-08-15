import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import { Permission, AdjustStockDto } from '@theblinghaven/shared';

@ApiTags('Vault & Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @RequirePermissions(Permission.INVENTORY_READ)
  @ApiOperation({ summary: 'List all vault items with available & reserved counts' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'lowStockOnly', required: false, type: Boolean })
  async getInventory(
    @Query('search') search?: string,
    @Query('lowStockOnly') lowStockOnly?: boolean,
  ) {
    return this.inventoryService.findAllInventory({
      search,
      lowStockOnly: lowStockOnly === true || String(lowStockOnly) === 'true',
    });
  }

  @Post('adjust')
  @RequirePermissions(Permission.INVENTORY_ADJUST)
  @ApiOperation({ summary: 'Adjust stock count with audit reason' })
  async adjustStock(
    @Body() dto: AdjustStockDto,
    @CurrentUser('id') actorId: string,
    @CurrentUser('email') actorEmail: string,
  ) {
    return this.inventoryService.adjustStock(dto, actorId, actorEmail);
  }

  @Get('logs')
  @RequirePermissions(Permission.INVENTORY_READ)
  @ApiOperation({ summary: 'Get global stock movement audit ledger' })
  async getLogs() {
    return this.inventoryService.getLogs();
  }

  @Get(':productId/logs')
  @RequirePermissions(Permission.INVENTORY_READ)
  @ApiOperation({ summary: 'Get stock movement audit ledger for specific SKU' })
  async getProductLogs(@Param('productId') productId: string) {
    return this.inventoryService.getLogs(productId);
  }
}

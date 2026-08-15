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
import { BespokeService } from './bespoke.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  SubmitBespokeDto,
  UpdateBespokeDto,
  BespokeStatus,
} from '@theblinghaven/shared';

@ApiTags('Bespoke Atelier Studio')
@Controller()
export class BespokeController {
  constructor(private readonly bespokeService: BespokeService) {}

  // ---------------- PUBLIC STOREFRONT BESPOKE STUDIO ----------------

  @Public()
  @Post('bespoke/submit')
  @ApiOperation({ summary: 'Public: Submit custom 3D bespoke jewelry design brief' })
  async submitBespoke(@Body() dto: SubmitBespokeDto) {
    return this.bespokeService.submit(dto);
  }

  // ---------------- ADMIN BESPOKE ATELIER MANAGEMENT ----------------

  @Get('admin/bespoke')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Admin: List all bespoke jewelry projects in pipeline' })
  async getBespokeProjects(
    @Query('status') status?: BespokeStatus,
    @Query('category') category?: string,
  ) {
    return this.bespokeService.findAll(status, category);
  }

  @Get('admin/bespoke/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Admin: Get single bespoke project details & CAD status' })
  async getBespokeById(@Param('id') id: string) {
    return this.bespokeService.findById(id);
  }

  @Put('admin/bespoke/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Update bespoke status, attach 3D CAD URL, quote price' })
  async updateBespoke(
    @Param('id') id: string,
    @Body() dto: UpdateBespokeDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.bespokeService.update(id, dto, actorId);
  }

  @Delete('admin/bespoke/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Permanently delete bespoke commission' })
  async deleteBespoke(@Param('id') id: string) {
    return this.bespokeService.delete(id);
  }
}

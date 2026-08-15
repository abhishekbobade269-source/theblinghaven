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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  CreateProductDto,
  UpdateProductDto,
} from '@theblinghaven/shared';

@ApiTags('Catalog & Products')
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // ---------------- PUBLIC STOREFRONT ENDPOINTS ----------------

  @Public()
  @Get('catalog/categories')
  @ApiOperation({ summary: 'Public: List all jewelry categories' })
  async getPublicCategories() {
    return this.catalogService.findAllCategories();
  }

  @Public()
  @Get('catalog/collections')
  @ApiOperation({ summary: 'Public: List all premier collections' })
  async getPublicCollections() {
    return this.catalogService.findAllCollections();
  }

  @Public()
  @Get('catalog/products')
  @ApiOperation({ summary: 'Public: Browse jewelry products with filters' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'collectionId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPublicProducts(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('collectionId') collectionId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.catalogService.findAllProducts({
      search,
      categoryId,
      collectionId,
      status: 'ACTIVE',
      page,
      limit,
    });
  }

  @Public()
  @Get('catalog/products/:slug')
  @ApiOperation({ summary: 'Public: Get single jewelry product details by slug' })
  async getPublicProductBySlug(@Param('slug') slug: string) {
    return this.catalogService.findProductBySlug(slug);
  }

  // ---------------- ADMIN CATALOG ENDPOINTS ----------------

  @Get('admin/catalog/products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Admin: List all products across all statuses' })
  async getAdminProducts(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('collectionId') collectionId?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.catalogService.findAllProducts({
      search,
      categoryId,
      collectionId,
      status,
      page,
      limit,
    });
  }

  @Get('admin/catalog/products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Admin: Get single product by ID' })
  async getAdminProductById(@Param('id') id: string) {
    return this.catalogService.findProductById(id);
  }

  @Post('admin/catalog/products')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Create new jewelry SKU' })
  async createProduct(@Body() dto: CreateProductDto, @CurrentUser('id') actorId: string) {
    return this.catalogService.createProduct(dto, actorId);
  }

  @Put('admin/catalog/products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_WRITE)
  @ApiOperation({ summary: 'Admin: Update jewelry SKU details and pricing' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.catalogService.updateProduct(id, dto, actorId);
  }

  @Delete('admin/catalog/products/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_DELETE)
  @ApiOperation({ summary: 'Admin: Delete product SKU' })
  async deleteProduct(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    await this.catalogService.deleteProduct(id, actorId);
    return { success: true, message: 'Product SKU removed.' };
  }

  @Get('admin/catalog/categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Admin: List all categories with product counts' })
  async getAdminCategories() {
    return this.catalogService.findAllCategories();
  }

  @Get('admin/catalog/collections')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CATALOG_READ)
  @ApiOperation({ summary: 'Admin: List all collections' })
  async getAdminCollections() {
    return this.catalogService.findAllCollections();
  }
}

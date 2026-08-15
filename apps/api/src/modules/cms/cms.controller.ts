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
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser, Public } from '../../common/decorators';
import {
  Permission,
  CreateCmsPageDto,
  UpdateCmsPageDto,
  CreateHeroBannerDto,
  UpdateHeroBannerDto,
} from '@theblinghaven/shared';

@ApiTags('Admin CMS & Content')
@Controller()
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // ---------------- PUBLIC STOREFRONT ENDPOINTS ----------------

  @Public()
  @Get('cms/pages/:slug')
  @ApiOperation({ summary: 'Public: Get published CMS page by slug' })
  async getPublicPage(@Param('slug') slug: string) {
    return this.cmsService.findPageBySlug(slug);
  }

  @Public()
  @Get('cms/banners')
  @ApiOperation({ summary: 'Public: Get active homepage hero carousel banners' })
  async getPublicBanners() {
    return this.cmsService.findAllBanners(true);
  }

  // ---------------- ADMIN CMS PAGES ----------------

  @Get('admin/cms/pages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_READ)
  @ApiOperation({ summary: 'Admin: List all CMS pages' })
  async getAllPages() {
    return this.cmsService.findAllPages();
  }

  @Get('admin/cms/pages/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_READ)
  @ApiOperation({ summary: 'Admin: Get CMS page by ID' })
  async getPageById(@Param('id') id: string) {
    return this.cmsService.findPageById(id);
  }

  @Post('admin/cms/pages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_WRITE)
  @ApiOperation({ summary: 'Admin: Create a new CMS page' })
  async createPage(@Body() dto: CreateCmsPageDto, @CurrentUser('id') actorId: string) {
    return this.cmsService.createPage(dto, actorId);
  }

  @Put('admin/cms/pages/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_WRITE)
  @ApiOperation({ summary: 'Admin: Update CMS page' })
  async updatePage(
    @Param('id') id: string,
    @Body() dto: UpdateCmsPageDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.cmsService.updatePage(id, dto, actorId);
  }

  @Delete('admin/cms/pages/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_WRITE)
  @ApiOperation({ summary: 'Admin: Delete CMS page' })
  async deletePage(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    await this.cmsService.deletePage(id, actorId);
    return { success: true, message: 'Page deleted successfully.' };
  }

  // ---------------- ADMIN HERO BANNERS ----------------

  @Get('admin/cms/banners')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_READ)
  @ApiOperation({ summary: 'Admin: List all homepage hero banners' })
  async getAllBanners() {
    return this.cmsService.findAllBanners(false);
  }

  @Post('admin/cms/banners')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_WRITE)
  @ApiOperation({ summary: 'Admin: Create homepage hero banner' })
  async createBanner(@Body() dto: CreateHeroBannerDto, @CurrentUser('id') actorId: string) {
    return this.cmsService.createBanner(dto, actorId);
  }

  @Put('admin/cms/banners/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_WRITE)
  @ApiOperation({ summary: 'Admin: Update homepage hero banner' })
  async updateBanner(
    @Param('id') id: string,
    @Body() dto: UpdateHeroBannerDto,
    @CurrentUser('id') actorId: string,
  ) {
    return this.cmsService.updateBanner(id, dto, actorId);
  }

  @Delete('admin/cms/banners/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RequirePermissions(Permission.CMS_WRITE)
  @ApiOperation({ summary: 'Admin: Delete hero banner' })
  async deleteBanner(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    await this.cmsService.deleteBanner(id, actorId);
    return { success: true, message: 'Banner deleted successfully.' };
  }

  // ---------------- UNIVERSAL PAGE CONTROLS ----------------

  @Public()
  @Get('cms/page-controls')
  @ApiOperation({ summary: 'Public/Admin: Get all universal page controls' })
  async getAllPageControls() {
    return this.cmsService.findAllPageControls();
  }

  @Public()
  @Get('cms/page-controls/route')
  @ApiOperation({ summary: 'Public/Admin: Query page control by route path' })
  async getPageControlByRoute(@Query('path') pathParam: string) {
    return this.cmsService.findPageControlByRoute(pathParam || '/');
  }

  @Public()
  @Get('cms/custom-pages/:slug')
  @ApiOperation({ summary: 'Public: Get custom page with populated products' })
  async getCustomPageWithProducts(@Param('slug') slug: string) {
    return this.cmsService.findCustomPageWithProducts(slug);
  }

  @Public()
  @Put('cms/page-controls/:id')
  @ApiOperation({ summary: 'Update page control status and settings' })
  async updatePageControlPublic(
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.cmsService.updatePageControl(id, data);
  }

  @Put('admin/cms/page-controls/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Admin: Update page control status and settings' })
  async updatePageControl(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser('id') actorId: string,
  ) {
    return this.cmsService.updatePageControl(id, data, actorId);
  }

  @Public()
  @Post('cms/page-controls/custom')
  @ApiOperation({ summary: 'Create new custom showcase page' })
  async createCustomPageControlPublic(
    @Body() data: any,
  ) {
    return this.cmsService.createCustomPageControl(data);
  }

  @Post('admin/cms/page-controls/custom')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Admin: Create new custom showcase page' })
  async createCustomPageControl(
    @Body() data: any,
    @CurrentUser('id') actorId: string,
  ) {
    return this.cmsService.createCustomPageControl(data, actorId);
  }

  @Public()
  @Delete('cms/page-controls/:id')
  @ApiOperation({ summary: 'Delete custom page' })
  async deletePageControlPublic(
    @Param('id') id: string,
  ) {
    await this.cmsService.deletePageControl(id);
    return { success: true, message: 'Custom page deleted successfully.' };
  }

  @Delete('admin/cms/page-controls/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Admin: Delete custom page' })
  async deletePageControl(
    @Param('id') id: string,
    @CurrentUser('id') actorId: string,
  ) {
    await this.cmsService.deletePageControl(id, actorId);
    return { success: true, message: 'Custom page deleted successfully.' };
  }

  // ---------------- INSTAGRAM FEED & REAL ACCOUNT ENDPOINTS ----------------

  @Public()
  @Get('cms/instagram-config')
  @ApiOperation({ summary: 'Public: Get Instagram profile configuration' })
  async getPublicInstagramConfig() {
    return this.cmsService.getInstagramConfig();
  }

  @Public()
  @Get('admin/cms/instagram-config')
  @ApiOperation({ summary: 'Admin: Get Instagram configuration and token status' })
  async getAdminInstagramConfig() {
    return this.cmsService.getInstagramConfig();
  }

  @Public()
  @Put('admin/cms/instagram-config')
  @ApiOperation({ summary: 'Admin: Update Instagram configuration & Access Token' })
  async updateInstagramConfig(@Body() data: any) {
    return this.cmsService.updateInstagramConfig(data);
  }

  @Public()
  @Get('cms/instagram-feed')
  @ApiOperation({ summary: 'Public: Get active Instagram posts & reels' })
  async getPublicInstagramFeed() {
    return this.cmsService.findAllInstagramPosts(true);
  }

  @Public()
  @Get('admin/cms/instagram-feed')
  @ApiOperation({ summary: 'Admin: List all Instagram posts & reels' })
  async getAdminInstagramFeed() {
    return this.cmsService.findAllInstagramPosts(false);
  }

  @Public()
  @Post('admin/cms/instagram-feed')
  @ApiOperation({ summary: 'Admin: Create new Instagram post or reel' })
  async createInstagramPost(@Body() data: any) {
    return this.cmsService.createInstagramPost(data);
  }

  @Public()
  @Put('admin/cms/instagram-feed/:id')
  @ApiOperation({ summary: 'Admin: Update Instagram post or reel' })
  async updateInstagramPost(@Param('id') id: string, @Body() data: any) {
    return this.cmsService.updateInstagramPost(id, data);
  }

  @Public()
  @Delete('admin/cms/instagram-feed/:id')
  @ApiOperation({ summary: 'Admin: Delete Instagram post' })
  async deleteInstagramPost(@Param('id') id: string) {
    await this.cmsService.deleteInstagramPost(id);
    return { success: true, message: 'Instagram post removed successfully.' };
  }

  @Public()
  @Delete('admin/cms/instagram-feed-clear-all')
  @ApiOperation({ summary: 'Admin: Clear all fake / demo Instagram posts' })
  async clearAllInstagramPosts() {
    return this.cmsService.clearAllInstagramPosts();
  }

  @Public()
  @Post('admin/cms/instagram-feed/sync')
  @ApiOperation({ summary: 'Admin: Sync Instagram feed' })
  async syncInstagramFeed() {
    return this.cmsService.syncRealInstagramFeed();
  }

  @Public()
  @Post('admin/cms/instagram-feed/import-url')
  @ApiOperation({ summary: 'Admin: Import single real Instagram Post or Reel by URL' })
  async importInstagramUrl(@Body() body: { url: string; mediaType?: 'IMAGE' | 'REEL'; caption?: string }) {
    return this.cmsService.importInstagramUrl(body.url, body.mediaType, body.caption);
  }
}

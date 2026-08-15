import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import { Permission, MediaCategory } from '@theblinghaven/shared';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@ApiTags('Admin Media & Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @RequirePermissions(Permission.MEDIA_READ)
  @ApiOperation({ summary: 'List all jewelry photography & media assets with filtering' })
  @ApiQuery({ name: 'category', required: false, enum: ['ALL', 'BANGLES', 'BRIDAL', 'EARRINGS', 'RINGS', 'HANDMADE', 'SETS', 'BANNERS', 'GENERAL'] })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMedia(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.mediaService.findAll({ category, search, page, limit });
  }

  @Get(':id')
  @RequirePermissions(Permission.MEDIA_READ)
  @ApiOperation({ summary: 'Get details of a single media asset' })
  async getMediaAsset(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Post('upload')
  @RequirePermissions(Permission.MEDIA_UPLOAD)
  @ApiOperation({ summary: 'Upload high-resolution photography or jewelry asset' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname).toLowerCase();
          cb(null, `jewelry_${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
    }),
  )
  async uploadFile(
    @UploadedFile() file: any,
    @Body() body: { category?: MediaCategory; altText?: string },
    @CurrentUser('id') actorId: string,
  ) {
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    // Sync to admin public uploads if available
    const adminUploadPath = path.join(process.cwd(), '..', 'admin', 'public', 'uploads', file.filename);
    try {
      fs.mkdirSync(path.dirname(adminUploadPath), { recursive: true });
      fs.copyFileSync(file.path, adminUploadPath);
    } catch (e) {
      // Ignore if admin folder path differs
    }

    return this.mediaService.create({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      category: body.category || 'GENERAL',
      altText: body.altText || file.originalname.replace(/\.[^/.]+$/, ''),
      actorId,
    });
  }

  @Delete(':id')
  @RequirePermissions(Permission.MEDIA_DELETE)
  @ApiOperation({ summary: 'Delete a media asset' })
  async deleteMedia(@Param('id') id: string, @CurrentUser('id') actorId: string) {
    await this.mediaService.delete(id, actorId);
    return { success: true, message: 'Media asset removed.' };
  }
}

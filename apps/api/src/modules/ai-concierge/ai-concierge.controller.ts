import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiConciergeService } from './ai-concierge.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, Public } from '../../common/decorators';
import { Permission, AiConciergeQueryDto } from '@theblinghaven/shared';

@ApiTags('AI Voice Concierge & Conversational Gemologist')
@Controller()
export class AiConciergeController {
  constructor(private readonly aiConciergeService: AiConciergeService) {}

  @Public()
  @Post('ai-concierge/ask')
  @ApiOperation({ summary: 'Ask AI Senior Gemologist a voice or text query' })
  async ask(@Body() dto: AiConciergeQueryDto) {
    return this.aiConciergeService.processQuery(dto);
  }

  @Public()
  @Get('ai-concierge/topics')
  @ApiOperation({ summary: 'Get curated luxury gemology topics' })
  async getTopics() {
    return this.aiConciergeService.getCuratedTopics();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/ai-concierge/logs')
  @RequirePermissions(Permission.CUSTOMERS_READ)
  @ApiOperation({ summary: 'List recent AI voice consultation logs and intent metrics' })
  async getLogs() {
    return this.aiConciergeService.getLogs();
  }
}

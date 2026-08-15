import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions, CurrentUser } from '../../common/decorators';
import { AdminRole, Permission } from '@theblinghaven/shared';

@ApiTags('Admin Users & Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(Permission.ADMIN_READ)
  @ApiOperation({ summary: 'List all admin users with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.usersService.findAll({ page, limit, search, role });
  }

  @Get('roles-matrix')
  @RequirePermissions(Permission.ROLES_MANAGE, Permission.ADMIN_READ)
  @ApiOperation({ summary: 'Get full RBAC matrix of all 10 roles, capabilities, and active admin counts' })
  async getRolesMatrix() {
    return this.usersService.getRolesMatrix();
  }

  @Put('roles-matrix/:role')
  @RequirePermissions(Permission.ROLES_MANAGE)
  @ApiOperation({ summary: 'Update permissions granted to a specific role' })
  async updateRolePermissions(
    @Param('role') role: AdminRole,
    @Body() dto: { permissions: Permission[] },
    @CurrentUser('id') actorId: string,
  ) {
    return this.usersService.updateRolePermissions(role, dto.permissions, actorId);
  }

  @Get(':id')
  @RequirePermissions(Permission.ADMIN_READ)
  @ApiOperation({ summary: 'Get details of a specific admin user' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/audit')
  @RequirePermissions(Permission.AUDIT_READ, Permission.ADMIN_READ)
  @ApiOperation({ summary: 'Get chronological security and operational audit history for a specific admin' })
  async getUserAudit(@Param('id') id: string) {
    return this.usersService.getUserAuditHistory(id);
  }

  @Post()
  @RequirePermissions(Permission.ADMIN_WRITE)
  @ApiOperation({ summary: 'Create a new admin user' })
  async createUser(
    @Body()
    dto: {
      email: string;
      password?: string;
      firstName: string;
      lastName: string;
      role: AdminRole;
    },
    @CurrentUser('id') actorId: string,
  ) {
    return this.usersService.create(dto, actorId);
  }

  @Put(':id')
  @RequirePermissions(Permission.ADMIN_WRITE)
  @ApiOperation({ summary: 'Update admin user role or status' })
  async updateUser(
    @Param('id') id: string,
    @Body()
    dto: {
      firstName?: string;
      lastName?: string;
      role?: AdminRole;
      isActive?: boolean;
    },
    @CurrentUser('id') actorId: string,
  ) {
    return this.usersService.update(id, dto, actorId);
  }

  @Post(':id/unlock')
  @RequirePermissions(Permission.SECURITY_MANAGE)
  @ApiOperation({ summary: 'Unlock a locked admin account' })
  async unlockUser(
    @Param('id') id: string,
    @CurrentUser('id') actorId: string,
  ) {
    await this.usersService.unlockUser(id, actorId);
    return { success: true, message: 'User account has been unlocked.' };
  }
}

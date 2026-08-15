import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole, Permission, ROLE_PERMISSIONS } from '@theblinghaven/shared';
import { ROLES_KEY, PERMISSIONS_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'Access denied: User does not have the required permissions.',
      });
    }

    // Super Admin has all access
    if (user.role === AdminRole.SUPER_ADMIN) {
      return true;
    }

    // Check Role match if specified
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(user.role as AdminRole);
      if (!hasRole) {
        throw new ForbiddenException({
          code: 'INSUFFICIENT_ROLE',
          message: 'Access denied: Your role does not permit this operation.',
        });
      }
    }

    // Check Permission match if specified
    if (requiredPermissions && requiredPermissions.length > 0) {
      const userPermissions = ROLE_PERMISSIONS[user.role as AdminRole] || [];
      const hasAllPermissions = requiredPermissions.every((perm) =>
        userPermissions.includes(perm),
      );

      if (!hasAllPermissions) {
        throw new ForbiddenException({
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied: Missing required permission for this resource.',
        });
      }
    }

    return true;
  }
}

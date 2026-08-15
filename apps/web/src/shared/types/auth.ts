import { AdminRole, Permission } from './roles';

export interface AdminUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
  permissions: Permission[];
  mfaEnabled: boolean;
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface LoginResponseDto {
  requireMfa?: boolean;
  mfaToken?: string;
  accessToken?: string;
  user?: AdminUserDto;
}

export interface AdminSessionDto {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface MfaSetupResponseDto {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl: string;
}

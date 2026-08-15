import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  AdminRole,
  AuditEventType,
  AdminUserDto,
  AdminSessionDto,
  LoginResponseDto,
  MfaSetupResponseDto,
  ROLE_PERMISSIONS,
} from '@theblinghaven/shared';

// Argon2 with safe crypto fallback
let argon2: any;
try {
  argon2 = require('argon2');
} catch (e) {
  argon2 = null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditService: AuditService,
  ) {
    authenticator.options = { window: 1 };
  }

  // Password hashing with Argon2id (or PBKDF2/scrypt fallback)
  async hashPassword(password: string): Promise<string> {
    if (argon2) {
      return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1,
      });
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `scrypt:${salt}:${hash}`;
  }

  async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    if (storedHash.startsWith('scrypt:')) {
      const [, salt, hash] = storedHash.split(':');
      const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
      return crypto.timingSafeEqual(
        Buffer.from(hash, 'hex'),
        Buffer.from(verifyHash, 'hex'),
      );
    }
    if (argon2) {
      try {
        return await argon2.verify(storedHash, password);
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  // Admin Login with Brute-Force Lockout & MFA Step-Up
  async login(
    email: string,
    pass: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    const genericErrorMessage = 'Invalid email or password.';

    const user = await this.prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      await this.auditService.log({
        eventType: AuditEventType.AUTH_LOGIN_FAILED,
        userEmail: email,
        ipAddress,
        userAgent,
        metadata: { reason: 'User not found' },
      });
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: genericErrorMessage,
      });
    }

    // Check account lockout
    if (user.lockoutUntil && new Date() < user.lockoutUntil) {
      const minutesRemaining = Math.ceil(
        (user.lockoutUntil.getTime() - Date.now()) / (1000 * 60),
      );
      await this.auditService.log({
        eventType: AuditEventType.AUTH_LOGIN_FAILED,
        userId: user.id,
        userEmail: user.email,
        ipAddress,
        userAgent,
        metadata: { reason: 'Account locked due to consecutive failures' },
      });
      throw new ForbiddenException({
        code: 'ACCOUNT_LOCKED',
        message: `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes.`,
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({
        code: 'ACCOUNT_DISABLED',
        message: 'This account has been deactivated. Please contact Super Admin.',
      });
    }

    const isPasswordValid = await this.verifyPassword(pass, user.passwordHash);
    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const shouldLock = failedAttempts >= 5;
      const lockoutTime = shouldLock
        ? new Date(Date.now() + 15 * 60 * 1000)
        : null;

      await this.prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
          lockoutUntil: lockoutTime,
        },
      });

      await this.auditService.log({
        eventType: AuditEventType.AUTH_LOGIN_FAILED,
        userId: user.id,
        userEmail: user.email,
        ipAddress,
        userAgent,
        metadata: { failedAttempts, lockedOut: shouldLock },
      });

      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: genericErrorMessage,
      });
    }

    // Reset failed attempts on valid password
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockoutUntil: null },
    });

    // Check if MFA is required
    if (user.mfaEnabled) {
      const mfaSecret = this.configService.get<string>(
        'JWT_MFA_SECRET',
        'the_bling_haven_jwt_mfa_temporary_secret_key_2026_luxury_commerce',
      );
      const mfaToken = this.jwtService.sign(
        { sub: user.id, email: user.email, purpose: 'mfa_challenge' },
        { secret: mfaSecret, expiresIn: '5m' },
      );

      return {
        requireMfa: true,
        mfaToken,
      };
    }

    // Create session & generate access token
    return this.createSessionAndIssueTokens(user, ipAddress, userAgent);
  }

  // Verify MFA Challenge Code
  async verifyMfaChallenge(
    mfaToken: string,
    code: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    const mfaSecret = this.configService.get<string>(
      'JWT_MFA_SECRET',
      'the_bling_haven_jwt_mfa_temporary_secret_key_2026_luxury_commerce',
    );

    let payload: any;
    try {
      payload = this.jwtService.verify(mfaToken, { secret: mfaSecret });
    } catch (e) {
      throw new UnauthorizedException({
        code: 'MFA_TOKEN_EXPIRED',
        message: 'MFA session expired. Please log in again.',
      });
    }

    if (payload.purpose !== 'mfa_challenge' || !payload.sub) {
      throw new UnauthorizedException({
        code: 'INVALID_MFA_TOKEN',
        message: 'Invalid MFA challenge token.',
      });
    }

    const user = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.mfaSecret || !user.isActive) {
      throw new UnauthorizedException({
        code: 'MFA_NOT_CONFIGURED',
        message: 'MFA is not configured for this user.',
      });
    }

    const isValid = authenticator.verify({
      token: code.trim(),
      secret: user.mfaSecret,
    });

    if (!isValid) {
      await this.auditService.log({
        eventType: AuditEventType.AUTH_MFA_FAILED,
        userId: user.id,
        userEmail: user.email,
        ipAddress,
        userAgent,
      });
      throw new UnauthorizedException({
        code: 'INVALID_MFA_CODE',
        message: 'Invalid authentication code. Please check your authenticator app.',
      });
    }

    await this.auditService.log({
      eventType: AuditEventType.AUTH_MFA_VERIFIED,
      userId: user.id,
      userEmail: user.email,
      ipAddress,
      userAgent,
    });

    return this.createSessionAndIssueTokens(user, ipAddress, userAgent);
  }

  // Setup MFA for an authenticated admin
  async setupMfa(userId: string): Promise<MfaSetupResponseDto> {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      'The Bling Haven Admin',
      secret,
    );
    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl);

    // Temporarily save secret
    await this.prisma.adminUser.update({
      where: { id: userId },
      data: { mfaSecret: secret },
    });

    return {
      secret,
      qrCodeUrl,
      otpauthUrl,
    };
  }

  // Enable MFA after testing valid TOTP code
  async enableMfa(
    userId: string,
    code: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<boolean> {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: userId },
    });
    if (!user || !user.mfaSecret) {
      throw new BadRequestException('MFA setup was not initiated.');
    }

    const isValid = authenticator.verify({
      token: code.trim(),
      secret: user.mfaSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid code. Could not verify authenticator.');
    }

    await this.prisma.adminUser.update({
      where: { id: userId },
      data: { mfaEnabled: true },
    });

    await this.auditService.log({
      eventType: AuditEventType.AUTH_MFA_ENABLED,
      userId: user.id,
      userEmail: user.email,
      ipAddress,
      userAgent,
    });

    return true;
  }

  // Issue Session & JWT Tokens
  private async createSessionAndIssueTokens(
    user: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<LoginResponseDto> {
    const sessionId = crypto.randomUUID();
    const tokenHash = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.adminSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        tokenHash,
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
        deviceType: this.parseDeviceType(userAgent),
        expiresAt,
      },
    });

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'the_bling_haven_jwt_access_super_secret_key_2026_luxury_commerce',
      ),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m'),
    });

    await this.auditService.log({
      eventType: AuditEventType.AUTH_LOGIN_SUCCESS,
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      ipAddress,
      userAgent,
      metadata: { sessionId },
    });

    const userDto: AdminUserDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as AdminRole,
      permissions: ROLE_PERMISSIONS[user.role as AdminRole] || [],
      mfaEnabled: user.mfaEnabled,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      accessToken,
      user: userDto,
    };
  }

  // Logout & Session Revocation
  async logout(
    userId: string,
    sessionId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.prisma.adminSession.updateMany({
      where: { id: sessionId, userId },
      data: { isRevoked: true },
    });

    await this.auditService.log({
      eventType: AuditEventType.AUTH_LOGOUT,
      userId,
      ipAddress,
      userAgent,
      metadata: { sessionId },
    });
  }

  // List Active Sessions for Current User
  async getSessions(
    userId: string,
    currentSessionId: string,
  ): Promise<AdminSessionDto[]> {
    const sessions = await this.prisma.adminSession.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { lastActiveAt: 'desc' },
    });

    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      ipAddress: s.ipAddress || 'unknown',
      userAgent: s.userAgent || 'unknown',
      deviceType: s.deviceType || 'Desktop',
      lastActiveAt: s.lastActiveAt.toISOString(),
      createdAt: s.createdAt.toISOString(),
      isCurrent: s.id === currentSessionId,
    }));
  }

  // Revoke Specific Session
  async revokeSession(
    userId: string,
    targetSessionId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.prisma.adminSession.updateMany({
      where: { id: targetSessionId, userId },
      data: { isRevoked: true },
    });

    await this.auditService.log({
      eventType: AuditEventType.AUTH_SESSION_REVOKED,
      userId,
      ipAddress,
      userAgent,
      metadata: { revokedSessionId: targetSessionId },
    });
  }

  // Revoke All Other Sessions
  async revokeAllOtherSessions(
    userId: string,
    currentSessionId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    await this.prisma.adminSession.updateMany({
      where: {
        userId,
        id: { not: currentSessionId },
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    await this.auditService.log({
      eventType: AuditEventType.AUTH_ALL_SESSIONS_REVOKED,
      userId,
      ipAddress,
      userAgent,
      metadata: { retainedSessionId: currentSessionId },
    });
  }

  // Request Password Reset
  async requestPasswordReset(
    email: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ message: string; previewToken?: string }> {
    const user = await this.prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Uniform response to prevent account enumeration
    const genericResponse = {
      message:
        'If an active account exists with that email, a password reset link has been dispatched.',
    };

    if (!user || !user.isActive) {
      await this.auditService.log({
        eventType: AuditEventType.AUTH_PASSWORD_RESET_REQ,
        userEmail: email,
        ipAddress,
        userAgent,
        metadata: { outcome: 'User not found or inactive' },
      });
      return genericResponse;
    }

    // Invalidate existing unused tokens
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, isUsed: false },
      data: { isUsed: true },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await this.auditService.log({
      eventType: AuditEventType.AUTH_PASSWORD_RESET_REQ,
      userId: user.id,
      userEmail: user.email,
      ipAddress,
      userAgent,
      metadata: { expiresAt },
    });

    // In local development, return token preview for convenience
    const isDev =
      this.configService.get<string>('APP_ENV', 'development') ===
      'development';
    return {
      ...genericResponse,
      ...(isDev ? { previewToken: rawToken } : {}),
    };
  }

  // Reset Password using Single-Use Expiring Token
  async resetPassword(
    token: string,
    newPass: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !resetRecord ||
      resetRecord.isUsed ||
      new Date() > resetRecord.expiresAt
    ) {
      throw new BadRequestException({
        code: 'INVALID_OR_EXPIRED_TOKEN',
        message: 'This password reset link is invalid or has expired.',
      });
    }

    const newHash = await this.hashPassword(newPass);

    // Update password, mark token used, revoke all current sessions
    await this.prisma.$transaction([
      this.prisma.adminUser.update({
        where: { id: resetRecord.userId },
        data: {
          passwordHash: newHash,
          failedLoginAttempts: 0,
          lockoutUntil: null,
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { isUsed: true },
      }),
      this.prisma.adminSession.updateMany({
        where: { userId: resetRecord.userId, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);

    await this.auditService.log({
      eventType: AuditEventType.AUTH_PASSWORD_RESET_SUCCESS,
      userId: resetRecord.userId,
      userEmail: resetRecord.user.email,
      ipAddress,
      userAgent,
    });
  }

  private parseDeviceType(userAgent?: string): string {
    if (!userAgent) return 'Desktop';
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android'))
      return 'Mobile';
    if (ua.includes('ipad') || ua.includes('tablet')) return 'Tablet';
    return 'Desktop';
  }
}

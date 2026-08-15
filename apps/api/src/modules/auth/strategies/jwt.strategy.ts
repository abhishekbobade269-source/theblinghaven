import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { AdminRole, ROLE_PERMISSIONS } from '@theblinghaven/shared';

export interface JwtPayload {
  sub: string;
  email: string;
  role: AdminRole;
  sessionId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => request?.cookies?.['tbh_admin_token'],
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_ACCESS_SECRET',
        'the_bling_haven_jwt_access_super_secret_key_2026_luxury_commerce',
      ),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId, sessionId } = payload;

    const [user, session] = await Promise.all([
      this.prisma.adminUser.findUnique({
        where: { id: userId },
      }),
      this.prisma.adminSession.findUnique({
        where: { id: sessionId },
      }),
    ]);

    if (!user || !user.isActive) {
      throw new UnauthorizedException({
        code: 'USER_INACTIVE_OR_NOT_FOUND',
        message: 'Account is inactive or does not exist.',
      });
    }

    if (!session || session.isRevoked || new Date() > session.expiresAt) {
      throw new UnauthorizedException({
        code: 'SESSION_REVOKED',
        message: 'Session has expired or was revoked. Please log in again.',
      });
    }

    // Touch session lastActiveAt (async without blocking)
    this.prisma.adminSession
      .update({
        where: { id: sessionId },
        data: { lastActiveAt: new Date() },
      })
      .catch(() => {});

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as AdminRole,
      permissions: ROLE_PERMISSIONS[user.role as AdminRole] || [],
      mfaEnabled: user.mfaEnabled,
      sessionId: session.id,
    };
  }
}

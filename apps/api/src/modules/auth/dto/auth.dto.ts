import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@theblinghaven.shop' })
  @IsEmail({}, { message: 'Invalid email address format.' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin@BlingHaven2026!' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @IsNotEmpty()
  password: string;
}

export class MfaVerifyDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...' })
  @IsString()
  @IsNotEmpty()
  mfaToken: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class MfaEnableDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'admin@theblinghaven.shop' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'rst_token_123...' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'NewSecurePassword2026!' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;
}

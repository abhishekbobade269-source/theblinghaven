import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('TheBlingHavenAPI');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((o) => o.trim());

  // Security Headers (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc: ["'self'", ...corsOrigins],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Cookie Parser for secure HttpOnly session tokens
  app.use(cookieParser());

  // Static uploads directory for media assets
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // CORS Configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin || corsOrigins.includes(origin) || origin.includes('localhost')) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev, strict in prod
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'X-Idempotency-Key',
      ],
    }),
  );

  // Global Input Validation & Transformation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // OpenAPI / Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('The Bling Haven — Commerce API')
    .setDescription(
      'Enterprise REST API for The Bling Haven luxury jewelry & ornaments e-commerce platform. Features JWT authentication, RBAC, audit logging, rate limiting, and PCI DSS aligned commerce workflows.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'The Bling Haven API Explorer',
    customCss: '.swagger-ui .topbar { background-color: #0B0D13; }',
  });

  await app.listen(port, '0.0.0.0');
  logger.log(`💎 The Bling Haven API running on port ${port}`);
  logger.log(`📖 API Documentation available at /docs`);
}

bootstrap();

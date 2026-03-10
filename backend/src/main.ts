import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefixo global da API
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Remove campos não declarados no DTO
      forbidNonWhitelisted: true, // Retorna erro se vier campo extra
      transform: true,            // Transforma tipos automaticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger - Documentação automática da API
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('AgencyHub API')
      .setDescription('API da plataforma SaaS multi-tenant para agências de marketing')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
        'JWT-auth',
      )
      .addTag('auth', 'Autenticação e autorização')
      .addTag('admin', 'Módulos do administrador da plataforma')
      .addTag('agency', 'Módulos da agência')
      .addTag('client', 'Módulos do cliente final')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    console.log(`📚 Swagger disponível em: http://localhost:${process.env.PORT || 3001}/docs`);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 AgencyHub Backend rodando em: http://localhost:${port}/${apiPrefix}`);
  console.log(`🌎 Ambiente: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Cần thêm dòng này để class-validator có thể truy cập NestJS DI container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('NestJS Swagger API')
    .setVersion('1.0')
    .addCookieAuth('access_token') // Thêm authentication qua cookie
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true, // Giữ lại authentication qua reload
      withCredentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.NEST_PORT ?? 3000);
}
bootstrap();

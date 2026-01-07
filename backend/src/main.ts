import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cần thêm dòng này để class-validator có thể truy cập NestJS DI container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('NestJS Swagger API')
    .setVersion('1.0')
    .addBearerAuth() // dùng nếu có JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.NEST_PORT ?? 3000);
}
bootstrap();

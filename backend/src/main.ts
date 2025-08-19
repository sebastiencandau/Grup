// src/main.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔓 Autoriser les requêtes cross-origin
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Grup API')
    .setDescription('API de réservation sécurisée (Grup)')
    .setVersion('1.0')
    .build();

  console.log('DB_TYPE:', process.env.DB_TYPE);

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger accessible via http://localhost:3000/api

  await app.listen(3000);
}
bootstrap();

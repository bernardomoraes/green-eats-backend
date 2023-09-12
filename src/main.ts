import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Wanted API')
    .setDescription('An API for searching wanted people')
    .setVersion('1.0')
    .addTag('wanted people FBI')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import "dotenv/config"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const config = new DocumentBuilder()
  .setTitle('Token Lottery')
  .setDescription('Take part in a lottery using Jam Token')
  .setVersion('1.0')
  .addTag('lottery')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();

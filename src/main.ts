import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // const config = new DocumentBuilder()
  //   .setTitle('Nest API')
  //   .setDescription('some desc')
  //   .setVersion('1.0')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('/', app, document);

  await app.listen(8080);
}
bootstrap();

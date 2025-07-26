import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        exposeUnsetFields: true,
      },
    }),
  );

  app.enableCors();
  // app.enableCors({
  //   origin: '*',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   // allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MainLogger } from './logging/main.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new MainLogger(),
  });

  // Starts listening for shutdown hooks
  // per https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('Guess The Distance')
    .setDescription('Guess The Distance API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

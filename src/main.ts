import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Starts listening for shutdown hooks
  // per https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();

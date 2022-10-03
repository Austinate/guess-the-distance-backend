import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MethodInvokeLoggingInterceptor } from './interceptors/method-invoke-logging.interceptor';
import { UnhandledErrorsLoggingInterceptor } from './interceptors/unhandled-errors-logging.interceptor';
import { MainLogger } from './logging/main.logger';

async function bootstrap() {
  const logger = new MainLogger();
  const app = await NestFactory.create(AppModule, {
    logger: logger,
    cors: true,
  });

  app.useGlobalInterceptors(
    new MethodInvokeLoggingInterceptor(logger),
    new UnhandledErrorsLoggingInterceptor(logger),
  );

  // Starts listening for shutdown hooks
  // per https://mikro-orm.io/docs/usage-with-nestjs#app-shutdown-and-cleanup
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .setTitle('Guess The Distance')
    .setDescription('Guess The Distance API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();

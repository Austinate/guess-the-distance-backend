import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MainLogger } from 'src/logging/main.logger';

export class MethodInvokeLoggingInterceptor implements NestInterceptor {
  private readonly logger: MainLogger;

  constructor(logger: MainLogger) {
    this.logger = logger;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.logMethodInvoke(context);
    return next.handle();
  }
}

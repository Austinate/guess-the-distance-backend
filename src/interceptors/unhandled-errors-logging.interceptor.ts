import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MainLogger } from 'src/logging/main.logger';

export class UnhandledErrorsLoggingInterceptor implements NestInterceptor {
  private readonly logger: MainLogger;
  private readonly shouldLogError: (error: Error) => boolean;

  constructor(
    logger: MainLogger,
    shouldLogError = (error: Error) => {
      return !(
        error instanceof NotFoundException || error instanceof HttpException
      );
    },
  ) {
    this.logger = logger;
    this.shouldLogError = shouldLogError;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (this.shouldLogError(error)) {
          this.logger.logUnhandledError(context, error);
        }
        throw error;
      }),
    );
  }
}

import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
// import { ApiError } from 'src/exceptions/api-error';

@Injectable()
export class ApiErrorMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ApiErrorMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug(
      `${ApiErrorMiddleware.name}: ${req.method} ${req.baseUrl} ${req.ip}`,
    );

    if (!res) {
      const error = new HttpException(
        'Ваше сообщение об ошибке',
        HttpStatus.BAD_REQUEST,
      );
      this.logger.error(req.errored);
      next(error);
    } else {
      next();
    }
  }
}

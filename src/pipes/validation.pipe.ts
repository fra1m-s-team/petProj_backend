/* eslint-disable @typescript-eslint/ban-types */
import { ValidationException } from 'src/exceptions/validation.exception';
import { ArgumentMetadata, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoggingInterceptor } from '@interceptors/logging.interceptors';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // private readonly logger = new Logger(LoggingInterceptor.name);

  private isPrimitiveType(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return types.includes(metatype);
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    // this.logger.warn('pipes')
    if (!metadata.metatype || this.isPrimitiveType(metadata.metatype)) {
      return value;
    }

    if (metadata.type === 'param') {
      return value;
    }
    const obj = plainToInstance(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {
        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });
      throw new ValidationException(messages);
    }
    return value;
  }
}

/* eslint-disable @typescript-eslint/ban-types */
import { ValidationException } from 'src/exceptions/validation.exception';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
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

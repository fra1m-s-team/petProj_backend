import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCodeDto {
  @ApiProperty({
    example: '12341',
    description: 'Код для сброса пароля',
  })
  @IsNumber({}, { message: 'Код должен быть числом' })
  @Min(100000, { message: 'Код должен состоять минимум из 6 цифр' })
  @Max(999999, { message: 'Код должен состоять максимум из 6 цифр' })
  code?: number;

  @ApiProperty({
    example: 'Антон',
    description: 'Адрес отправителя',
    default: 'developer.ts@yandex.ru',
  })
  @IsString({ message: 'Должно быть строкой' })
  eamil: string;
}

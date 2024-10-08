import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendMailDto {
  @ApiProperty({
    example: 'Антон',
    description: 'Адрес отправителя',
    default: 'developer.ts@yandex.ru',
  })
  @IsString({ message: 'Должно быть строкой' })
  sender?: string;

  @ApiProperty({
    example: 'user@user.ru',
    description: 'Настоящая почта пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Не корректный email' })
  recipients: string;

  @ApiProperty({
    example: 'Поддтверждение почты',
    description: 'Тема письма',
  })
  @IsString({ message: 'Должно быть строкой' })
  subject: string;

  @ApiProperty({
    example: '12341',
    description: 'Код поддтверждение смены пароля',
  })
  @IsString({ message: 'Должно быть строкой' })
  code?: number;

  @ApiProperty({
    example: 'Биткоин стал 64540$',
    description: 'Содержимое письмя',
  })
  @IsString({ message: 'Должно быть строкой' })
  activationLink?: string;
}

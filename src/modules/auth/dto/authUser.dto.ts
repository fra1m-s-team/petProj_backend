import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthUserDto {
  @ApiProperty({ example: 'user@user.ru', description: 'Почта пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Не корректный email' })
  email: string;

  @ApiProperty({
    example: 'pass123',
    description: 'Пароль пользователя',
    minLength: 8,
    maxLength: 16,
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 16, {
    message: 'Длинна пароля должна быть не меньше 8 и не больше 16',
  })
  password: string;
}
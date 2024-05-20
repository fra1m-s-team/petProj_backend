import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@user.ru', description: 'Почта пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Не корректный email' })
  email: string;

  @ApiProperty({
    example: 'pass123',
    description: 'Пароль пользователя',
    minLength: 4,
    maxLength: 16,
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, {
    message: 'Длинна пароля должна быть не меньше 4 и не больше 16',
  })
  password: string;

  @ApiProperty({ example: 'Антон', description: 'Имя пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  name: string;
}

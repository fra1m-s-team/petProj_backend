import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user_uf3h4u@example.com',
    description: 'Почта пользователя',
  })
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

  @ApiProperty({
    example: 'vdas32-asdasd-213asd-23-sd',
    description: 'Ссылка подтверждения почты',
  })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  activationLink?: string;
}

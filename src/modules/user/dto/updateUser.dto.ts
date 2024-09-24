import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'user_uf3h4u@example.com',
    description: 'Почта пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Не корректный email' })
  email: string;

  // @ApiProperty({
  //   example: 'user_uf3h4u@example.com',
  //   description: 'Новая почта пользователя',
  // })
  // @IsString({ message: 'Должно быть строкой' })
  // @IsEmail({}, { message: 'Не корректный email' })
  // newEmail?: string;

  @ApiProperty({
    example: '123pass',
    description: 'Новый пароль пользователя',
    minLength: 4,
    maxLength: 16,
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(4, 16, {
    message: 'Длинна пароля должна быть не меньше 4 и не больше 16',
  })
  newPassword: string;

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

  @ApiProperty({
    example: '12341',
    description: 'Код для сброса пароля',
  })
  @IsNumber({}, { message: 'Код должен быть числом' })
  @Min(100000, { message: 'Код должен состоять из 6 цифр' })
  @Max(999999, { message: 'Код должен состоять из 6 цифр' })
  code: number;
}

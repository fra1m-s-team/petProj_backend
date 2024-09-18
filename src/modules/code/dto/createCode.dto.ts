import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';
import { Column } from 'typeorm';

export class CreateCodeDto {
  @ApiProperty({
    example: '12341',
    description: 'Код для сброса пароля',
  })
  @IsNumber()
  @Length(6)
  code?: number;

  @ApiProperty({
    example: '3',
    description: 'ID пользователя',
  })
  @IsNumber()
  userId: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@modules/user/entities/user.entity';

@Entity({ name: 'code' })
export class CodeEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор токена' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '12341',
    description: 'Код для сброса пароля',
  })
  @Column({ unique: true, nullable: false })
  code: number;

  @ApiProperty({
    example: '3',
    description: 'ID пользователя',
  })
  @Column({ nullable: false })
  userId: number;

  @ApiProperty({ example: false, description: 'Статус кода' })
  @Column({ default: false })
  isUsed: boolean;

  @ApiProperty({
    example: '2024-05-30 15:49:54',
    description: 'Время создания кода',
  })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;
}

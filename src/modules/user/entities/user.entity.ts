import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TokenEntity } from '@modules/auth/entities/token.entity';
import { SceneEntity } from '@modules/scene/entities/scene.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: `user_${Math.random().toString(36).substring(7)}@example.com`,
    description: 'Почта пользователя',
  })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 'pass123',
    description: 'Пароль пользователя',
    minLength: 6,
    maxLength: 16,
  })
  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    example: 'TestDeveloper',
    description: 'Имя пользователя',
  })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: false, description: 'Статус автивации по почте' })
  @Column({ default: false })
  isActivated: boolean;

  @ApiProperty({
    example: '97541ee5-795d-4a2d-a04b-4f7473c6822f',
    description: 'Ссылка подтверждения почты',
  })
  @Column()
  activationLink: string;

  @ApiProperty({
    example: [TokenEntity],
    description: 'Массив токенов пользователя',
  })
  @OneToMany(() => TokenEntity, (token) => token.userId)
  // @JoinColumn({ name: 'tokenId' })
  token: TokenEntity[];

  //TODO:
  // @ApiProperty({
  //   example: [1, 2, 23, 12, 321],
  //   description: 'Массив id сохраненных сцен пользователя',
  // })
  // @ManyToMany(() => SceneEntity, (scene) => scene.usersId, { cascade: true })
  // @JoinTable({ name: 'users_scenes' })
  // scenes: SceneEntity[];
  @ApiProperty({
    example: [SceneEntity],
    description: 'Массив созданых сцен пользователя',
  })
  @OneToMany(() => SceneEntity, (scene) => scene.author)
  scene: SceneEntity[];
}

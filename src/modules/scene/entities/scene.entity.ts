import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'scene' })
export class SceneEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор токена' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '{"autoClear":true,"clearColor":[0.2,0.2,0.3,1]}, ...',
    description: 'Сцена сериализирована в json стркоу',
  })
  //TODO:
  @Column()
  dataJSON: string;

  //TODO:
  // @ApiProperty({
  //   example: UserEntity,
  //   description: 'Массив уникальных идентификаторов пользователей которые сохранили сцену',
  // })
  // @ManyToMany(() => UserEntity, (user) => user.scenes)
  // usersId: UserEntity[];

  @ApiProperty({
    example: UserEntity,
    description: 'Автор сцены',
  })
  @ManyToOne(() => UserEntity, (user) => user.scene)
  author: UserEntity;

  @ApiProperty({
    example: '2024-05-30 15:49:54',
    description: 'Время создания сцены',
  })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;
}

import { UserEntity } from '@modules/user/entities/user.entity';

export class CreateSceneDto {
  dataJSON: string;
  author: UserEntity;
}

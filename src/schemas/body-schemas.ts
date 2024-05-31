import { UserEntity } from '@modules/user/entities/user.entity';
import { PickType } from '@nestjs/swagger';

class RegistrationBodySchema extends PickType(UserEntity, [
  'name',
  'email',
  'password',
] as const) {}

class AuthBodySchema extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}

export { AuthBodySchema, RegistrationBodySchema };

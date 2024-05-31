import { TokenEntity } from '@modules/auth/entities/token.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

class RegistrationResponseSchema {
  @ApiProperty({ type: 'string' })
  message: string;

  @ApiProperty({
    type: OmitType(UserEntity, ['password', 'token'] as const),
    description: 'UserEntity without password & token',
  })
  user: UserEntity;

  @ApiProperty({
    type: PickType(TokenEntity, ['token'] as const),
    description: 'Access or Refresh Token',
  })
  accesToken: TokenEntity;

  @ApiProperty({
    type: PickType(TokenEntity, ['token'] as const),
    description: 'Access or Refresh Token',
  })
  refreshToken: TokenEntity;
}

class AuthResponseSchema {
  @ApiProperty({
    type: OmitType(UserEntity, ['password', 'token'] as const),
    description: 'UserEntity without password & token',
  })
  user: UserEntity;

  @ApiProperty({
    type: PickType(TokenEntity, ['token'] as const),
    description: 'Access or Refresh Token',
  })
  accesToken: TokenEntity;

  @ApiProperty({
    type: PickType(TokenEntity, ['token'] as const),
    description: 'Access or Refresh Token',
  })
  refreshToken: TokenEntity;
}

class LogoutResponseSchema {
  @ApiProperty({
    default: 'Вы вышли из аккаунта',
    description: 'Cообщение пользователю о выходе из аккаунта',
  })
  message: 'string';
}

class RefreshTokenResponseSchema extends AuthResponseSchema {}

export {
  RefreshTokenResponseSchema,
  LogoutResponseSchema,
  AuthResponseSchema,
  RegistrationResponseSchema,
};

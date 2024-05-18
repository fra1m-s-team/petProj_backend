import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/User.entity';
import { CreateUserDto } from '../user/dto/createUser.dto';
import * as crypto from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // async generateToken(user: UserEntity) {
  //   const payload = {
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //   };
  //   return {
  //     token: this.jwtService.sign(payload),
  //   };
  // }
  //
  // async registration(user: UserEntity) {
  //   const hashPassword = await crypto.hash(
  //     user.password,
  //     +this.configService.get<string>('SALT_ROUNDS'),
  //   );

  //   return await this.generateToken(user);
  // }

  // private async auth(userDto: AuthUserDto, user: UserEntity) {
  //  FIXME: Проверка на существование нжуно вынести в UserService и там же возращать ошибку
  //   const user = await this.userService.getUserByEmail(userDto.email);
  //   if (!user) {
  //     throw new HttpException(
  //       'Пользователь не зарегестрирован',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //
  //   const passwordCompare = await bcrypt.compare(
  //     userDto.password,
  //     user.password,
  //   );

  //   if (user && passwordCompare) {
  //     return user;
  //   }
  //   throw new UnauthorizedException('Неккоректный логин или пароль');
  // }
}

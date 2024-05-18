import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/User.entity';
import { CreateUserDto } from '../user/dto/createUser.dto';
import * as crypto from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    // private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateToken(user: UserEntity) {
    const payload = {
      // id: user.id,
      // email: user.email,
      // name: user.name,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  //FIXME: Исправь логику, не аус сервис использует юзер сервис, а чтобы юзер сервис использовал аус
  // async registration(user: CreateUserDto) {
  //   const hashPassword = await crypto.hash(
  //     userDto.password,
  //     +this.configService.get<string>('SALT_ROUNDS'),
  //   );
  //
  //   const user = await this.userService.createUser({
  //     ...userDto,
  //     password: hashPassword,
  //   });
  //
  //   return await generateToken(user)
  // }
}

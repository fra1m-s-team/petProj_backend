import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/createUser.dto';
import * as crypto from 'bcryptjs';
import { AuthUserDto } from './dto/authUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async generateToken(user: UserEntity) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isActivated: user.isActivated,
    };

    const accesToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_SECRET'),
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '30d',
    });

    return { accesToken, refreshToken };
  }

  async validateAccessToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET_SECRET'),
      });

      return userData;
    } catch (error) {
      return null;
    }
  }

  async validateRefreshToken(token: string) {
    try {
      const userData = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(user: UserEntity, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({
      where: {
        userId: user,
      },
    });

    if (tokenData) {
      tokenData.token = refreshToken;
      return await this.tokenRepository.save(tokenData);
    }
    console.log('TOKEN: ', tokenData);

    const token = new TokenEntity();
    token.userId = user;
    token.token = refreshToken;

    await this.tokenRepository.save(token);
    return token;
  }

  async removeToken(refreshToken: string) {
    const token = await this.tokenRepository.delete({ token: refreshToken });
    return token;
  }

  async findToken(refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { token: refreshToken },
    });
    return token;
  }

  async hashPassword(user: CreateUserDto) {
    const hashPassword = await crypto.hash(
      user.password,
      +this.configService.get<string>('SALT_ROUNDS'),
    );

    return hashPassword;
  }

  async auth(userDto: AuthUserDto, user: UserEntity) {
    const passwordCompare = await crypto.compare(
      userDto.password,
      user.password,
    );

    if (user && passwordCompare) {
      return user;
    }
    throw new UnauthorizedException('Неккоректный логин или пароль');
  }
}

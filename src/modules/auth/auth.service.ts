import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/createUser.dto';
import * as crypto from 'bcryptjs';
import { AuthUserDto } from './dto/authUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { CodeService } from '@modules/code/code.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private codeService: CodeService,
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
      relations: ['userId'],
    });
    return token;
  }

  async hashPassword(password: string) {
    const hashPassword = await crypto.hash(
      password,
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

    throw new HttpException(
      'Неккоректный логин или пароль',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async newHashPassword(
    password: string,
    newPassword: string,
    user: UserEntity,
  ) {
    const passwordCompare = await crypto.compare(password, user.password);
    if (!passwordCompare) {
      throw new HttpException(
        'Старый пароль не верный',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const newPasswordMatch = await crypto.compare(newPassword, user.password);
    if (newPasswordMatch) {
      throw new HttpException(
        'Пароль не должен совпадать с предыдущем',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await this.hashPassword(newPassword);

    return hashPassword;
  }
}

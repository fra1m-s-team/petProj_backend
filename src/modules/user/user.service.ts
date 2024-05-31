import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthUserDto } from '@modules/auth/dto/authUser.dto';
// import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import * as uuid from 'uuid';
import { MailService } from '@modules/mail/mail.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private async validateUser(email: string) {
    const candidate = await this.getUserByEmail(email);

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async registrationUser(createUserDto: CreateUserDto) {
    await this.validateUser(createUserDto.email);

    const activationLink = await uuid.v4();

    createUserDto.password = await this.authService.hashPassword(createUserDto);
    createUserDto.activationLink = activationLink;

    const user$ = await this.userRepository.save(createUserDto);
    const { password, ...user } = user$;
    await this.mailService.sendActivationMail({
      recipients: user.email,
      activationLink: `
      ${this.configService.get('API_URL')}/user/activate/${activationLink}`,
    });
    const tokens = await this.authService.generateToken(user$);
    await this.authService.saveToken(user$, tokens.refreshToken);

    return { user, tokens };
  }

  async activate(activationLink: string) {
    const user = await this.userRepository.findOne({
      where: { activationLink },
    });
    if (!user) {
      throw new HttpException(
        'Неккоректная ссылка активации ',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isActivated = true;
    await this.userRepository.save(user);
  }

  async authUser(authUserDto: AuthUserDto) {
    const candidate = await this.getUserByEmail(authUserDto.email);

    if (!candidate) {
      throw new HttpException(
        'Пользователь с таким email не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (candidate.isActivated === false) {
      throw new HttpException(
        'Почта пользовтеля не активирована',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user = await this.authService.auth(authUserDto, candidate);

    const tokens = await this.authService.generateToken(candidate);
    await this.authService.saveToken(user, tokens.refreshToken);

    return { user, tokens };
  }

  async logount(refreshToken: string) {
    const token = await this.authService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = await this.authService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.authService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userData.id },
    });

    const tokens = await this.authService.generateToken(user);
    await this.authService.saveToken(user, tokens.refreshToken);

    return { user, tokens };
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }
}

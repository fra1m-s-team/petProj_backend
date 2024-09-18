import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
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
import { UpdateUserDto } from './dto/updateUser.dto';
import { CodeService } from '@modules/code/code.service';
import { CreateCodeDto } from '@modules/code/dto/createCode.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
    private configService: ConfigService,
    private mailService: MailService,
    private codeService: CodeService,
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

    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );
    createUserDto.activationLink = activationLink;

    const user$ = await this.userRepository.save(createUserDto);
    const { password, ...user } = user$;
    await this.mailService.sendActivationMail({
      recipients: user.email,
      activationLink: `
      ${this.configService.get('API_URL')}/user/activate/${activationLink}`,
      subject: 'Подтверждение аккаунта',
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

  async updateUser(updateUserDto: UpdateUserDto, token: string) {
    const user = await this.getUserByEmail(updateUserDto.email);

    if (!user) {
      throw new HttpException(
        'Пользователь с таким email не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.isActivated === false) {
      throw new HttpException(
        'Почта пользовтеля не активирована',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const code$ = await this.codeService.getCodeByUserId(user.id);

    if (!code$) {
      await this.sendCode(token);
      const validate = await this.codeService.validateCode(
        updateUserDto.code,
        user.id,
      );
      if (validate === false) {
        throw new HttpException('Неверный код', HttpStatus.BAD_REQUEST);
      }
    }

    const validate = await this.codeService.validateCode(
      updateUserDto.code,
      user.id,
    );
    if (validate === false) {
      throw new HttpException('Неверный код', HttpStatus.BAD_REQUEST);
    }

    const newPassword = await this.authService.newHashPassword(
      updateUserDto.password,
      updateUserDto.newPassword,
      user,
    );

    user.password = newPassword;
    await this.userRepository.save(user);

    await this.codeService.codeIsUsed(user.id);
    await this.codeService.delteCode(code$.code);

    return newPassword ? true : false;
  }

  async getUserByToken(token: string) {
    const token$ = await this.authService.findToken(token);
    if (!token$) {
      throw new HttpException('Возникла ошибка сервера', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: { id: token$.userId.id },
    });

    return user;
  }

  async sendCode(token: string) {
    const user = await this.getUserByToken(token);

    const code = await this.codeService.createCode({ userId: user.id });

    await this.mailService.sendConfirmMail({
      recipients: user.email,
      subject: 'Код для сброса пароля',
      code,
    });

    return { code };
  }
}

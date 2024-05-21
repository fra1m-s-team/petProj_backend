import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthUserDto } from '@modules/auth/dto/authUser.dto';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private async validateUser(email: string) {
    const candidate = await this.getUserByEmail(email);

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async authUser(authUserDto: AuthUserDto) {
    const candidate = await this.getUserByEmail(authUserDto.email);

    if (!candidate) {
      throw new HttpException(
        'Пользователь с таким email не существует',
        HttpStatus.BAD_REQUEST,
      );
    }

    //FIXME: Сделать todo
    // await this.main('Напиши на англиском готово!');

    const token = await this.authService.generateToken(candidate);
    return { ...candidate, ...token };
  }

  async registrationUser(createUserDto: CreateUserDto) {
    const user$ = await this.validateUser(createUserDto.email);

    const user = await this.userRepository.save(createUserDto);
    const token = await this.authService.generateToken(user);
    return { ...user, ...token };
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  // TODO: Подключить платный план для тестов
  // async main(text: string) {
  //   const openai = new OpenAI({
  //     apiKey: this.configService.get('GPT_KEY'),
  //   });

  //   const completion = await openai.chat.completions.create({
  //     messages: [{ role: 'system', content: text }],
  //     model: 'gpt-3.5-turbo-16k',
  //   });

  //   console.log(completion.choices[0]);
  // }
}

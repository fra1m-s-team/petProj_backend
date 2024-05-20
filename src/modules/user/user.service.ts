import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthUserDto } from '@modules/auth/dto/authUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
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
}

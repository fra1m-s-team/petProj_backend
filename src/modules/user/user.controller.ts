import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard';
import { AuthUserDto } from '@modules/auth/dto/authUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('User CRUD')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Cоздание пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Post('/registration')
  async registrationUser(@Body() userDto: CreateUserDto) {
    const res = await this.userService.registrationUser(userDto);
    return { message: 'Congratulations, you can play', user: res };
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Post('/auth')
  async authUser(@Body() userDto: AuthUserDto) {
    const res = await this.userService.authUser(userDto);
    return { message: 'Congratulations, you can play', user: res };
  }
}

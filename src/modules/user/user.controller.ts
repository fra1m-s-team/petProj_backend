import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Res,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthUserDto } from '@modules/auth/dto/authUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { LoggingInterceptor } from '@interceptors/logging.interceptors';
import { TokenEntity } from '@modules/auth/entities/token.entity';
import {
  AuthResponseSchema,
  LogoutResponseSchema,
  RefreshTokenResponseSchema,
  RegistrationResponseSchema,
} from '@schemas/respones-schemas';
import { AuthBodySchema, RegistrationBodySchema } from '@schemas/body-schemas';
import { RegistrationErrorSchema } from '@schemas/error-schemas';
import { Cookies } from '@decorators/cookie.decorator';

@ApiTags('User CRUD')
@UseInterceptors(LoggingInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Cоздание пользователя', operationId: '1' })
  @ApiExtraModels(UserEntity, TokenEntity, CreateUserDto)
  @ApiResponse({
    status: 200,
    type: RegistrationResponseSchema,
    description: 'Registration user',
  })
  @ApiBadRequestResponse({
    type: RegistrationErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: RegistrationBodySchema })
  @Post('/registration')
  async registrationUser(@Body() userDto: CreateUserDto, @Res() res: Response) {
    try {
      const payload = await this.userService.registrationUser(userDto);
      res.cookie('refreshToken', payload.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Congratulations, you can play', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Активация почты пользователя' })
  @ApiResponse({
    status: HttpStatus.PERMANENT_REDIRECT,
    description: 'Редирект на главную страницу',
  })
  @Get('/activate/:link')
  async activateUser(@Param('link') link: string, @Res() res: Response) {
    try {
      await this.userService.activate(link);
      // FIXME: Add Client url home page in redirect
      return res
        .status(HttpStatus.PERMANENT_REDIRECT)
        .redirect('http://localhost:5173');
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiExtraModels(UserEntity, TokenEntity, CreateUserDto)
  @ApiResponse({ status: 200, type: AuthResponseSchema })
  @ApiBody({ type: AuthBodySchema })
  @Post('/auth')
  async authUser(@Body() userDto: AuthUserDto, @Res() res: Response) {
    try {
      const payload = await this.userService.authUser(userDto);
      res.cookie('refreshToken', payload.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Congratulations, you can play', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiResponse({ status: 200, type: LogoutResponseSchema })
  @Post('/logout')
  async logout(@Cookies('refreshToken') token: string, @Res() res: Response) {
    try {
      if (!token) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Вы не авторизованы' });
      }
      const token$ = await this.userService.logount(token);

      return res
        .status(HttpStatus.OK)
        .clearCookie('refreshToken')
        .json({ message: 'Вы вышли из аккаунта' });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Обновление refreshToken в cookies' })
  @ApiResponse({ status: 200, type: RefreshTokenResponseSchema })
  @Get('/refresh')
  async refresh(@Cookies('refreshToken') token: string, @Res() res: Response) {
    try {
      const payload = await this.userService.refresh(token);
      res.cookie('refreshToken', payload.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Congratulations, you can play', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  //TODO: delete(user), patch(pass/email)
}

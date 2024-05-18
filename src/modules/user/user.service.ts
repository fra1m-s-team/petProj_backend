import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(private authService: AuthService) {}
}

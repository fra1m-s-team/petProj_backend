import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateCodeDto } from './dto/createCode.dto';
import { CodeEntity } from './entities/code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private codeRepository: Repository<CodeEntity>,
  ) {}

  async generateCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async createCode(createCodeDto: CreateCodeDto) {
    const code = await this.generateCode();
    createCodeDto.code = code;
    createCodeDto.userId = createCodeDto.userId;
    await this.codeRepository.save(createCodeDto);

    return createCodeDto.code;
  }

  async getCodeByUserId(userId: number) {
    const code = await this.codeRepository.findOne({
      where: {
        userId,
        isUsed: false,
      },
    });

    return code;
  }

  async validateCode(code: number, userId: number) {
    const userCode = await this.getCodeByUserId(userId);

    if (code !== userCode.code) {
      return false;
    }

    return true;
  }

  async delteCode(code: number) {
    await this.codeRepository.delete({ code: code });
  }

  async codeIsUsed(userId) {
    const userCode = await this.getCodeByUserId(userId);
    userCode.isUsed = true;
    await this.codeRepository.save(userCode);
  }

  async clearUsedCodes() {
    await this.codeRepository.delete({ isUsed: true });
  }
}

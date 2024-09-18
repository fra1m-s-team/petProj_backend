import { forwardRef, Module } from '@nestjs/common';
import { CodeService } from './code.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeEntity } from './entities/code.entity';
import { UserModule } from '@modules/user/user.module';
import { MailModule } from '@modules/mail/mail.module';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([CodeEntity]), MailModule],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}

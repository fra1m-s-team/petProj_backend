import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(MailerService.name);

  async sendActivationMail(sendEmailDto: SendMailDto) {
    try {
      const { recipients, activationLink } = sendEmailDto;

      // TODO: Можно сделать чтобы отправители разные были, но по ТЗ нет такого условия.
      // const sender: string | Address = sendEmailDto.sender ?? {
      //   name: this.configService.get('MAIL_FROM_NAME'),
      //   address: this.configService.get('MAIL_USERNAME'),
      // };

      const message = await this.mailerService.sendMail({
        // from: sender,
        to: recipients,
        subject: 'Подтверждение аккаунта',
        text: 'activationLink',
        html: `
        <div>
          <h1>Для активации прейдите по ссылке</h1>
          <a href="${activationLink}">${activationLink}</a>
        </div>
        `,
      });
      this.logger.log(`Письмо отправлено на почту `);
      return message;
    } catch (error) {
      this.logger.error('Письмо не отправлено', error);
    }
  }
}

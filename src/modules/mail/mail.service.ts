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

      // TODO: Можно сделать чтобы отправители разные были
      // const sender: string | Address = sendEmailDto.sender ?? {
      //   name: this.configService.get('MAIL_FROM_NAME'),
      //   address: this.configService.get('MAIL_USERNAME'),
      // };

      const message = await this.mailerService.sendMail({
        // from: sender,
        to: recipients,
        subject: sendEmailDto.subject,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333;">Активация аккаунта</h1>
            <p style="font-size: 16px; color: #666;">Чтобы активировать аккаунт, перейдите по следующей ссылке:</p>
          </div>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${activationLink}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; font-size: 18px; border-radius: 5px;">Активировать аккаунт</a>
          </div>
          <div style="text-align: center;">
            <p style="font-size: 14px; color: #999;">Если вы не регистрировались на нашем сайте, проигнорируйте это письмо.</p>
          </div>
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #999;">&copy; 2024 Ваша компания. Все права защищены.</p>
          </div>
        </div>
      `,
      });
      this.logger.log(`Письмо отправлено на почту `);
      return message;
    } catch (error) {
      this.logger.error('Письмо не отправлено', error);
    }
  }

  async sendConfirmMail(sendEmailDto: SendMailDto) {
    try {
      const { recipients } = sendEmailDto;

      const message = await this.mailerService.sendMail({
        // from: sender,
        to: recipients,
        subject: sendEmailDto.subject,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #4CAF50; text-align: center;">Подтверждение смены пароля</h2>
          <p style="font-size: 16px; color: #333;">
            Здравствуйте! Вы запросили смену пароля на нашем сайте. Пожалуйста, введите код, приведенный ниже, для подтверждения смены пароля:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="
              display: inline-block;
              font-size: 24px;
              color: #fff;
              background-color: #4CAF50;
              padding: 15px 30px;
              border-radius: 5px;
              letter-spacing: 4px;
            ">
              ${sendEmailDto.code}
            </span>
          </div>
          <p style="font-size: 14px; color: #777;">
            Если вы не запрашивали смену пароля, пожалуйста, проигнорируйте это письмо.
          </p>
          <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            © 2024 Create&Play. Все права защищены.
          </p>
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

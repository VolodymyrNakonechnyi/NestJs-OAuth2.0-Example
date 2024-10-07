import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { SharedConfigModule } from '@lib/config';
import { ConfigService } from '@nestjs/config';
import { IEmailConfig } from '@lib/config/interfaces/email-config.interface';

@Module({
  imports: [
    SharedConfigModule,
    NestMailerModule.forRootAsync({
      imports: [SharedConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const emailConfig = configService.get<IEmailConfig>('emailConfig');
        
        return {
          transport: {
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            auth: {
              user: emailConfig.auth.user,
              pass: emailConfig.auth.pass,
            },
          },
        };
      },
    }),
    
  ],
  providers: [MailerService],
})
export class MailerModule {}

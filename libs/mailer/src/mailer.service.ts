import { Injectable, Logger } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { IEmailConfig } from '@lib/config/interfaces/email-config.interface';
import { LoggerService } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';
import { join, parse } from 'path';
import Handlebars from 'handlebars';
import { IUser } from 'apps/users/src/interfaces/user.interface';
import { ITemplatedData } from './interfaces/templated-data.interface';

type TemplateMap = {
  [key: string]: Handlebars.TemplateDelegate;
};

@Injectable()
export class MailerService {
  private readonly email: string;
  private readonly templates: TemplateMap;
  private readonly domain: string;
  private readonly loggerService: LoggerService;
  constructor(
    private readonly nestMailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {
    const emailConfig = this.configService.get<IEmailConfig>('emailConfig');
    this.email = `"Mindenit" <${emailConfig.auth.user}>`;
    this.domain = this.configService.get("domain");
    this.loggerService = new Logger(MailerService.name);
    
    this.templates = {
      confirmation: MailerService.parseTemplate('confirmation.hbs'),
      resetPassword: MailerService.parseTemplate('reset-password.hbs')
    };
  }

  public sendEmail(
    to: string,
    subject: string,
    html: string,
    log?: string,
  ): void {
    this.nestMailerService
      .sendMail({
        from: this.email,
        to,
        subject,
        html,
      })
      .then(() => this.loggerService.log(log ?? 'A new email was sent.'))
      .catch((error) => this.loggerService.error(error));
  }

  private static parseTemplate(
    templateName: string,
  ): Handlebars.TemplateDelegate<ITemplatedData> {
    const templateText = readFileSync(
      join(process.cwd(), 'libs', 'mailer', 'templates', templateName),
      'utf-8',
    );
    return Handlebars.compile<ITemplatedData>(templateText, { strict: true });
  }

  public getAvailableTemplates(): string[] {
    return Object.keys(this.templates);
  }

  public sendConfirmationEmail(user: IUser, token: string): void {
    console.log("I'm sending mail")
    const { email, firstName } = user;
    const subject = 'Confirm your email';
    const html = this.templates.confirmation({
      name: firstName,
      link: `http://${this.domain}:3000/auth/confirm/${token}`,
    });
    this.sendEmail(email, subject, html, 'A new confirmation email was sent.');
  }

  public sendResetPasswordEmail(user: IUser, token: string): void {
    const { email, firstName } = user;
    const subject = 'Reset your password';
    const html = this.templates.resetPassword({
      name: firstName,
      link: `http://${this.domain}:3000/auth/reset-password/${token}`,
    });
    this.sendEmail(
      email,
      subject,
      html,
      'A new reset password email was sent.',
    );
  }

  public async sendTemplatedEmail<T extends object>(
    to: string,
    templateName: string,
    subject: string,
    data: T,
    log?: string,
  ): Promise<void> {
    const template = this.templates[templateName];
    
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    const html = template(data);
    
    try {
      await this.nestMailerService.sendMail({
        from: this.email,
        to,
        subject,
        html,
      });
      this.loggerService.log(log ?? `Email sent using template: ${templateName}`);
    } catch (error) {
      this.loggerService.error(`Failed to send email with template ${templateName}:`, error);
      throw error;
    }
  }
}
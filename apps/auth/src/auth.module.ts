import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@auth/jwt';
import { MailerModule, MailerService } from '@mail/mailer';
import { CommonModule } from '@lib/common';

@Module({
  imports: [
    UsersModule,
    JwtModule, 
    MailerModule, 
    CommonModule
  ],
  controllers: [AuthController],
  providers: [AuthService, MailerService],
})
export class AuthModule {}
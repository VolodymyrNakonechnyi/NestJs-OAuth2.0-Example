import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { SharedConfigModule } from '@lib/config/config.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { CommonModule } from '@lib/common';

@Module({
  imports: [SharedConfigModule, NestJwtModule, CommonModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SharedConfigModule } from '@lib/config';
import { ClientsModule } from '@nestjs/microservices';
import { SERVICES } from '@lib/contracts/services';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    SharedConfigModule,
    ClientsModule.registerAsync([
      {
        name: SERVICES.AUTH,
        imports: [SharedConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('authPort'),
            host: 'auth'
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

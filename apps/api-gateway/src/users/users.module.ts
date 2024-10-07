import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedConfigModule } from '@lib/config';
import { SERVICES } from '@lib/contracts/services';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SharedConfigModule,
    ClientsModule.registerAsync([
      {
        name: SERVICES.USERS,
        imports: [SharedConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            port: configService.get<number>('usersPort'),
            host: 'users'
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
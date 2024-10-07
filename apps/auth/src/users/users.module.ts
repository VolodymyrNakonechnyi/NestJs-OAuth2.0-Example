import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SERVICES } from '@lib/contracts/services';
import { ConfigService } from '@nestjs/config';
import { SharedConfigModule } from '@lib/config';

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
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],  // Export UsersService so it can be used in other modules
})
export class UsersModule {}


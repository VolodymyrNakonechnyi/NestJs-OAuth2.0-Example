import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { configuration } from '@lib/config';

async function bootstrap() {
  const config = configuration();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule, 
    {
      transport: Transport.TCP,
      options: {
        host: 'users',
        port: config.usersPort,
        
      },
    }
  );
  await app.listen();
}
bootstrap();

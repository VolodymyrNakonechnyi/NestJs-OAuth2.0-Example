import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { configuration } from '@lib/config';

async function bootstrap() {
  const config = configuration();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        port: config.authPort,
        host: "auth"
      }
    }
  );

  // app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}

bootstrap();

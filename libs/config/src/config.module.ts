import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config';
import { validationConfigSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: validationConfigSchema
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedConfigModule {}
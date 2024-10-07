import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/config.service';
import knex from 'knex';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      useFactory: async (databaseConfigService: DatabaseConfigService) => {
        const dbConfig = databaseConfigService.dbConfig;
        return knex({
          client: 'pg',
          connection: {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
          },
        });
      },
      inject: [DatabaseConfigService],
    },
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
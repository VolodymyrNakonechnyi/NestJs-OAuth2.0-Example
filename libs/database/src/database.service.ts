import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

interface IDatabaseService {
    getKnex() : Knex;
}

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(@Inject('KNEX_CONNECTION') private knex: Knex) {}

  getKnex() {
    return this.knex;
  }

}
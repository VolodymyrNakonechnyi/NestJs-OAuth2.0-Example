import { USERS_PATTERNS } from '@lib/contracts/users/patterns/users.pattern';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SERVICES } from '@lib/contracts/services';

@Injectable()
export class UsersService {
    constructor(@Inject(SERVICES.USERS) private usersClient: ClientProxy ) {}
    findAll() {
        return this.usersClient.send(USERS_PATTERNS.FIND_ALL, {});
    }
}

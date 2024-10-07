import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto as ClientCreateUserDto } from '@lib/contracts/users/dtos/create-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { USERS_PATTERNS } from '@lib/contracts/users/patterns/users.pattern';
import { SERVICES } from '@lib/contracts/services';
import { ClientProxy } from '@nestjs/microservices';
import { OAuthProvidersEnum } from '@lib/contracts/auth/enums/oauth-providers.enum';
import { CreateUserPayloadDto as ClientCreateUserPayloadDto } from '@lib/contracts/users/dtos/create-user-payload.dto';
import { IUser } from 'apps/users/src/interfaces/user.interface';
import { firstValueFrom } from "rxjs";
import { UserEntity } from '@lib/contracts/users/entities/user.entity';
import { FindOneByCredentialsDto } from '@lib/contracts/users/dtos/get-user-credentials.dto';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
  
  constructor(@Inject(SERVICES.USERS) private usersClient: ClientProxy ) {}
  // findAll() {
  //     return this.usersClient.send(USERS_PATTERNS.FIND_ALL, {});
  // }
  public create(provider: OAuthProvidersEnum, createUserDto: ClientCreateUserDto): Promise<IUser> {
    const payload = {
      provider, 
      user: createUserDto
    }

    return firstValueFrom(this.usersClient.send<IUser, ClientCreateUserPayloadDto>(USERS_PATTERNS.CREATE, payload));
  }

  public findOneByCredentials(id: UUID, version: number) {
    const payload: FindOneByCredentialsDto = {
      id,
      version
    };

    return firstValueFrom(this.usersClient.send<UserEntity, FindOneByCredentialsDto>(USERS_PATTERNS.FIND_ONE_BY_CREDENTIALS, payload));
  }
  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

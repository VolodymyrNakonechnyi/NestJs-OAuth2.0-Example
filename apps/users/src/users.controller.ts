import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USERS_PATTERNS } from '@lib/contracts/users/patterns/users.pattern';
import { OAuthProvidersEnum } from '@lib/contracts/auth/enums/oauth-providers.enum';
import { IUser } from './interfaces/user.interface';
// import { LoggerService } from '@nestjs/common';
import { CreateUserPayloadDto as ClientCreateUserPayloadDto } from '@lib/contracts/users/dtos/create-user-payload.dto';
import { UUID } from 'crypto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FindOneByCredentialsDto } from '@lib/contracts/users/dtos/get-user-credentials.dto';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern(USERS_PATTERNS.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }
  
  @MessagePattern(USERS_PATTERNS.CREATE)
  createUser(@Payload() createUserPayload: ClientCreateUserPayloadDto): Promise<IUser> {
    const { provider, user } = createUserPayload;
    return this.usersService.createUser(provider, user);
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE_BY_USERNAME_OR_EMAIL)
  findOneUserByUsernameOrEmail(@Payload() emailOrUsername: string): Promise<IUser | undefined> {
    return this.usersService.getUserByEmailOrUsername(emailOrUsername);
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE_ID)
  findOneUserById(@Payload() id: UUID) {
    return this.usersService.getOneUserById(id);
  }

  @MessagePattern(USERS_PATTERNS.REMOVE)
  removeUser(@Payload() id: UUID) {
    return this.usersService.removeUserById(id);
  }

  @MessagePattern(USERS_PATTERNS.UPDATE)
  updateUser(@Payload() id: UUID, dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE_BY_CREDENTIALS)
  findOneUserByCredentials(@Payload() dto: FindOneByCredentialsDto) {
    const { id, version } = dto;

    return this.usersService.getUserByCrendentials(id, version);
  }

}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { USERS_PATTERNS } from '@lib/contracts/users/patterns/users.pattern';
import { CreateUserDto as ClientCreateUserDto } from '@lib/contracts/users/dtos/create-user.dto';
import { OAuthProvidersEnum } from '@lib/contracts/auth/enums/oauth-providers.enum';
import { Post } from '@nestjs/common';


@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Payload()provider: OAuthProvidersEnum, createUserDto: ClientCreateUserDto) {
      return this.usersService.create(provider, createUserDto);
    }

    // @Get(":email")

  // @MessagePattern('findAllUsers')
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @MessagePattern('findOneUser')
  // findOne(@Payload() id: number) {
  //   return this.usersService.findOne(id);
  // }

  // @MessagePattern('updateUser')
  // update(@Payload() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(updateUserDto.id, updateUserDto);
  // }

  // @MessagePattern('removeUser')
  // remove(@Payload() id: number) {
  //   return this.usersService.remove(id);
  // }
}

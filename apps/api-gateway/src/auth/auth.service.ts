import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDto } from '@lib/contracts/auth/dtos/create-user.dto';
import { SERVICES } from '@lib/contracts/services';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@lib/contracts/auth/patterns/auth.pattern';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject(SERVICES.AUTH) private readonly authClient: ClientProxy) {}

  
  public async create(createUserDto: CreateUserDto) {
    console.log("Sending registration request to Auth service");
    try {
      const result = await firstValueFrom(
        this.authClient.send(AUTH_PATTERNS.REGISTER, createUserDto)
      );
      console.log("Registration result:", result);
      return result;
    } catch (error) {
      console.error("Error in registration:", error);
      throw error;
    }
  }
}

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }


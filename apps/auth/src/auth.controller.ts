import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@lib/contracts/auth/patterns/auth.pattern';
import { OAuthProvidersEnum } from '@lib/contracts/auth/enums/oauth-providers.enum';
import { CreateUserDto } from '@lib/contracts/auth/dtos/create-user.dto';
import { Public } from '@lib/common/decorators/public.decorator';
import { UUID } from 'crypto';
import { RefreshAccessDto } from './dtos/refreshToken';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @MessagePattern(AUTH_PATTERNS.REGISTER)
  public async register(@Payload() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Public()
  @MessagePattern(AUTH_PATTERNS.LOGIN)
  public async signin(@Payload() id: UUID) {
    // return this.authService.signIn(id);
  }

  // @Public()
  // @MessagePattern(AUTH_PATTERNS.LOGOUT)
  // public async logout(@Payload() refreshToken: RefreshAccessDto) {
  //   this.authService.logout()
  // }
}
import { ConflictException, Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { IUser } from 'apps/users/src/interfaces/user.interface';
// import { JwtService } from '@auth/jwt';
// import { MailerService } from '@mail/mailer';
import { CreateUserDto as ClientCreateUserDto } from '@lib/contracts/auth/dtos/create-user.dto';
import { UsersService } from './users/users.service';
import { OAuthProvidersEnum } from '@lib/contracts/auth/enums/oauth-providers.enum';
import { CreateUserDto } from '@lib/contracts/users/dtos/create-user.dto';
import { UUID, verify } from 'crypto';
import { isEmail } from 'class-validator';
import { JwtService } from '@auth/jwt';
import { TokenTypeEnum } from '@auth/jwt/enums/token-type.enum';
import { MailerService } from '@mail/mailer';
import { MessageMapper } from '@lib/common/mappers/message.mapper';
import { ConfirmationEmailData } from './interfaces/confirmation-email.interface';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { IAuthResponse } from './interfaces/auth-response.interface';
import { IEmailToken } from '@auth/jwt/interfaces/email-token.interface';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}
  
  public async signUp(dto: ClientCreateUserDto, domain?: string) {
    try {
      const userPayload: CreateUserDto = {
        email: dto.email,
        password: dto.password1,
        username: dto.username,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth
      };

      const user = await this.usersService.create(
        OAuthProvidersEnum.LOCAL,
        userPayload
      );

      const confirmationToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
        domain
      );

      this.mailerService.sendConfirmationEmail(
        user,
        confirmationToken
      );

      return new MessageMapper("Account successfully created.");
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }
  
  public async confirmEmail(
    dto: ConfirmEmailDto,
    domain?: string
  )
  // <IAuthResponse>
   {
    const { confirmationToken } = dto;
    const { id, version } = await this.jwtService.verifyToken<IEmailToken>(
      confirmationToken, 
      TokenTypeEnum.CONFIRMATION
    );
    
    const user = await this.usersService.findOneByCredentials(id, version);


    // return 
    // this.jwtService.verifyToken()
  }

  // public async signIn(id: UUID) {
  //  this.usersService
  // }

  public async logout() {

  }

  public async refreshAccessToken() {

  } 

  private blackListedTokens() {

  }
}

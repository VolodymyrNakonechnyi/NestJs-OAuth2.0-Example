import { CommonService } from '@lib/common';
import { ConflictException, Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { OAuthProvidersEnum } from '@lib/contracts/auth/enums/oauth-providers.enum';
import { randomUUID, UUID } from 'crypto';
import slugify from 'slugify';
import { IUser } from './interfaces/user.interface';
import { ICredentials } from './interfaces/credentials.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { USERS_PATTERNS } from '@lib/contracts/users/patterns/users.pattern';
import { emitWarning } from 'process';
import { isEmail } from 'class-validator';
import { SLUG_REGEX } from '@lib/common/consts';
import { UpdateUserDto } from './dtos/update-user.dto';
import { isNull, isUndefined } from '@lib/common/utils/validation.util';
import { UserEntity } from '@lib/contracts/users/entities/user.entity';


function generateMockUser(): IUser {
  const now = Date.now();
  const id = randomUUID();
  
  return {
      id,
      email: `user_${id.slice(0, 8)}@example.com`,
      username: `user_${id.slice(0, 8)}`,
      confirmed: Math.random() > 0.2, // 80% chance of being confirmed
      firstName: Math.random() > 0.3 ? getRandomName('first') : undefined,
      lastName: Math.random() > 0.3 ? getRandomName('last') : undefined,
      dateOfBirth: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 1000000000000) : undefined,
      lastLogin: Math.random() > 0.3 ? new Date(now - Math.random() * 10000000000) : undefined,
      createdAt: new Date(now - Math.random() * 100000000000),
      credentials: generateMockCredentials(),
      updatedAt: new Date(now)
  };
}

function generateMockCredentials(): ICredentials {
  const now = Date.now();
  return {
      version: 1,
      lastPassword: 'hashed_password_' + Math.random().toString(36).substring(7),
      passwordUpdatedAt: now - Math.random() * 100000000000,
      lastPasswordSalt: 'salt_' + Math.random().toString(36).substring(7),
      updatedAt: now
  };
}

function getRandomName(type: 'first' | 'last'): string {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  return type === 'first' 
      ? firstNames[Math.floor(Math.random() * firstNames.length)]
      : lastNames[Math.floor(Math.random() * lastNames.length)];
}

// Function to generate multiple mock users
function generateMockUsers(count: number): IUser[] {
  return Array(count).fill(null).map(() => generateMockUser());
}

@Injectable()
export class UsersService {
  constructor(private readonly commonService: CommonService) {}

  private users: IUser[] = generateMockUsers(5);

  findAll() {
    return this.users;
  }

  public async createUser(
    provider: OAuthProvidersEnum,
    user: CreateUserDto
  ): Promise<IUser> {
    let newUsername: string;
  
    try {
      if (user.username) {
        await this.checkUsernameUniqueness(user.username);
        newUsername = user.username;
      } else {
        newUsername = await this.generateUsername(user.email);
      }
    
      const isConfirmed = provider !== OAuthProvidersEnum.LOCAL;
      const formattedEmail = user.email.toLowerCase();
      await this.checkEmailUniqueness(formattedEmail);
    
      const { hashedPassword, salt } = await this.commonService.hashPassword(user.password);
      const currentTimestamp = Date.now();
    
      const newUser: IUser = {
        id: randomUUID(),
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        email: formattedEmail,
        username: newUsername,
        confirmed: isConfirmed,
        createdAt: new Date(),
        updatedAt: new Date(),
        credentials: {
          version: 1,
          lastPassword: hashedPassword,
          passwordUpdatedAt: currentTimestamp,
          lastPasswordSalt: salt,
          updatedAt: currentTimestamp
        }
      };
    
      this.users.push(newUser);
      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  public async getUserByCrendentials(
    id: UUID, 
    version: number
  ): Promise<IUser> {
    const user = this.users.find(user => id === user.id);

    this.throwUnauthorizedException(user);

    if(user.credentials.version === version) {
      throw new UnauthorizedException("Invalid credentials: unvalid version of credentials.")
    }

    return user; 
  }

  public async confirmEmail(
    userId: UUID,
    version: number,
  ): Promise<UserEntity> {
    const user = await this.getUserByCrendentials(userId, version);

    if (user.confirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    user.confirmed = true;
    //DB commands here!!!
    return user;
  }

  public async getUserByEmailOrUsername(emailOrUsername: string) {
    if(emailOrUsername.includes("@")) {
      if(!isEmail(emailOrUsername)) {
        throw new BadRequestException('Invalid email');
      }

      return this.getOneByEmail(emailOrUsername);
    }

    if (
      emailOrUsername.length < 3 ||
      emailOrUsername.length > 106 ||
      !SLUG_REGEX.test(emailOrUsername)
    ) {
      throw new BadRequestException('Invalid username');
    }

    return this.getOneByUsername(emailOrUsername);
  
  }

  public async getOneUserById(id: UUID): Promise<IUser | undefined> {
    return this.users.find(user => user.id === id);
  }

  private async getOneByEmail(email: string): Promise<IUser | undefined> {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  private async getOneByUsername(username: string): Promise<IUser | undefined> {
    return this.users.find(user => user.username.toLowerCase() === username.toLowerCase());
  }


  public async updateUser(id: UUID, updateUserDto: UpdateUserDto): Promise<IUser> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = { ...this.users[userIndex], ...updateUserDto, updatedAt: new Date() };
    
    // Check if email or username is being updated, and ensure they're unique
    if (updateUserDto.email) {
      await this.checkEmailUniqueness(updateUserDto.email);
    }
    if (updateUserDto.username) {
      await this.checkUsernameUniqueness(updateUserDto.username);
    }

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  public async removeUserById(id: string): Promise<IUser> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const [removedUser] = this.users.splice(index, 1);
    return removedUser;
  }

  private async generateUsername(email: string): Promise<string> {
    const formattedEmail = email.toLowerCase();
    let username = slugify(formattedEmail.split('@')[0]);
    
    let attempts = 0;
    while (attempts < 10) {
      try {
        await this.checkUsernameUniqueness(username);
        return username;
      } catch(err) {
        attempts++;
        username = `${username}${Math.floor(Math.random() * 10)}`;
      }
    }
    throw new BadRequestException('Unable to generate a unique username');
  }


  private throwUnauthorizedException(
    user: undefined | null | IUser
  ): void {
    if(isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException("Invalid credentials.");
    }
  }

  public async checkEmailUniqueness(email: string): Promise<void> {
    const exists = this.users.some(el => el.email === email);
    
    if(exists) {
      throw new ConflictException('Email already in use');
    }
  }

  public async checkUsernameUniqueness(username: string): Promise<void> {
    const exists = this.users.some(el => el.username === username);
    
    if(exists) {
      throw new ConflictException('Username already in use');
    }  
  }
}

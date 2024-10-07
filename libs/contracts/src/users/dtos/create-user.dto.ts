import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsDate, MinLength, MaxLength, Matches, IsStrongPassword, Length } from 'class-validator';
import { Transform, Type } from 'class-transformer';


export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'New password',
    minLength: 8,
    maxLength: 35,
  })
  @IsString()
  @Length(8, 35)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;

  @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores and hyphens' })
  @Transform(({ value }) => value.toLowerCase())
  username?: string;

  @ApiPropertyOptional({ example: 'John', description: 'The first name of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? value.trim() : value)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe', description: 'The last name of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value ? value.trim() : value)
  lastName?: string;

  @ApiPropertyOptional({ example: '1990-01-01', description: 'The date of birth of the user' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;
}

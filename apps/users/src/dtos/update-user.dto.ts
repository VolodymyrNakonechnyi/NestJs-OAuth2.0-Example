import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength, MaxLength, IsDate } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'john@example.com', description: 'The email of the user' })
    @IsOptional()
    @IsEmail()
    email?: string;
  
    @ApiPropertyOptional({ example: 'johndoe', description: 'The username of the user' })
    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    username?: string;
  
    @ApiPropertyOptional({ example: 'John', description: 'The first name of the user' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    firstName?: string;
  
    @ApiPropertyOptional({ example: 'Doe', description: 'The last name of the user' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    lastName?: string;
  
    @ApiPropertyOptional({ example: '1990-01-01', description: 'The date of birth of the user' })
    @IsOptional()
    @IsDate()
    dateOfBirth?: Date;
  }
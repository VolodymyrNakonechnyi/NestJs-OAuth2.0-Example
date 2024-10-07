import { Match } from '@lib/common/decorators/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, Length, MinLength, Matches } from 'class-validator';

export abstract class PasswordsDto {
  @ApiProperty({
    example: 'Password123!',
    description: 'New password',
    minLength: 8,
    maxLength: 35,
    type: String,
  })
  @IsString()
  @Length(8, 35)
  @IsStrongPassword()
  public password1!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password confirmation',
    minLength: 1,
    type: String,
  })
  @IsStrongPassword()
  @MinLength(1)
  @Match("password1", {message: "Passwords do not match"})
  public password2!: string;
}

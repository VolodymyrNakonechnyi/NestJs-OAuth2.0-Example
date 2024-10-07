import { OAuthProvidersEnum } from '@lib/contracts/auth/enums/oauth-providers.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { Type } from "class-transformer";
import { CreateUserDto } from './create-user.dto';

export class CreateUserPayloadDto {
    @ApiProperty({ enum: OAuthProvidersEnum, description: 'The OAuth provider' })
    @IsNotEmpty()
    @IsEnum(OAuthProvidersEnum)
    provider!: OAuthProvidersEnum;
  
    @ApiProperty({ type: CreateUserDto })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateUserDto)
    user!: CreateUserDto;
}

import { ApiProperty } from "@nestjs/swagger";
import { ICredentials } from "apps/users/src/interfaces/credentials.interface";
import { IsNumber, IsString } from "class-validator";


export class UserCredentialsEntity implements ICredentials {
    @ApiProperty({
        description: 'Version number of the credentials',
        example: 1
    })
    @IsNumber()
    version: number;

    @ApiProperty({
        description: 'Hashed last password',
        example: '$2b$10$abcdefghijklmnopqrstuvwxyz'
    })
    @IsString()
    lastPassword: string;

    @ApiProperty({
        description: 'Timestamp of last password update',
        example: 1634567890000
    })
    @IsNumber()
    passwordUpdatedAt: number;

    @ApiProperty({
        description: 'Salt used for last password',
        example: 'abcdefghijklmnopqrstuvwxyz'
    })
    @IsString()
    lastPasswordSalt: string;

    @ApiProperty({
        description: 'Timestamp of last credentials update',
        example: 1634567890000
    })
    @IsNumber()
    updatedAt: number;
}
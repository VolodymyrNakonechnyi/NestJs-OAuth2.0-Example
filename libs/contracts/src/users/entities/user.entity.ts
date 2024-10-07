import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsEmail, IsString, IsBoolean, IsOptional, ValidateNested, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { UUID } from "crypto";
import { UserCredentialsEntity } from "./user-credentials.entity";
import { IUser } from "apps/users/src/interfaces/user.interface";

export class UserEntity implements IUser {
    @ApiProperty({
        description: 'Unique identifier of the user',
        example: '123e4567-e89b-12d3-a456-426614174000',
        format: 'uuid'
    })
    @IsUUID(4)
    id: UUID;

    @ApiProperty({
        description: 'Email address of the user',
        example: 'user@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Username',
        example: 'johndoe'
    })
    @IsString()
    username: string;

    @ApiProperty({
        description: 'Whether the user has confirmed their email',
        example: true
    })
    @IsBoolean()
    confirmed: boolean;

    @ApiPropertyOptional({
        description: 'First name of the user',
        example: 'John'
    })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional({
        description: 'Last name of the user',
        example: 'Doe'
    })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional({
        description: 'Date of birth',
        example: '1990-01-01T00:00:00.000Z'
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    dateOfBirth?: Date;

    @ApiPropertyOptional({
        description: 'Last login timestamp',
        example: '2023-01-01T00:00:00.000Z'
    })
    @IsDate()
    @Type(() => Date)
    @IsOptional()
    lastLogin?: Date;

    @ApiProperty({
        description: 'Account creation timestamp',
        example: '2023-01-01T00:00:00.000Z'
    })
    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty({
        description: 'User credentials',
        type: () => UserCredentialsEntity
    })
    @ValidateNested()
    @Type(() => UserCredentialsEntity)
    credentials: UserCredentialsEntity;

    @ApiProperty({
        description: 'Last update timestamp',
        example: '2023-01-01T00:00:00.000Z'
    })
    @IsDate()
    @Type(() => Date)
    updatedAt: Date;
}
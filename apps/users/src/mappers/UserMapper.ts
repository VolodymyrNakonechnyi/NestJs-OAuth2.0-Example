import { ApiProperty } from "@nestjs/swagger";
import { IUser } from "../interfaces/user.interface";
import { IResponseUser } from "../interfaces/user-response.interface";
import { IsUUID } from "class-validator";
import { UUID } from "crypto";


export class UserResponseMapper {
    @ApiProperty({
      description: 'User id',
      example: "sdlf-dsfds-dsff-sdfs",
      type: IsUUID
    })
    public id: UUID;
  
    @ApiProperty({
      description: 'User name',
      example: 'John Doe',
      minLength: 3,
      maxLength: 100,
      type: String,
    })
    public name: string;
  
    @ApiProperty({
      description: 'User username',
      example: 'john.doe1',
      minLength: 3,
      maxLength: 106,
      type: String,
    })
    public username: string;
  
    @ApiProperty({
      description: 'User email',
      example: 'example@gmail.com',
      minLength: 5,
      maxLength: 255,
    })
    public email: string;
  
    @ApiProperty({
      description: 'User creation date',
      example: '2021-01-01T00:00:00.000Z',
      type: String,
    })
    public createdAt: string;
  
    @ApiProperty({
      description: 'User last update date',
      example: '2021-01-01T00:00:00.000Z',
      type: String,
    })
    public updatedAt: string;
  
    constructor(values: IResponseUser) {
      Object.assign(this, values);
    }
  
    public static map(user: IUser): UserResponseMapper {
      return new UserResponseMapper({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      });
    }
  }
  
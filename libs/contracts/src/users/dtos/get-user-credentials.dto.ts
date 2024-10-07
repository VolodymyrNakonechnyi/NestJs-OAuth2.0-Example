import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { IFindOneByCredentialsDto } from "../interfaces/find-by-credentials.interface";

export class FindOneByCredentialsDto implements IFindOneByCredentialsDto{
    @ApiProperty({
        description: "User UUID",
        example: "aszd-dasd-sads-dsad"
    })
    public id: UUID;

    @ApiProperty({
        description: 'Version number',
        example: 1
    })
    @IsNumber()
    public version: number;

    constructor(id: UUID, version: number) {
        this.id = id;
        this.version = version;

        return {
            id: this.id,
            version: this.version
        };
    }
}
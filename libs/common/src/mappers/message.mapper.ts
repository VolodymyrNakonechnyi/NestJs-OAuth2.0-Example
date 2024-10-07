import { ApiProperty } from "@nestjs/swagger";
import { randomUUID, UUID } from "crypto";
import { IMessage } from "../interfaces/message.interface";

export class MessageMapper implements IMessage {

    @ApiProperty({
        description: 'Message UUID',
        example: 'c0a80121-7ac0-11d1-898c-00c04fd8d5cd',
        type: String,
    })
    public readonly id: UUID;

    @ApiProperty({
        description: 'Message',
        example: 'Text text',
        type: String,
    })
    public readonly message: string;

    constructor (message: string) {
        this.id = randomUUID();
        this.message = message;
    }
}
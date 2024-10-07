import { UUID } from "crypto";

export interface IMessage {
    id: UUID,
    message: string
}
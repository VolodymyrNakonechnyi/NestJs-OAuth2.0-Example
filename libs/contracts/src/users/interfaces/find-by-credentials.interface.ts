import { UUID } from "crypto";

export interface IFindOneByCredentialsDto {
    id: UUID,
    version: number
}
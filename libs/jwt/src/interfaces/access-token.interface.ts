import { UUID } from "crypto";
import { ITokenBase } from "./base-token.interface";

export interface IAccessPayload {
  id: UUID;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
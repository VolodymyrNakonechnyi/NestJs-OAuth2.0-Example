import { IAccessPayload } from './access-token.interface';
import { ITokenBase } from './base-token.interface';

export interface IEmailPayload extends IAccessPayload {
  version: number;
}

export interface IEmailToken extends IEmailPayload, ITokenBase {}

import { UUID } from "node:crypto";
import { ICredentials } from "./credentials.interface";

export interface IUser {
    id: UUID;
    email: string;
    username: string;
    confirmed: boolean;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    lastLogin?: Date;
    createdAt: Date;
    credentials: ICredentials;
    updatedAt: Date;
}
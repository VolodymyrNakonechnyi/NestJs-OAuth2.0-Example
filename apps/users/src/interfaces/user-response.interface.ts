import { UUID } from "crypto";

export interface IResponseUser {
    id: UUID;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }
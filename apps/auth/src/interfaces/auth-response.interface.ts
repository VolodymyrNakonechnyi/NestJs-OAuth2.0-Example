import { IRefreshToken } from "@auth/jwt/interfaces/refresh-token";
import { IAccessJwt } from "@lib/config/interfaces/jwt.interface";
import { IUser } from "apps/users/src/interfaces/user.interface";

export interface IAuthResponse {
    user: IUser,
    accessToken: IAccessJwt,
    refreshToken: IRefreshToken,
    expiresTime: Date
}
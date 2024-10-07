import { IEmailConfig } from "./email-config.interface";
import { IJwt } from "./jwt.interface";

export interface IConfig {
    readonly id: string;
    readonly url: string;
    readonly apiGatewayPort: number;
    readonly usersPort: number;
    readonly authPort: number;
    readonly domain: string;
    readonly jwt: IJwt;
    readonly emailConfig: IEmailConfig;
}
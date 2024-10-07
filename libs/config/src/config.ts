import { readFileSync } from "fs";
import { join } from "path";
import { IConfig } from "./interfaces/config.interface";


export function configuration():IConfig {
    const privateKey = readFileSync(
        join(__dirname, '..','..','..','keys/id_rsa_priv.pem'),
        'utf-8'
    );

    const publicKey = readFileSync(
        join(__dirname, '..','..','..','keys/id_rsa_pub.pem'),
        'utf-8'
    );

    return {
        id: process.env.APP_ID,
        url: process.env.DATABASE_URL,
        apiGatewayPort: parseInt(process.env.API_GATEWAY_PORT, 10),
        usersPort: parseInt(process.env.USERS_PORT, 10),
        authPort: parseInt(process.env.AUTH_PORT, 10),
        domain: process.env.DOMAIN,
        jwt: {
            access: {
                privateKey,
                publicKey,
                time: process.env.JWT_ACCESS_TIME
            },
            refresh: {
                secret: process.env.JWT_REFRESH_SECRET,
                time: process.env.JWT_REFRESH_TIME
            },
            resetPassword: {
                secret: process.env.JWT_RESET_PASSWORD_SECRET,
                time: process.env.JWT_RESET_PASSWORD_TIME
            },
            confirmation: {
                secret: process.env.JWT_CONFIRMATION_SECRET,
                time: process.env.JWT_CONFIRMATION_TIME
            }
        },

        emailConfig: {              
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: !!process.env.EMAIL_SECURE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        }
    };
}


import * as Joi from "joi";

export const validationConfigSchema = Joi.object({
    NODE_ENV:  Joi.string().required(),
    APP_ID: Joi.string().uuid({version: "uuidv4"}).required(),
    DOMAIN: Joi.string().required(),
    API_GATEWAY_PORT: Joi.number().integer().required(),
    USERS_PORT: Joi.number().integer().required(),
    AUTH_PORT: Joi.number().integer().required(),
    JWT_ACCESS_TIME: Joi.number().integer().required(),
    JWT_CONFIRMATION_SECRET: Joi.string().required(),
    JWT_CONFIRMATION_TIME: Joi.number().integer().required(),
    JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
    JWT_RESET_PASSWORD_TIME: Joi.number().integer().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_TIME: Joi.number().integer().required(),
    DATABASE_URL: Joi.string().uri().required(),
    EMAIL_HOST: Joi.string().hostname().required(),
    EMAIL_PORT: Joi.number().integer().required(),
    EMAIL_SECURE: Joi.boolean().required(),
    EMAIL_USER: Joi.string().email().required(),
    EMAIL_PASSWORD: Joi.string().required()
});
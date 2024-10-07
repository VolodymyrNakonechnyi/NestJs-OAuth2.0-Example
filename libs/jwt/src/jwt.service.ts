import { Injectable } from '@nestjs/common';
import { IJwt } from '@lib/config/interfaces/jwt.interface';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IUser } from 'apps/users/src/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { TokenTypeEnum } from './enums/token-type.enum';
import { IAccessPayload } from './interfaces/access-token.interface';
import { IEmailPayload } from './interfaces/email-token.interface';
import { IRefreshPayload } from './interfaces/refresh-token';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { IAccessToken } from './interfaces/access-token.interface';
import { IRefreshToken } from './interfaces/refresh-token';
import { IEmailToken } from './interfaces/email-token.interface';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CommonService } from '@lib/common';


@Injectable()
export class JwtService {
    private readonly jwtConfig: IJwt;
    private readonly issuer: string;
    private readonly domain: string;

    constructor(
        private readonly commonService: CommonService,
        private readonly configService: ConfigService,
        private readonly nestJwtService: NestJwtService
    ) {
        this.jwtConfig = this.configService.get<IJwt>('jwt');
        this.issuer = this.configService.get<string>("id");
        this.domain = this.configService.get<string>("domain")
    }

    public get accessTime() {
        return this.jwtConfig.access.publicKey
    }

    private static async verifyTokenAsync<T>(
        token: string,
        secret: string,
        options: jwt.VerifyOptions,
      ): Promise<T> {
        return new Promise((resolve, rejects) => {
          jwt.verify(token, secret, options, (error, payload: T) => {
            if (error) {
              rejects(error);
              return;
            }
            resolve(payload);
          });
        });
      }

    private static async generateTokenAsync(
        payload: IAccessPayload | IEmailPayload | IRefreshPayload,
        secret: string,
        options: jwt.SignOptions,
      ): Promise<string> {
        return new Promise((resolve, rejects) => {
          jwt.sign(payload, secret, options, (error, token) => {
            if (error) {
              rejects(error);
              return;
            }
            resolve(token);
          });
        });
      }
    private static async throwBadRequest<
        T extends IAccessToken | IRefreshToken | IEmailToken,
    >(promise: Promise<T>): Promise<T> {
        try {
            return await promise;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new BadRequestException('Token expired');
            }
            
            if (error instanceof jwt.JsonWebTokenError) {
                throw new BadRequestException('Invalid token');
            }
            
            throw new InternalServerErrorException(error);
        }
    }

    public async generateToken(
        user: IUser,
        tokenType: TokenTypeEnum,
        domain?: string | null,
        tokenId?: string | null
    ):Promise<string> {
        const jwtOptions: jwt.SignOptions = {
            issuer: this.issuer,
            subject: user.email,
            // domain: domain ?? this.domain,
            algorithm: "HS256"  
        }
        switch(tokenType) {
            case TokenTypeEnum.ACCESS:
                const {privateKey, time: accessTime} = this.jwtConfig.access;
                return this.commonService.throwInternalError(
                    JwtService.generateTokenAsync({ id: user.id }, privateKey, {
                        ...jwtOptions,
                        expiresIn: accessTime,
                        algorithm: "RS256"
                    })
                );

            case TokenTypeEnum.REFRESH:
                const { secret: refreshSecret, time: refreshTime } = this.jwtConfig.refresh;
                return this.commonService.throwInternalError(
                    JwtService.generateTokenAsync({ 
                        id: user.id,
                        version: user.credentials.version,
                        tokenId: tokenId ?? randomUUID() 
                    }, refreshSecret, {
                        ...jwtOptions,
                        expiresId: refreshTime,
                    })
                )
            case TokenTypeEnum.CONFIRMATION:
            case TokenTypeEnum.RESET_PASSWORD:
                const { secret, time} = this.jwtConfig[tokenType];

                return this.commonService.throwInternalError( 
                    JwtService.generateTokenAsync(
                        { id: user.id, version: user.credentials.version },
                        secret,
                        {
                        ...jwtOptions,
                        expiresIn: time,
                        },
                    )
                );
        }
    }

    async verifyToken<
        T extends IAccessToken | IEmailToken | IRefreshToken,
    >(
        jwtToken: string, 
        tokenType: TokenTypeEnum
    ): Promise<T> {
        const verifyOptions: jwt.VerifyOptions = {
            audience: new RegExp(this.domain),
            issuer: this.issuer
        };

        switch(tokenType) {
            case TokenTypeEnum.ACCESS: 
                const {publicKey, time: accessTime } = this.jwtConfig.access;
                return JwtService.throwBadRequest(
                    JwtService.verifyTokenAsync(jwtToken, publicKey, {
                        ...verifyOptions,
                        maxAge: accessTime,
                        algorithm: ["RS256"]
                    })
                );

            case TokenTypeEnum.REFRESH:
            case TokenTypeEnum.CONFIRMATION:
            case TokenTypeEnum.RESET_PASSWORD:
                const { secret, time } = this.jwtConfig[tokenType];

                return JwtService.throwBadRequest(
                    JwtService.verifyTokenAsync(jwtToken, secret, {
                        ...verifyOptions,
                        maxAge: time,
                        algorithm: ["HS256"]
                    })
                );
        }
    } 
    
    async generateAuthTokens(
         user: IUser,
         domain?: string | null,
         tokenId?: string
    ): Promise<[string, string]> {
        return Promise.all([
            await this.generateToken(user, TokenTypeEnum.ACCESS, domain, tokenId),
            await this.generateToken(user, TokenTypeEnum.REFRESH, domain, tokenId)
        ]);  
    }
}

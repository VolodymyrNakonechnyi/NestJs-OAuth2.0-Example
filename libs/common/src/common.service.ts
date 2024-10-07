import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';
import slugify from 'slugify';
import { randomBytes, scrypt } from "crypto";
import { error } from 'console';
import { resolve } from 'path';
import { rejects } from 'assert';

interface IHashedPassword {
  hashedPassword: string,
  salt: string
} 

@Injectable()
export class CommonService {
    private readonly loggerService: LoggerService;

    constructor() {
        this.loggerService = new Logger();
    }

    public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
        try {
          return await promise;
        } catch (error) {
          this.loggerService.error(error);
          throw new InternalServerErrorException(error);
        }
    }


    public formatName(title: string): string {
      return title
        .trim()
        .replace(/\n/g, ' ')
        .replace(/\s\s+/g, ' ')
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
    }
  

    public generatePointSlug(str: string): string {
      return slugify(str, { lower: true, replacement: '.', remove: /['_\.\-]/g });
    }

    public async hashPassword(password: string):Promise<IHashedPassword> {
      return new Promise((resolve, reject) => {
        const salt = randomBytes(64).toString("hex");
      
        scrypt(password, salt, 256, (err, derivedKey) => {
          if(err) {
            this.loggerService.error(err);
            reject(new InternalServerErrorException(err));         
          } else {
            resolve({
              hashedPassword: derivedKey.toString("hex"),
              salt
            })
          }
        });
      })
    }

    public async verifyPasswords(password: string, hashedPassword: string, salt: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        scrypt(password, salt, 256, (err, derivedKey) => {
          if(err) {
            this.loggerService.error(err);
            reject(new InternalServerErrorException(err));
          } else {
            resolve(derivedKey.toString("hex") === hashedPassword);
          }
        });
      })  
    }
}


import { HttpException, HttpStatus, Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthorizationMiddleware.name);
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.header('Authorization');

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new HttpException("Unauthenticated.", HttpStatus.UNAUTHORIZED);
        }

        const token = authorizationHeader.split('Bearer ')[1];

        try {
            const isValid = await this.isTokenValid(token);

            if (isValid) {
                next();
            } else {
                console.log("Kiking out!!!");
                throw new HttpException("Unauthenticated.", HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            return error;
        }
    }
    async isTokenValid(token: string): Promise<boolean> {
        const data = {
           token
        };
    
        try {
            this.logger.log("Here in the middleware isTokenValid ", token);
            const response = await lastValueFrom(this.natsClient.send({ cmd: 'verifyUser' }, data));
            this.logger.log("Verifying user answer ", response);
            if (response.answ === "Token verified") {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
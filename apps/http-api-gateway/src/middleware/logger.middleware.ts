import { HttpException, HttpStatus, Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request, Response, NextFunction } from 'express';
import { lastValueFrom } from 'rxjs';


@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthorizationMiddleware.name);
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {
        this.logger.log('Authorization middleware initialized');
    }
    
    async use(req: Request, res: Response, next: NextFunction) {
        this.logger.log('Applying Authorization middleware');
        const authorizationHeader = req.header('Authorization');

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new HttpException("UNAUTHORIZED.", HttpStatus.UNAUTHORIZED);
        }

        const token = authorizationHeader.split('Bearer ')[1];

        try {
            const isValid = await this.isTokenValid(token);

            if (isValid) {
                next();
            } else {
                console.log("Kiking out!!!");
                throw new HttpException("UNAUTHORIZED.", HttpStatus.UNAUTHORIZED);
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
            this.logger.log("Checking the validity of the user");
            const response = await lastValueFrom(this.natsClient.send({ cmd: 'isJWTValid' }, data));
            this.logger.log("Verifying user answer ", response);
            return response;
        } catch (error) {
            throw new HttpException("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
import { Body, Controller, Get, Inject, Logger, Param, Post, Request, Headers } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
    
    @Post('/api/login')
    async login(@Body() body) {
        this.logger.log('Login user ', body);
        return await lastValueFrom(this.natsClient.send({ cmd: 'loginUser' }, {username: body.username, password: body.password}));
    }
  
    @Post('/api/register')
    async register(@Body() body) {
      this.logger.log('Registering user ', body.username);
      return await lastValueFrom(this.natsClient.send({cmd: "registerUser"}, {
        ...body
      }));
    }
}

import { 
    Body, 
    Controller, 
    Inject, 
    Logger, 
    Post,
    HttpStatus,
    HttpException,
    NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';



@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
    
    @Post('/api/login')
    async login(@Body() body) {
        this.logger.log('Login user ', body);
        const response = await lastValueFrom(
          this.natsClient.send(
            { cmd: 'loginUser' },
            {username: body.username, password: body.password}
          ));
        if (response.message_error) {
          this.logger.error('Error logging in user ', response.message_error);
          if (response.type_error === `NotFoundException`)
            throw new HttpException(response.message_error, HttpStatus.NOT_FOUND);

          throw new HttpException(response.message_error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
  
    @Post('/api/register')
    async register(@Body() body) {
      this.logger.log('Registering user ', body.username);
      return await lastValueFrom(this.natsClient.send({cmd: "registerUser"}, {
        ...body
      }));
    }
}

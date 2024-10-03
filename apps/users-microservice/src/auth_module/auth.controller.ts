import { Controller, Logger, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';


@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {
  }


  @MessagePattern({ cmd: 'loginUser' })
  async login(@Payload() req) {
    this.logger.log('Login user ', req);
    return await this.authService.login(req)
    .catch(error => {
      this.logger.error('Error logging in user ', error);
      if (error instanceof NotFoundException) {
        this.logger.error('User not found', req.username);
        return {
          message_error: `User not found ${req.username}`,
          type_error: `NotFoundException`
        }
      }
      throw error;
    });
  }

  @MessagePattern({ cmd: 'registerUser' })
  async register(@Payload() body) {
    this.logger.log("Received the user to be regitered ", body);
    return await this.authService.register(body);
  }

  @MessagePattern({cmd: 'isJWTValid'})
  async isJWTValid(@Payload() { token }) {
    this.logger.log('Decoding JWT token ');
    const {username, password, id, role, canRead, canWrite} = this.authService.decodeJwtToken(token);
    this.logger.log('JWT token decoded  ', username, password, id, role, canRead, canWrite);
    const user = await this.authService.findUserById(id);
    this.logger.log('User Found ', JSON.stringify(user));
    return user 
          && user.username == username 
          && user.password == password 
          && user.role == role;
  }

}

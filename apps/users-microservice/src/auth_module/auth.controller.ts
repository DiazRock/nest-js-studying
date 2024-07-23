import { Controller, Logger } from '@nestjs/common';
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
    return this.authService.login(req);
  }

  @MessagePattern({ cmd: 'registerUser' })
  async register(@Payload() body) {
    this.logger.log("Received the user to be regitered ", body);
    return await this.authService.register(body);
  }

  @MessagePattern({cmd: 'isJWTValid'})
  async isJWTValid(@Payload() { token }) {
    this.logger.log('Decoding JWT token ');
    const {username, password, id, role} = this.authService.decodeJwtToken(token);
    const user = await this.authService.findUserById(id);
    this.logger.log('User Found ', JSON.stringify(user));
    return user && user.username == username && user.password == password && user.role == role;
  }

}

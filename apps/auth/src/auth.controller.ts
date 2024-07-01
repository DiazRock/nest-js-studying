import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';


@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {
  }

  @MessagePattern({ cmd: 'loginUser' })
  async login(@Payload() req) {
    return this.authService.login(req);
  }

  @MessagePattern({ cmd: 'registerUser' })
  async register(@Payload() body) {
    const { username, password } = body;
    this.logger.log("Received the user to be regitered ", body);
    return await this.authService.register(username, password);
  }

  @MessagePattern({ cmd: 'verifyUser' })
  async verify(@Payload() body) {
    const { token } = body;
    console.log("Here in the verifier");
    return this.authService.verifyUser(token);
  }
}

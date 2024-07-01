import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { User } from './users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    if (this.usersService.verifyLogin(user.username, user.password))
      return {
        access_token: this.jwtService.sign(user),
      };
    
  }

  async register(username: string, password: string) {
    this.logger.log("Inside the register function in the service ", username);
    let user: User;
    if (!this.usersService.isUserRegistered(username)) 
      user = await this.usersService.addUser(username, password);
    if (user === null)
      return {answer: "The user is already logged", user: user};
    return {answer: "User registered", user: user}
  }

  async verifyUser(jwt: string) {
    this.logger.log("Verifying the user ", jwt);
    return {answ: "Token verified", payload: this.jwtService.verify(jwt)};
  }
}

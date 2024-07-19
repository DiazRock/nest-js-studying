import jwtDecode from "jwt-decode";
import { JwtService } from "@nestjs/jwt";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtToken } from "./jwt-model/jwt-token.model";
import { CreateUserDto } from "../users/dtos/CreateUser.dto";
import { UsersService } from "src/users/users-microservice.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    
  }

  public decodeJwtToken(authorizationToken: string): JwtToken {
    try {
      return jwtDecode(authorizationToken);
    }
    catch (err) {
      throw new UnauthorizedException();
    }
  }

  async login(user: CreateUserDto) {
    this.logger.log("Authenticating the user ", user);
    const users = await this.usersService.findByUsername(user.username);
    const user_info = users[0];
    const id = user_info.id;
    const user_to_hash = {...user, id};
    this.logger.log(`User founded`, JSON.stringify(user_info));
      return {
        user_id: user_info.id,
        user_permissions: user_info.permissions,
        user_role: user_info.role,
        access_token: this.jwtService.sign(user_to_hash),
      };
  }

  async register(user: CreateUserDto) {
    this.logger.log("Creating the user from the auth module ", user);
    const answ = await this.usersService.createUser(user);
    return {answer: "User registered", user: answ};
  }

}

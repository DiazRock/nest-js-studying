import jwtDecode from "jwt-decode";
import { JwtService } from "@nestjs/jwt";
import { Injectable, Logger, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { JwtToken } from "./jwt-model/jwt-token.model";
import { CreateUserDto } from "../users/dtos/CreateUser.dto";
import { UsersService } from "../users/users-microservice.service";

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
      return jwtDecode<JwtToken>(authorizationToken);
    }
    catch (err) {
      this.logger.error(`Error decoding JWT token: ${err}`);
      throw new UnauthorizedException();
    }
  }

  async login(user: CreateUserDto) {
    this.logger.log("Authenticating the user ", user);
    const users = await this.usersService.findByUsername(user.username);
    if (users.length === 0) {
      this.logger.error("User not found for username ", user.username);
      throw new NotFoundException("Invalid credentials");
    }
    this.logger.log("User founded ", users[0].id);
    const user_info = users[0];
    const id = user_info.id;
    const role = user_info.role;
    const user_to_hash = {...user, id, role};
    this.logger.log(`User founded`, JSON.stringify(user_info));
    const response_object = {
      userId: id,
      canWrite: user_info.canWrite,
      canRead: user_info.canRead,
      userRole: role,
      accessToken: this.jwtService.sign(user_to_hash),
    }
    this.logger.log(`Generated token for user ${id}`);
    return response_object;
  }

  async register(user: CreateUserDto) {
    this.logger.log("Creating the user from the auth module ", user);
    const answ = await this.usersService.createUser(user);
    return {answer: "User registered", user: answ};
  }

  async findUserById(id: string) {
    return await this.usersService.getUserById(id);
  }
}

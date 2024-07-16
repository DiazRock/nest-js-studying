import jwtDecode from "jwt-decode";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtToken } from "./model/jwt-token.model";

@Injectable()
export class AuthService {

  public decodeJwtToken(authorizationToken: string): JwtToken {
    let decodedToken: JwtToken;
    try {
      decodedToken = jwtDecode(authorizationToken);
    }
    catch (err) {
      throw new UnauthorizedException();
    }
    return decodedToken;
  }
}

import { Injectable, CanActivate, ExecutionContext, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { JwtToken } from "./model/jwt-token.model";

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private readonly authService: AuthService, private readonly reflector: Reflector) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesFunctions = this.reflector.getAll<((userRoles: string[]) => boolean)[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization?.split(" ")[1];
    
    const tokenInfoDto: JwtToken =  this.authService.decodeJwtToken(authorization);
    let result = tokenInfoDto != null && tokenInfoDto.expTime > Math.floor(Date.now() / 1000);;
    rolesFunctions.forEach(func => {
      if (func) {
        result = result && func(tokenInfoDto.roles);
      }
    });

    request.tokenInfo = tokenInfoDto;
    return result;
  }
}

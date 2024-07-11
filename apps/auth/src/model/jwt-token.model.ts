import { JwtTokenUserInfo } from './jwt-token-user-info.model'

export class JwtToken {
    
    public roles: string[];
    
    public expTime: number;
    
    public userInfo: JwtTokenUserInfo[];
  }
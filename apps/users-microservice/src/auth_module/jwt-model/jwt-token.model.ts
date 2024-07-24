export class JwtToken {
    
    public username: string;

    public password: string;

    public id: string;

    public role: string;
    
    public canRead: boolean;

    public canWrite: boolean;
    
    public iat: number;
    
    public exp: number;
    
  }
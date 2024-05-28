import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}

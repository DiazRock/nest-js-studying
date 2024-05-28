import { Controller, Get } from '@nestjs/common';
import { UsersMicroserviceService } from './users-microservice.service';

@Controller()
export class UsersMicroserviceController {
  constructor(private readonly usersMicroserviceService: UsersMicroserviceService) {}

  @Get()
  getHello(): string {
    return this.usersMicroserviceService.getHello();
  }
}

import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './users-microservice.service';

@Controller()
export class UsersMicroserviceController {
  private readonly logger: Logger = new Logger(UsersMicroserviceController.name);
  constructor(private usersService: UsersService) {}
  @MessagePattern({ cmd: 'createUser' })
  createUser(@Payload() data: CreateUserDto) {
    this.logger.log('creating user', data)
    return this.usersService.createUser(data);
  }

  @MessagePattern({ cmd: 'getUserById' })
  getUserById(@Payload() data) {
    const { userId } = data;
    this.logger.log('Searching user by id', userId)
    return this.usersService.getUserById(userId);
  }

  @MessagePattern({ cmd: 'getAllUsers' })
  getUsers(){
    this.logger.log("Executing the controller method for the message")
    return this.usersService.getUsers();
  }

  @EventPattern('paymentCreated')
  paymentCreated(@Payload() data: any) {
    this.logger.log('Payment created', data)
  }
}

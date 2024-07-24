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
    this.logger.log("Getting all the users of the plattform");
    return this.usersService.getUsers();
  }

  @MessagePattern({ cmd: 'getUserPermissions' })
  getUserPermissions(@Payload() data){
    const { id } = data;

    this.logger.log(`Getting user role for user with id ${id}`);
    return this.usersService.getUserPermissions(id);
  }


  @EventPattern('paymentCreated')
  paymentCreated(@Payload() data: any) {
    this.logger.log('Payment created', data)
    const { user } = data;
    this.logger.log(`Updating user ${user}`)
    return this.usersService.updateUser(user);
  }
}

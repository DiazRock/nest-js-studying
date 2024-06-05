import {
    Controller,
    Inject,
    Post,
    Body,
    Get,
    Param,
    HttpException,
    HttpCode
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  import { CreateUserDto } from './dtos/CreateUser.dto';
  import { lastValueFrom } from 'rxjs';
  import { Logger } from '@nestjs/common';
  
  @Controller('users')
  export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
  
    @Post()
    @HttpCode(204)
    createUser(@Body() createUserDto: CreateUserDto) {
      this.logger.log('Creating user ', createUserDto);
      this.natsClient.send({ cmd: 'createUser' }, createUserDto);
      return 'New user created successfully';
    }
  
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise <CreateUserDto | HttpException> {
      const user = await lastValueFrom(
        this.natsClient.send({ cmd: 'getUserById' }, { userId: id }),
      );
      if (user) return user;
      throw new HttpException('User Not Found', 404);
    }
  }
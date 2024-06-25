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
    async createUser(@Body() createUserDto: CreateUserDto) {
      this.logger.log('Creating user ', createUserDto);
      const { id, username } =  await lastValueFrom(this.natsClient.send({ cmd: 'createUser' }, createUserDto));
      this.logger.debug('New user created successfully ', createUserDto);
      return { id, username };
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
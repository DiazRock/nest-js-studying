import {
    Controller,
    Inject,
    Post,
    Body,
    Get,
    Param,
    HttpException,
    HttpCode,
    InternalServerErrorException,
    HttpStatus,
    Headers
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  import { CreateUserDto } from './dtos/CreateUser.dto';
  import { lastValueFrom } from 'rxjs';
  import { Logger } from '@nestjs/common';
import { User } from 'typeorm/entities/user';
  
  @Controller('users')
  export class UsersController {
    private readonly logger = new Logger(UsersController.name);
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDto: CreateUserDto) {
      this.logger.log('Creating user ', createUserDto);
      try {
        const { id, username } =  await lastValueFrom(this.natsClient.send({ cmd: 'createUser' }, createUserDto));
        this.logger.debug('New user created successfully ', createUserDto);
        return {id, username };
      } catch (error) {
        this.logger.error('Error creating user', error);
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  
    @Get(':id')
    async getUserById(@Param('id') id: string): Promise <CreateUserDto | HttpException> {
      const user = await lastValueFrom(
        this.natsClient.send({ cmd: 'getUserById' }, { userId: id }),
      );
      if (user) return user;
      throw new HttpException('User Not Found', 404);
    }

    @Get()
    async listUsers(): Promise <User[]> {
      this.logger.log("Fetching users")
      const users = await lastValueFrom(
        this.natsClient.send({ cmd: 'getAllUsers' }, {}),
      );
      if (users) return users;
      throw new HttpException('User Not Found', 404);
    }

    @Get('/user/permissions/:id')
    async getUserPermissions(@Headers() headers: Record <string, string>, @Param() id: string) {
      this.logger.log(`Getting user permissions for user id ${id}`);
      const token = headers['Authorization'].split(' ')[1];
      const decodedToken = await lastValueFrom(
        this.natsClient.send({
          cmd: 'decodeToken'
        },
        { token })
      )
      if (decodedToken.id === id) {
        const permissions = await lastValueFrom(
          this.natsClient.send({ cmd: 'getUserPermissions' }, { id })
        );
        return permissions;
      }
      throw new HttpException('Unauthorized', 401);
    }
  }
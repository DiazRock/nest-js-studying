import { UsersService } from '../users/users-microservice.service'
import { CreateUserDto } from '../users/dtos/CreateUser.dto';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(UsersService.name);
  constructor(private usersService: UsersService) {
    this.logger.log('SeedService started.');
  }

  async onApplicationBootstrap() {
    const adminList = await this.usersService.findByUsername('admin');
    this.logger.log(`Checking if admin user exists. ${adminList}`);
    if (adminList.length == 0) {
      const userDto: CreateUserDto = {
        username: 'admin',
        email: 'admin@admin.com',
        password: 'admin',
        balance: 500,
      }
      await this.usersService.createAdmin(userDto);
      this.logger.log('Admin user created.');
    } else {
      this.logger.log('Admin user already exists.');
    }
  }
} 
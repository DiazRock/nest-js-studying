import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersMicroserviceController } from './users-microservice.controller';
import { UsersService } from './users-microservice.service';
import { User } from '../typeorm/entities/user';
import { Payment } from '../typeorm/entities/Payment';

@Module({
  imports: [TypeOrmModule.forFeature([User, Payment])],
  controllers: [UsersMicroserviceController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}

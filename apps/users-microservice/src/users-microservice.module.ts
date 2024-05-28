import { Module } from '@nestjs/common';
import { UsersMicroserviceController } from './users-microservice.controller';
import { UsersMicroserviceService } from './users-microservice.service';

@Module({
  imports: [],
  controllers: [UsersMicroserviceController],
  providers: [UsersMicroserviceService],
})
export class UsersMicroserviceModule {}

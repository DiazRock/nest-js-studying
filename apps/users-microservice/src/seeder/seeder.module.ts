import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users-microservice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { SeedService } from './seeder.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        UsersModule
    ],
    providers: [SeedService],
  })
export class SeederModule {}
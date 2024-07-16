import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users-microservice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../typeorm/entities/admin';
import { SeedService } from './seeder.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        UsersModule
    ],
    providers: [SeedService],
  })
export class SeederModule {}
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users-microservice.module';
import { SeederModule } from './seeder/seeder.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth_module/auth.module';
import ormconfig from './ormconfig';


@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    SeederModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

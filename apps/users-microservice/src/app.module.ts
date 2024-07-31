import { Module } from '@nestjs/common';
import { UsersModule } from './users/users-microservice.module';
import { SeederModule } from './seeder/seeder.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Payment } from './typeorm/entities/Payment';
import { AuthModule } from './auth_module/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_db',
      port: 3307,
      database: 'nestjs_db',
      entities: [User, Payment],
      synchronize: true,
      username: 'testuser',
      password: 'testuser123',
    }),
    AuthModule,
    UsersModule,
    SeederModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

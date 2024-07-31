import { Module } from '@nestjs/common';
import { PaymentsModule } from './Payments/payments-microservice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './typeorm/entities/Payments';
import { User } from './typeorm/entities/User';

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
      logging: 'all'
    }),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

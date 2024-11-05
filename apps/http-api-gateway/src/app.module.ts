import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './Payment/payments.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { NatsClientModule } from './nats-client/nats-client.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    TypeOrmModule.forRoot(ormconfig),
    UsersModule, 
    PaymentsModule,
    AuthModule,
    NatsClientModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

}

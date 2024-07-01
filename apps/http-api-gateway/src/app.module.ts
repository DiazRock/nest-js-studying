import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './Payment/payments.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthorizationMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { NatsClientModule } from './nats-client/nats-client.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    UsersModule, 
    PaymentsModule,
    AuthModule,
    NatsClientModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule{
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthorizationMiddleware)
  //     .forRoutes(
  //       { path: 'users/*', method: RequestMethod.ALL },
  //       { path: 'payments/*', method: RequestMethod.ALL }
  //     ); // Set the routes that will use the middleware
  // }
}

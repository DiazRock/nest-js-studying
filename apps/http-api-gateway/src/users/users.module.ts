import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { AuthorizationMiddleware } from '../middleware/logger.middleware';

@Module({
  imports: [NatsClientModule],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthorizationMiddleware)
        .forRoutes(
          UsersController
        ); // Set the routes that will use the middleware
    }
}

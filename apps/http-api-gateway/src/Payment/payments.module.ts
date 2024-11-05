import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { PaymentsController } from './payments.controller';
import { AuthorizationMiddleware } from '../middleware/logger.middleware';

@Module({
  imports: [NatsClientModule],
  controllers: [PaymentsController],
  providers: [],
})
export class PaymentsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .forRoutes(
        PaymentsController
      ); // Set the routes that will use the middleware
  }
}

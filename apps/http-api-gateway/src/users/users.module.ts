import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { NatsClientModule } from '../nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}

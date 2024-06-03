import { Module } from '@nestjs/common';
import { PaymentsMicroserviceController } from './payments-microservice.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { PaymentsService } from './payments-microservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../typeorm/entities/Payments';
import { User } from 'src/typeorm/entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User]), NatsClientModule],
  controllers: [PaymentsMicroserviceController],
  providers: [PaymentsService],
})
export class PaymentsModule {}

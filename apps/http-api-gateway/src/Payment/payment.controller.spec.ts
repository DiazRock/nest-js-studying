import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { CreatePaymentDto } from './dto/CreatePayment.dto';
import * as rxjs from 'rxjs';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { ClientProxy } from '@nestjs/microservices';

const paymentDto: CreatePaymentDto = {
    amount: 100,
    userId: '1',
    label: 'test payment'
}

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: 'NATS_SERVICE',
          useValue: {
            emit: async (paymentDto: CreatePaymentDto) => paymentDto
          }
        }
      ]
    })
    .compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a payment successfully ', async () => {
    expect(await controller.createPayment(paymentDto)).toBe('Payment created successfully');
  })
});

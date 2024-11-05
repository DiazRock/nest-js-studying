import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { CreatePaymentDto } from './dto/CreatePayment.dto';
import { MockClientProxy } from '../../test/mocks/client-proxy.mock';

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
          useClass: MockClientProxy
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
    expect(await controller.createPayment(paymentDto)).toStrictEqual(
      {
        "amount": 100, 
        "label": "test_label", 
        "paymentId": "p1", 
        "user": {}
      });
  })
});

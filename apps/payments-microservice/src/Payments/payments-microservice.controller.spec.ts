import { Test } from '@nestjs/testing';
import { PaymentsService } from './payments-microservice.service';
import { CreatePaymentDto } from './dtos/CreatePayment.dto';
import { User } from '../typeorm/entities/User';
import { Payment } from '../typeorm/entities/Payments';
import { PaymentsMicroserviceController } from './payments-microservice.controller';


describe('PaymentsMicroserviceController', () => {
    let controller: PaymentsMicroserviceController;
    const paymentDto: CreatePaymentDto = {
        amount: 100,
        userId: '1'
    }
    const expectedUser: User = {
        username: 'test',
        displayName: 'pass',
        email: 'test@',
        id: '',
        payments: []
    };
  
    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        controllers: [PaymentsMicroserviceController],
        providers: [
            {
                provide: 'NATS_SERVICE',
                useValue: {
                  emit: async () => expectedUser
                }
              }
        ]
      })
        .useMocker((token) => {
          if (token === PaymentsService) {
            return { createPayment: jest.fn(
                (paymentDto) => <Payment>{
                    ...paymentDto,
                    user: expectedUser
                } 
            ) };
          }
        })
        .compile();
  
      controller = moduleRef.get(PaymentsMicroserviceController);
    });
    describe('PaymentsMicroserviceController functionalities', () => {
        it ('should create a payment via the controller', async () => {
            const result = await controller.createPayment(paymentDto);
            expect(result).toBe(true);
        })
    })
  });

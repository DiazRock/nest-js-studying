import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments-microservice.service';
import * as rxjs from 'rxjs';
import { CreatePaymentDto } from './dtos/CreatePayment.dto';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { Payment } from '../typeorm/entities/Payments';



describe('PaymentsMicroserviceService', () => {
  let paymentsService: PaymentsService;
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
  const payment: Payment = {
    id: 'paymentId',
    amount: 100,
    user: expectedUser,
  }


  beforeEach(async () => {

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            create: async () => payment,
            save: async (payment: Payment) => payment
          }
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: async (user: User) => user
          }
        },
        {
          provide: 'NATS_SERVICE',
          useValue: {
            send: () => expectedUser
          }
        }
      ],
    }).compile();

    paymentsService = app.get<PaymentsService>(PaymentsService);
  });

  describe('PaymentsService functionalities', () => {
    it('should create a payment ', async () => {
      jest.spyOn(rxjs, 'lastValueFrom').mockImplementation( async () => expectedUser);
      expect(await paymentsService.createPayment(paymentDto)).toBe(payment);
    });
  });
});

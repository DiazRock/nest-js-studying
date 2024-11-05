import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsMicroserviceController } from './payments-microservice.controller';
import { PaymentsService } from './payments-microservice.service';
import { ClientProxy } from '@nestjs/microservices';
import { TestData } from './TestData';

describe('PaymentsMicroserviceController', () => {
  let controller: PaymentsMicroserviceController;
  let paymentsService: PaymentsService;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsMicroserviceController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            createPayment: jest.fn(),
            findAll: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
        {
          provide: 'NATS_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsMicroserviceController>(PaymentsMicroserviceController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
    clientProxy = module.get<ClientProxy>('NATS_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {

      jest.spyOn(paymentsService, 'createPayment').mockResolvedValue(TestData.payments[0]);

      const result = await controller.createPayment(TestData.createPaymentDto);

      expect(paymentsService.createPayment).toHaveBeenCalledWith(TestData.createPaymentDto);
      expect(clientProxy.emit).toHaveBeenCalledWith('paymentCreated', TestData.payments[0]);
      expect(result).toEqual(TestData.payments[0]);
    });

    it('should return an error if payment creation fails', async () => {

      jest.spyOn(paymentsService, 'createPayment').mockResolvedValue(null);

      const result = await controller.createPayment(TestData.createPaymentDto);

      expect(result).toEqual({ error: 'Error creating payment' });
    });
  });

  describe('getPayments', () => {
    it('should return all payments', async () => {
      jest.spyOn(paymentsService, 'findAll').mockResolvedValue(TestData.payments);

      const result = await controller.getPayments();

      expect(result).toEqual(TestData.payments);
    });
  });

  describe('getPaymentsByUserId', () => {
    it('should return payments by userId', async () => {
      jest.spyOn(paymentsService, 'findByUserId').mockResolvedValue(TestData.payments);

      const result = await controller.getPaymentsByUserId({ userId: 1 });

      expect(result).toEqual(TestData.payments);
    });
  });
});

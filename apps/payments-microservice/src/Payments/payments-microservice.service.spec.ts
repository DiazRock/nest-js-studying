import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments-microservice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../typeorm/entities/Payments';
import { User } from '../typeorm/entities/User';
import { Repository } from 'typeorm';
import { TestData } from './TestData';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentsRepository: Repository<Payment>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentsRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(TestData.payments[0].user);
      jest.spyOn(paymentsRepository, 'create').mockReturnValue(TestData.payments[0]);
      jest.spyOn(paymentsRepository, 'save').mockResolvedValue(TestData.payments[0]);

      const result = await service.createPayment(TestData.createPaymentDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: TestData.payments[0].user.id }, relations: ['payments'] });
      expect(paymentsRepository.create).toHaveBeenCalledWith({
        ...TestData.createPaymentDto,
        user: TestData.payments[0].user,
      });
      expect(result).toEqual(TestData.payments[0]);
    });

    it('should return null if the payment amount is negative', async () => {

      const result = await service.createPayment(TestData.badPaymentDto);

      expect(result).toBeNull();
    });

    it('should return null if user does not have enough balance', async () => {

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(TestData.payments[0].user);

      const result = await service.createPayment(TestData.overPaymentDto);

      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.createPayment(TestData.createPaymentDto);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      jest.spyOn(paymentsRepository, 'find').mockResolvedValue(TestData.payments);

      const result = await service.findAll();

      expect(result).toEqual(TestData.payments);
    });
  });

  describe('findByUserId', () => {
    it('should return payments by userId', async () => {
      jest.spyOn(paymentsRepository, 'find').mockResolvedValue(TestData.payments);

      const result = await service.findByUserId(1);

      expect(result).toEqual(TestData.payments);
    });
  });
});

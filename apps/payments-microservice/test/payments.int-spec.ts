import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice, Logger } from '@nestjs/common';
import { Transport, ClientProxyFactory, ClientProxy } from '@nestjs/microservices';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../src/ormconfig';
import { Repository } from 'typeorm';
import { Payment } from '../src/typeorm/entities/Payments';
import { User } from '../src/typeorm/entities/User';
import { CreatePaymentDto } from '../src/Payments/dtos/CreatePayment.dto';
import { CreateUserDto } from '../src/Payments/dtos/CreateUser.dto';
import * as waitOn from 'wait-on';
import { lastValueFrom } from 'rxjs';

describe('Payments Microservice E2E Tests', () => {
  let app: INestMicroservice;
  let client: ClientProxy;
  let eventClient: ClientProxy;
  let paymentsRepository: Repository<Payment>;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    await waitOn({
      resources: ['tcp:127.0.0.1:3307'],
      timeout: 30000, // 30 seconds
    });
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...ormconfig,
          synchronize: true,
          dropSchema: true, // Drops the schema before tests
        }),
        AppModule, // Import the main AppModule which includes all modules
      ],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.NATS,
      options: { servers: [process.env.NATS_URL] }, // Use NATS_URL from .env.test
    });

    await app.listen();

    client = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: { servers: [process.env.NATS_URL] },
    });

    eventClient = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: { servers: [process.env.NATS_URL] },
    });

    await eventClient.connect();

    paymentsRepository = moduleFixture.get<Repository<Payment>>('PaymentRepository');
    usersRepository = moduleFixture.get<Repository<User>>('UserRepository');
  });

  afterAll(async () => {
    await client.close();
    await eventClient.close();
    await app.close();
  });

  beforeEach(async () => {
    // Clean the database before each test
    await paymentsRepository.query(`DELETE FROM payments`);
    await usersRepository.query(`DELETE FROM users`);
  });

  /**
   * Helper function to create a user
   */
  const createUser = async (createUserDto: CreateUserDto): Promise<User> => {
    const user = usersRepository.create({
      ...createUserDto,
      password: 'password123', // Set a default password
      role: 'user',
      canRead: false,
      canWrite: false,
      balance: 1000, // Set a default balance
      payments: [],
    });
    return await usersRepository.save(user);
  };

  /**
   * Helper function to send createPayment event
   */
  const sendCreatePaymentEvent = async (createPaymentDto: CreatePaymentDto) => {
    return eventClient.emit('createPayment', createPaymentDto);
  };

  it('should handle paymentCreated event when a payment is created', async () => {
    // Spy on the Logger.prototype

    // Create a user to associate with the payment
    const userDto: CreateUserDto = {
      username: 'testuser',
      email: 'testuser@example.com',
      displayName: 'Test User',
    };
    const user = await createUser(userDto);

    // Define payment data
    const paymentData: CreatePaymentDto = {
      amount: 100,
      userId: user.id,
      label: 'Test Payment',
    };

    // Emit the createPayment event
    await sendCreatePaymentEvent(paymentData);

    // Wait for the event to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if payment is created in the database
    const payment = await paymentsRepository.findOne({
      where: { user: { id: user.id }, amount: paymentData.amount, label: paymentData.label },
      relations: ['user'],
    });
    expect(payment).toBeDefined();
    expect(payment.amount).toBe(paymentData.amount);
    expect(payment.label).toBe(paymentData.label);
    expect(payment.user.id).toBe(user.id);

  });

  it('should not create a payment with insufficient balance', async () => {
    // Spy on the Logger.prototype
    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    // Create a user with low balance
    const userDto: CreateUserDto = {
      username: 'lowbalanceuser',
      email: 'lowbalance@example.com',
      displayName: 'Low Balance User',
    };
    const user = await createUser(userDto);

    // Set user balance to 50
    user.balance = 50;
    await usersRepository.save(user);

    // Define payment data exceeding balance
    const paymentData: CreatePaymentDto = {
      amount: 100,
      userId: user.id,
      label: 'Overdraft Payment',
    };

    // Emit the createPayment event
    await sendCreatePaymentEvent(paymentData);

    // Wait for the event to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check that payment was not created
    const payment = await paymentsRepository.findOne({
      where: { user: { id: user.id }, amount: paymentData.amount, label: paymentData.label },
      relations: ['user'],
    });
    expect(payment).toBeNull();

    // Check that an error was logged
    expect(loggerSpy).toHaveBeenCalledWith('User does not have sufficient balance');
  });

  it('should retrieve all payments via getAllPayments message pattern', async () => {
    // Create multiple payments
    const userDto: CreateUserDto = {
      username: 'allpaymentsuser',
      email: 'allpayments@example.com',
      displayName: 'All Payments User',
    };
    const user = await createUser(userDto);

    const paymentsData: CreatePaymentDto[] = [
      { amount: 100, userId: user.id, label: 'Payment 1' },
      { amount: 200, userId: user.id, label: 'Payment 2' },
    ];

    for (const paymentData of paymentsData) {
      await sendCreatePaymentEvent(paymentData);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Send getAllPayments message
    const payments = await lastValueFrom(client.send({ cmd: 'getAllPayments' }, {}));

    const sortedPayments = payments.sort((a: { label: string; }, b: { label: any; }) => {
      return a.label.localeCompare(b.label);
    });

    expect(sortedPayments).toHaveLength(2);
    expect(sortedPayments[0].amount).toBe(100);
    expect(sortedPayments[0].label).toBe('Payment 1');
    expect(sortedPayments[1].amount).toBe(200);
    expect(sortedPayments[1].label).toBe('Payment 2');
  });

  it('should retrieve payments by userId via getUserPayments message pattern', async () => {
    // Create a user
    const userDto: CreateUserDto = {
      username: 'specificuser',
      email: 'specific@example.com',
      displayName: 'Specific User',
    };
    const user = await createUser(userDto);

    // Create payments for the user
    const paymentsData: CreatePaymentDto[] = [
      { amount: 150, userId: user.id, label: 'User Payment 1' },
      { amount: 250, userId: user.id, label: 'User Payment 2' },
    ];

    for (const paymentData of paymentsData) {
      await sendCreatePaymentEvent(paymentData);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Send getUserPayments message
    const userPayments = await lastValueFrom(client.send({ cmd: 'getUserPayments' }, { userId: user.id }))

    const sortedPayments = userPayments.sort((a: { label: string; }, b: { label: any; }) => {
      return a.label.localeCompare(b.label);
    });

    expect(sortedPayments).toHaveLength(2);
    expect(sortedPayments[0].amount).toBe(150);
    expect(sortedPayments[0].label).toBe('User Payment 1');
    expect(sortedPayments[1].amount).toBe(250);
    expect(sortedPayments[1].label).toBe('User Payment 2');
  });
});

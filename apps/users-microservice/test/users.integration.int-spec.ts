// test/users.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestMicroservice, Logger } from '@nestjs/common';
import { Transport, ClientProxyFactory, ClientProxy } from '@nestjs/microservices';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '../src/ormconfig';
import { Repository } from 'typeorm';
import { User } from '../src/typeorm/entities/User';
import { CreateUserDto } from '../src/users/dtos/CreateUser.dto';
import { UsersService } from '../src/users/users-microservice.service';
import * as jwt from 'jsonwebtoken';
import * as waitOn from 'wait-on';
import { lastValueFrom } from 'rxjs';
import { SeedService } from '../src/seeder/seeder.service';


describe('UsersMicroservice Integration Tests', () => {
  let app: INestMicroservice;
  let client: ClientProxy;
  let eventClient: ClientProxy;
  let usersRepository: Repository<User>;
  let usersService: UsersService;
  let seedService: SeedService;

  beforeAll(async () => {

    await waitOn({
        resources: ['tcp:127.0.0.1:3306'],
        timeout: 30000, // 30 seconds
      });
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...ormconfig,
          synchronize: true,
          dropSchema: true, // Drops the schema on every test run
        }),
        AppModule, // Import the main AppModule which includes all modules
      ],
    }).compile();

    app = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: { port: 8877 },
    });

    await app.listen();

    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 8877 },
    });

    eventClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 8877 },
    });

    await eventClient.connect();

    usersRepository = moduleFixture.get('UserRepository');
    usersService = moduleFixture.get<UsersService>(UsersService);
    seedService = moduleFixture.get<SeedService>(SeedService);
  });

  afterAll(async () => {
    await client.close();
    await eventClient.close();
    await app.close();
  });

  beforeEach(async () => {
    // Clean the database before each test
    await usersRepository.query(`DELETE FROM payments`);
    await usersRepository.query(`DELETE FROM users`);
    await seedService.onApplicationBootstrap(); // Seed the database with some test data
  });

  /**
   * Helper function to register a user
   */
  const registerUser = async (user: CreateUserDto) => {
    return lastValueFrom(client.send({ cmd: 'registerUser' }, user)).catch(
        err => {
            console.error(err);
            return Promise.reject(new Error('Error registering user'));
        }
    );
  };

  /**
   * Helper function to login a user
   */
  const loginUser = async (credentials: Partial<CreateUserDto>) => {
    return lastValueFrom (client.send({ cmd: 'loginUser' }, credentials));
  };

  it('should register a new user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'password123',
      email: 'testuser@example.com',
      balance: 100,
    };

    const response = await registerUser(createUserDto);

    expect(response).toHaveProperty('answer', 'User registered');
    expect(response).toHaveProperty('user');
    expect(response.user).toHaveProperty('id');
    expect(response.user.username).toBe(createUserDto.username);
    expect(response.user.role).toBe('user');
    expect(response.user.canRead).toBe(false);
    expect(response.user.canWrite).toBe(false);
  });

  it('should not register a user with an existing username', async () => {
    const createUserDto: CreateUserDto = {
      username: 'duplicateuser',
      password: 'password123',
      email: 'duplicate@example.com',
      balance: 100,
    };

    await registerUser(createUserDto);

    // Attempt to register the same user again
    await expect(registerUser(createUserDto)).rejects.toThrow();
  });

  it('should login a registered user and return a JWT token', async () => {
    const createUserDto: CreateUserDto = {
      username: 'loginuser',
      password: 'password123',
      email: 'loginuser@example.com',
      balance: 100,
    };

    await registerUser(createUserDto);

    const loginResponse = await loginUser({
      username: createUserDto.username,
      password: createUserDto.password,
    });

    expect(loginResponse).toHaveProperty('accessToken');
    expect(loginResponse).toHaveProperty('userId');
    expect(loginResponse).toHaveProperty('canRead', false);
    expect(loginResponse).toHaveProperty('canWrite', false);
    expect(loginResponse).toHaveProperty('userRole', 'user');

    // Verify JWT token
    const decoded = jwt.verify(loginResponse.accessToken, process.env.JWT_SECRET || 'secretKey') as any;
    expect(decoded).toHaveProperty('username', createUserDto.username);
    expect(decoded).toHaveProperty('password', createUserDto.password);
    expect(decoded).toHaveProperty('id', loginResponse.userId);
    expect(decoded).toHaveProperty('role', 'user');
  });

  it('should validate a valid JWT token', async () => {
    const createUserDto: CreateUserDto = {
      username: 'validateuser',
      password: 'password123',
      email: 'validateuser@example.com',
      balance: 100,
    };

    await registerUser(createUserDto);

    const loginResponse = await loginUser({
      username: createUserDto.username,
      password: createUserDto.password,
    });

    const token = loginResponse.accessToken;

    const isValidResponse = await 
        lastValueFrom (client.send({ cmd: 'isJWTValid' }, { token }));

    expect(isValidResponse).toBe(true);
  });

  it('should invalidate an invalid JWT token', async () => {
    const invalidToken = 'invalid.token.value';

    await expect(
      lastValueFrom (
        client.send(
            { cmd: 'isJWTValid' }, { token: invalidToken }
        )
    )
    .catch(() =>  Promise.reject(new Error('Error validating token'))), // This is for the expect to receive the error
    ).rejects.toThrow();
  });

  it('should retrieve a user by ID', async () => {
    const createUserDto: CreateUserDto = {
      username: 'getuser',
      password: 'password123',
      email: 'getuser@example.com',
      balance: 100,
    };

    const registerResponse = await registerUser(createUserDto);
    const userId = registerResponse.user.id;

    const response = await client.send({ cmd: 'getUserById' }, { userId }).toPromise();

    expect(response).toBeDefined();
    expect(response.id).toBe(userId);
    expect(response.username).toBe(createUserDto.username);
  });

  it('should retrieve all users', async () => {
    const users: CreateUserDto[] = [
      { username: 'user1', password: 'pass1', email: 'user1@example.com', balance: 100 },
      { username: 'user2', password: 'pass2', email: 'user2@example.com', balance: 200 },
    ];

    for (const user of users) {
      await registerUser(user);
    }

    const response = await client.send({ cmd: 'getAllUsers' }, {}).toPromise();

    expect(response).toHaveLength(3);  // We are considering here the admin user too
    expect(response[0]).toHaveProperty('id');
    expect(response[1]).toHaveProperty('id');
  });

  it('should get user permissions', async () => {
    const createUserDto: CreateUserDto = {
      username: 'adminuser',
      password: 'adminpass',
      email: 'admin@example.com',
      balance: 500,
    };

    // Create an admin user directly via the UsersService
    const adminUser = await usersService.createAdmin(createUserDto);

    const response = await client.send({ cmd: 'getUserPermissions' }, { id: adminUser.id }).toPromise();

    expect(response).toEqual({
      canRead: true,
      canWrite: true,
    });
  });

  it('should handle paymentCreated event', async () => {
    // Spy on the logger to ensure the event is handled
    const loggerSpy = jest.spyOn(Logger.prototype, 'log');

    const paymentData = {
      userId: 'some-user-id',
      amount: 100,
      currency: 'USD',
    };

    // Emit the event using eventClient
    eventClient.emit('paymentCreated', paymentData);

    // Wait briefly to allow the event to be processed
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if the logger was called with 'Payment created'
    expect(loggerSpy).toHaveBeenCalledWith('Payment created', paymentData);
  });

  it('should seed admin user on application bootstrap', async () => {
    // SeederService runs on application bootstrap. Since we've dropped the schema,
    // the admin should be created.
    const adminList = await usersService.findByUsername('admin');

    expect(adminList.length).toBe(1);
    expect(adminList[0].username).toBe('admin');
    expect(adminList[0].role).toBe('admin');
    expect(adminList[0].canRead).toBe(true);
    expect(adminList[0].canWrite).toBe(true);
    expect(adminList[0].balance).toBe(500);
  });
});

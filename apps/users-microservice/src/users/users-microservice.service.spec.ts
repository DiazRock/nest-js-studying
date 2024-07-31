import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users-microservice.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Payment } from '../typeorm/entities/Payment';



describe('UsersMicroserviceService', () => {
  let usersService: UsersService;
  const createUserDto: CreateUserDto = {
    username:'test',
    displayName:'pass',
    email:'test@',
    password: 'pass',
  };
  const expectedUser: User = {
    ...createUserDto,
    id: 'idUser',
    payments: [],
    role: "user",
    canRead: false,
    canWrite: false,
    balance: 500,
  };
  const payment: Payment = {
    id: 'paymentId',
    amount: 100,
    user: expectedUser,
    createdAt: new Date(),
    label: 'test',
  }

  beforeEach(async () => {

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: async () => expectedUser,
            save: async (user: User) => user,
            findOne: async () => expectedUser,
          }
        },
      ],
    }).compile();

    usersService = app.get<UsersService>(UsersService);
  });

  describe('usersService functionalities', () => {
    it('should create a payment ', async () => {
      expect(await usersService.createUser(createUserDto)).toBe(expectedUser);
    });
    it('should find a payment ', async () => {
        expect(await usersService.getUserById(expectedUser.id)).toBe(expectedUser);
      });
  });
});

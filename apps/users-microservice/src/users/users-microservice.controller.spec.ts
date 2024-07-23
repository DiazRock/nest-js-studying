import { Test, TestingModule } from '@nestjs/testing';
import { UsersMicroserviceController } from './users-microservice.controller';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { Payment } from '../typeorm/entities/Payment';
import { UsersService } from './users-microservice.service';



describe('UsersMicroserviceService', () => {
  let usersService: UsersService;
  let usersController: UsersMicroserviceController;
  const createUserDto: CreateUserDto = {
    username:'test',
    displayName:'pass',
    email:'test@',
    password: 'pass'
  };
  const expectedUser: User = {
    ...createUserDto,
    id: 'idUser',
    payments: [],
    password: 'pass',
    role: "user",
    canEdit: false,
    canWrite: false
  };
  const payment: Payment = {
    id: 'paymentId',
    amount: 100,
    user: expectedUser,
  }

  beforeEach(async () => {

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersMicroserviceController],
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
        {
            provide: getRepositoryToken(Payment),
            useValue: {
            }
        }
      ],
    }).compile();

    usersController = app.get<UsersMicroserviceController>(UsersMicroserviceController);
    usersService = app.get<UsersService>(UsersService);
  });

  describe('usersService functionalities', () => {
    it('should create a payment ', async () => {
      jest.spyOn(usersService, 'createUser').mockImplementation(async () => expectedUser);
      expect(await usersController.createUser(createUserDto)).toBe(expectedUser);
    });
    it('should find an user ', async () => {
        jest.spyOn(usersService, 'getUserById').mockImplementation(async () => expectedUser);
        expect(await usersController.getUserById({id: "idUser"})).toBe(expectedUser);
      });
  });
});

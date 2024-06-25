import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as rxjs from 'rxjs';
import { NatsClientModule } from '../nats-client/nats-client.module';
import { ClientProxy } from '@nestjs/microservices';


const expectedUser = {
  username:'test',
  displayName:'pass',
  email:'test@'
} as CreateUserDto;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'NATS_SERVICE',
          useValue: {
            send: () => expectedUser
          }
        }
      ]
    })
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get user by id', () => {

    it('should return an user for the specific id', async () => {
      jest.spyOn(rxjs, 'lastValueFrom').mockImplementation( async () => expectedUser);
      expect(await controller.getUserById('1')).toBe(expectedUser);
    });
    it('should return an error for the specific id', async () => {
      jest.spyOn(rxjs, 'lastValueFrom').mockImplementation( async () => null);
      try {
        await controller.getUserById('1')
      } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toBe('User Not Found');
      }
    });
  });

  describe('Create user', () => {
    it('should create an user for the specific id', async () => {
      jest.spyOn(rxjs, 'lastValueFrom').mockImplementation( async () => {
        return {
          id: "userId",
          username: expectedUser.username
        }
      });
      expect(await controller.createUser(expectedUser)).toStrictEqual({
        id: "userId",
        username: expectedUser.username
      });
    });
  });
});

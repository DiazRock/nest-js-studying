import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dtos/CreateUser.dto';
import * as rxjs from 'rxjs';
import { NatsClientModule } from '../nats-client/nats-client.module';


const expectedUser = {
  username:'test',
  displayName:'pass',
  email:'test@'
} as CreateUserDto;

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NatsClientModule],
      controllers: [UsersController],
    })
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get user by id', () => {
    jest.spyOn(rxjs, 'lastValueFrom').mockImplementation( async () => expectedUser);

    it('should return an user for the specific id', async () => {
      expect(await controller.getUserById('1')).toBe(expectedUser);
    });
  });
});

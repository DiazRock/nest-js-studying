import { Test, TestingModule } from '@nestjs/testing';
import { UsersMicroserviceController } from './users-microservice.controller';
import { UsersMicroserviceService } from './users-microservice.service';

describe('UsersMicroserviceController', () => {
  let usersMicroserviceController: UsersMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersMicroserviceController],
      providers: [UsersMicroserviceService],
    }).compile();

    usersMicroserviceController = app.get<UsersMicroserviceController>(UsersMicroserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(usersMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});

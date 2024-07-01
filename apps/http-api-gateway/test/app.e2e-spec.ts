import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import { CreateUserDto } from '../src/users/dtos/CreateUser.dto';
import { UsersModule as UserModuleMicroService } from '../../users-microservice/src/users/users-microservice.module';
import { Transport, MicroserviceOptions, ClientsModule } from '@nestjs/microservices';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User} from '../typeorm/entities/user';
import { Payment } from '../typeorm/entities/Payment';
import { PaymentsModule } from '../../payments-microservice/src/Payments/payments-microservice.module';
import { connect, NatsConnection } from 'nats'
import { config } from 'dotenv';

config();

const expectedUser: CreateUserDto = {
  username:'test',
  displayName:'pass',
  email:'test@'
};
const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222'

async function createUserSuscriberMicroService(natsUrl: string): Promise<INestMicroservice> {
  const fixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Payment],
          synchronize: true,
      }),
    ],
    providers: [
      PaymentsModule,
      UserModuleMicroService
    ]
  }).compile();
  const microSer = fixture.createNestMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: 'users_queue',
      timeout: 5000,
    }
  });

  await microSer.listen();
  return microSer;
}

async function createPublisherApp(natsUrl: string): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: 'NATS_SERVICE',
        useValue: ClientsModule.register([
              {
                name: 'NATS_SERVICE',
                transport: Transport.NATS,
                options: {
                  servers: [natsUrl],
                  queue: 'users_queue',
                  timeout: 5000,
                },
              },
            ])
            }
    ]
  })
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

describe('Integration test for controllers', () => {
  let app: INestApplication;
  let suscriberMicroService: INestMicroservice;
  let connection: NatsConnection;

  beforeAll( async () => {
    suscriberMicroService = await createUserSuscriberMicroService(NATS_URL);
    app = await createPublisherApp(NATS_URL);
    connection = await connect({servers: NATS_URL});
  }, 300000000)
  describe('Test for users controllers: POST, GET', () => {

    it(`/POST users`, async () => {
      const response = await request(app.getHttpServer())
                    .post('/users')
                    .send(expectedUser)
                    //.expect(204)
                    .then((res) => res.body);

      console.log('POST /users response:', response);
      
      expect(response.username).toStrictEqual(expectedUser.username);
      
    }, 300000000)

    it(`/GET users`, async () => {
      
      
    })
   })

   afterAll(async () => {
    await app.close();
    await suscriberMicroService.close();
    await connection.close();
  });
});

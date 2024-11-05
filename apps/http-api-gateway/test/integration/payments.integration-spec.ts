import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockClientProxy } from '../mocks/client-proxy.mock';

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;
  let clientProxy: MockClientProxy;

  beforeAll(async () => {
    clientProxy = new MockClientProxy();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('NATS_SERVICE')
      .useValue(clientProxy)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/payments (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/payments')
      .send({ userId: '1', amount: 100, label: 'test_label' })
      .set('Authorization', 'Bearer validtoken')
      .expect(HttpStatus.CREATED)
      .expect({
        paymentId: 'p1',
        amount: 100,
        label: 'test_label',
        user: {}
      });
  });

  it('/payments/:id (GET) - list payments for user', () => {
    return request(app.getHttpServer())
      .get('/payments/1')
      .set('Authorization', 'Bearer validtoken')
      .expect(HttpStatus.OK)
      .expect([
        { paymentId: 'p1', amount: 100 },
      ]);
  });

  it('/payments (GET) - list all payments', () => {
    return request(app.getHttpServer())
      .get('/payments')
      .set('Authorization', 'Bearer validtoken')
      .expect(HttpStatus.OK)
      .expect([
        { paymentId: 'p1', amount: 100 },
        { paymentId: 'p2', amount: 200 },
      ]);
  });
});

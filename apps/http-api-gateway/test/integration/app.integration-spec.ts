// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockClientProxy } from '../mocks/client-proxy.mock';

describe('AppModule (e2e)', () => {
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

  describe('UsersController', () => {
    it('POST /users - success', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ username: 'testuser', password: 'password123' })
        .set('Authorization', 'Bearer validtoken')
        .expect(HttpStatus.CREATED)
        .expect({
          id: '1',
          username: 'testuser',
        });
    });
  });

  describe('PaymentsController', () => {
    it('POST /payments - success', () => {
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

  });

  describe('AuthorizationMiddleware', () => {
    it('GET /users without auth - unauthorized', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'UNAUTHORIZED.',
        });
    });

    it('GET /users with valid auth - authorized', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer validtoken')
        .expect(HttpStatus.OK)
        .expect([
          { id: '1', username: 'testuser' },
        ]);
    });
  });
});

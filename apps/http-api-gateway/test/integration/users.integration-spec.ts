import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockClientProxy } from '../mocks/client-proxy.mock';

describe('UsersController (e2e)', () => {
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

  it('/users (POST) - success', () => {
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

  it('/users/:id (GET) - success', () => {
    return request(app.getHttpServer())
      .get('/users/1')
      .set('Authorization', 'Bearer validtoken')
      .expect(HttpStatus.OK)
      .expect({
        id: '1',
        username: 'testuser',
      });
  });

  it('/users/:id (GET) - not found', () => {
    return request(app.getHttpServer())
      .get('/users/2')
      .set('Authorization', 'Bearer validtoken')
      .expect(HttpStatus.NOT_FOUND)
      .expect({
        statusCode: 404,
        message: 'User Not Found',
      });
  });

  it('/users (GET) - list users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer validtoken')
      .expect(HttpStatus.OK)
      .expect([
        { id: '1', username: 'testuser' },
      ]);
  });
});

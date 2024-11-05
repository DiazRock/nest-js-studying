import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { MockClientProxy } from '../mocks/client-proxy.mock';

describe('AuthorizationMiddleware (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('NATS_SERVICE')
      .useValue(new MockClientProxy())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should deny access without Authorization header', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({
        statusCode: 401,
        message: 'UNAUTHORIZED.',
      });
  });

  it('should deny access with invalid Authorization header', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'InvalidToken')
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({
        statusCode: 401,
        message: 'UNAUTHORIZED.',
      });
  });

  it('should allow access with valid Authorization header', () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', 'Bearer validtoken')
      .expect(HttpStatus.OK);

  });
});

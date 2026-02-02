import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('DataController (e2e)', () => {
  let app: INestApplication;
  const apiKey = 'dev-api-key-12345';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  it('/api/data (POST) - should create data in database', () => {
    return request(app.getHttpServer())
      .post('/api/data')
      .set('x-api-key', apiKey)
      .send({
        key: 'test-key-1',
        value: { name: 'Test', age: 25 },
        storageType: 'database',
      })
      .expect(201);
  });

  it('/api/data (POST) - should create data in file', () => {
    return request(app.getHttpServer())
      .post('/api/data')
      .set('x-api-key', apiKey)
      .send({
        key: 'test-key-2',
        value: { name: 'Test File', age: 30 },
        storageType: 'file',
      })
      .expect(201);
  });

  it('/api/data/:key (GET) - should retrieve data', () => {
    return request(app.getHttpServer())
      .get('/api/data/test-key-1')
      .set('x-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        expect(res.body.key).toBe('test-key-1');
      });
  });

  it('/api/data (GET) - should list all data', () => {
    return request(app.getHttpServer())
      .get('/api/data')
      .set('x-api-key', apiKey)
      .expect(200);
  });
});

import supertest from 'supertest';
import '../setup.js';
import server from '../server.js';
import connection from '../database.js';
import {
  validBodyFactorySignup, invalidBodyFactorySignup,
} from '../Factories/factories.js';

afterAll(async () => {
    await connection.query('delete from customers');
});

describe('POST /signup', () => {
    it('return 400 for invalid data', async () => {
      const body = invalidBodyFactorySignup();
      const result = await supertest(server).post('/signup').send(body);
      const status = result.status;
      expect(status).toEqual(400);
    });
    const testBody = validBodyFactorySignup();
    it('return 200 for valid data', async () => {
      const result = await supertest(server).post('/signup').send(testBody);
      const status = result.status;
      expect(status).toEqual(200);
    });
  
    it('return 409 for email already exist', async () => {
      const result = await supertest(server).post('/signup').send(testBody);
      const status = result.status;
      expect(status).toEqual(409);
    });
  });
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import '../setup.js';
import connection from '../database.js';
import server from '../server.js';
import { validBodyFactorySignup } from '../Factories/factories.js';

const validBody = validBodyFactorySignup();
const password1 = bcrypt.hashSync(validBody.password, 10);

beforeAll(async () => {
    await connection.query('insert into customers(name, email, password, balance) values($1, $2, $3, 0)', [validBody.name, validBody.email, password1]);
});

afterAll(async () => {
    await connection.query('delete from sessions');
    await connection.query('delete from customers');
});

describe('post /signin', () => {
    test('returns 401 if there is no account email', async () => {
        const xx = 'xx';
        const result = await supertest(server).post('/signin').send({ email: xx + validBody.email, password: validBody.password });
        expect(result.status).toEqual(401);
    });
    test('returns 401 if the password is invalid', async () => {
        const result = await supertest(server).post('/signin').send({ email: validBody.email, password: 'catchau' });
        expect(result.status).toEqual(401);
      });
    
      test('returns 200 with valid status and return token', async () => {
        const result = await supertest(server).post('/signin').send({email: validBody.email, password: validBody.password});
    
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('token');
      });
});

import supertest from 'supertest';
import '../setup.js';
import bcrypt from 'bcrypt';
import connection from '../database.js';
import server from '../server.js';
import { v4 as uuid } from 'uuid';
import { validBodyFactorySignup } from '../Factories/factories.js';

const token = uuid();
beforeAll(async () =>  {
    const validBody = validBodyFactorySignup();
    const password1 = bcrypt.hashSync(validBody.password, 10)
    await connection.query('insert into customers(name, email, password, balance) values($1, $2, $3, 0)', [validBody.name, validBody.email, password1]);
    const user = await connection.query(`SELECT * FROM customers WHERE email=$1;`,[validBody.email]);
    await connection.query('insert into sessions (token, "userId") VALUES ($1, $2)', [token, user.rows[0].id]);
});
afterAll(async () => {
    await connection.query('delete from sessions');
    await connection.query('delete from transactions');
    await connection.query('delete from customers');
});
describe('POST /transaction/in', () => {
    test('retuen 401 when token is invalid', async () => {
        const body = {
            value: 2000, 
            description: 'teste',
        }
        const result = await supertest(server).post('/transactions/in').send(body).set("Authorization", `Bearer `);
        expect(result.status).toEqual(401);
    });
    test('return 201 when the transaction occurs', async () => {
        const body = {
            value: 2000, 
            description: 'teste',
        }
        const result = await supertest(server).post('/transactions/in').send(body).set("Authorization", `Bearer ${token}`)
        expect(result.status).toEqual(201);
    });
});
describe('POST /transaction/out', () => {
    test('retuen 401 when token is invalid', async () => {
        const body = {
            value: 2000, 
            description: 'teste',
        }
        const result = await supertest(server).post('/transactions/out').send(body).set("Authorization", `Bearer `);
        expect(result.status).toEqual(401);
    });
    test('return 201 when the transaction occurs', async () => {
        const body = {
            value: 2000, 
            description: 'teste',
        }
        const result = await supertest(server).post('/transactions/out').send(body).set("Authorization", `Bearer ${token}`)
        expect(result.status).toEqual(201);
    });
});
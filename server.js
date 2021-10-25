import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from './database.js';
import { val } from './validate.js';
const server = express();
server.use(cors());
server.use(express.json());

server.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const balance = 0;
    const errors = val.validate({
        username, email, password
    }).error;
    if(errors){
       return res.sendStatus(400);
    }
    try {
        const hash = bcrypt.hashSync(password, 12);
        const validEmail = await connection.query(`SELECT * FROM customers WHERE email = $1`,[email]);
        if(validEmail.rowCount !== 0){
             return res.sendStatus(409);
        }
        await connection.query(`
            INSERT INTO customers (name, email, password, balance) VALUES ($1, $2, $3, $4);   
        `, [username, email, hash, balance]);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

server.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await connection.query(`
            SELECT * FROM customers WHERE email=$1;
        `, [email]);
        const hash = bcrypt.compareSync(password, user.rows[0].password)
        if (!hash) {
            res.sendStatus(401);
        }

        const token = uuid();
        await connection.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2);`, [token, user.rows[0].id]);
        res.status(200).send({
            token,
            name: user.rows[0].name,
            balance: user.rows[0].balance
        });

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

server.get('/wallet', async (req, res) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    try {
        const user = await connection.query(`SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
         WHERE sessions.token = $1`, [token]);
        if (user.rowCount === 0) {
           return res.sendStatus(401);
        };
        const transactions = await connection.query(`SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
        JOIN transactions ON sessions."userId" = transactions."userId" WHERE sessions.token = $1`, [token]);
        transactions.rows.forEach(row => {
            delete row.id;
            delete row.userId;
            delete row.password;
            delete row.token;
        });
        const totalBalance = user.rows[0].balance
        const transactionsData ={
            transactions: [...transactions.rows],
            totalBalance
        }
        console.log(transactionsData)
        res.status(200).send(transactionsData);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

server.post('/signout', async (req, res) => {
    const token = req.body.token;
    try {
        await connection.query('DELETE FROM sessions WHERE token = $1;', [token]);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

server.post('/transactions/in', async (req, res) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const { value, description } = req.body;
    const date = new Date();
    const dayMonth = date.getDate() + "/" + (date.getMonth() + 1);
    try {
        const user = await connection.query(`SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
         WHERE sessions.token = $1;
        `, [token]);
        if (user.rowCount === 0) {
            res.sendStatus(401);
        }
        const balance = user.rows[0].balance + value;
        await connection.query(`
          INSERT INTO transactions (description, value, "userId", "operationOut", date) VALUES ($1, $2, $3, $4, $5); 
         
        `, [description, value, user.rows[0].userId, false, dayMonth.toString()]);
        await connection.query(` UPDATE customers SET balance = $1 WHERE id = $2;`, [balance, user.rows[0].userId]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

server.post('/transactions/out', async (req, res) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    const { value, description } = req.body;
    const date = new Date();
    const dayMonth = date.getDate() + "/" + (date.getMonth() + 1);
    try {
        const user = await connection.query(`SELECT * FROM sessions JOIN customers ON sessions."userId" = customers.id 
        WHERE sessions.token = $1`, [token]);
        if (user.rowCount === 0) {
            res.sendStatus(401);
        }
        const balance = user.rows[0].balance - value;
        await connection.query(`
          INSERT INTO transactions (description, value, "userId", "operationOut", date) VALUES ($1, $2, $3, $4, $5); 
        `, [description, value, user.rows[0].userId, true, dayMonth.toString()]);
        await connection.query(` UPDATE customers SET balance = $1 WHERE id = $2;`, [balance, user.rows[0].userId]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

export default server;
import express from 'express';
import cors from 'cors';
import * as signUpController from './Controller/signUp.js';
import * as signInController from './Controller/signIn.js';
import * as walletController from './Controller/wallet.js';
import * as signOutController from './Controller/signOut.js';
import * as transactionsInController from './Controller/transactionIn.js';
import * as transactionsOutController from './Controller/transactionOut.js';

const server = express();
server.use(cors());
server.use(express.json());

server.post('/signup', signUpController.signUp);

server.post('/signin', signInController.signIn);

server.get('/wallet', walletController.wallet);

server.post('/signout', signOutController.signOut);

server.post('/transactions/in', transactionsInController.transactionIn);

server.post('/transactions/out', transactionsOutController.transactionOut);

export default server;

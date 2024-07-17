import express from 'express';
import request from 'supertest';
import routes from '../src/routes';
import Wallet, { walletInstance as wallet } from '../src/wallet';

const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Slot Machine Game API', () => {
    beforeEach(() => {
        // Reset wallet balance before each test
        wallet['balance'] = 500; // Ensure the wallet starts with 500 for each test
    });

    test('POST /play', async () => {
        const response = await request(app)
            .post('/api/play')
            .send({ bet: 10 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('matrix');
        expect(response.body).toHaveProperty('winnings');
    });

    test('POST /sim', async () => {
        const response = await request(app)
            .post('/api/sim')
            .send({ count: 10, bet: 10 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('totalWinnings');
        expect(response.body).toHaveProperty('netResult');
    });

    test('GET /rtp', async () => {
        const response = await request(app).get('/api/rtp');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('rtp');
    });

    test('POST /wallet/deposit', async () => {
        const response = await request(app)
            .post('/api/wallet/deposit')
            .send({ amount: 100 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('balance');
    });

    test('POST /wallet/withdraw', async () => {
        const response = await request(app)
            .post('/api/wallet/withdraw')
            .send({ amount: 50 });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('balance');
    });

    test('GET /wallet/balance', async () => {
        const response = await request(app).get('/api/wallet/balance');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('balance');
    });
});

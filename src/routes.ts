import express, { Request, Response } from 'express';
import { calculateWinnings, generateMatrix } from './gameLogic';
import Wallet, { walletInstance as wallet } from './wallet';

const router = express.Router();
let totalBets = 0;
let totalWinnings = 0;

router.post('/play', async (req: Request, res: Response) => {
    const { bet } = req.body;
    try {
        if (!bet || bet <= 0) {
            throw new Error('Invalid bet amount');
        }
        wallet.withdraw(bet);
        totalBets += bet;

        const matrix = await generateMatrix();
        const winnings = calculateWinnings(matrix);

        console.log(`Matrix: ${matrix.join(', ')}, Winnings: ${winnings}`);
        if (winnings > 0) {
            wallet.deposit(winnings);
        }
        totalWinnings += winnings;

        res.json({ matrix, winnings });
    } catch (err) {
        console.error(`Error during /play: ${(err as Error).message}, Bet: ${bet}`);
        res.status(400).json({ error: (err as Error).message });
    }
});

router.post('/sim', async (req: Request, res: Response) => {
    const { count, bet } = req.body;
    try {
        if (!count || count <= 0 || !bet || bet <= 0) {
            throw new Error('Invalid count or bet amount');
        }
        wallet.withdraw(bet * count);
        totalBets += bet * count;

        let totalWinningsSim = 0;
        for (let i = 0; i < count; i++) {
            const matrix = await generateMatrix();
            const winnings = calculateWinnings(matrix);
            if (winnings > 0) {
                wallet.deposit(winnings);
            }
            totalWinnings += winnings;
            totalWinningsSim += winnings;
        }

        console.log(`Total Winnings Sim: ${totalWinningsSim}, Count: ${count}, Bet: ${bet}`);

        const netResult = totalWinningsSim - (bet * count);
        res.json({ totalWinnings: totalWinningsSim, netResult });
    } catch (err) {
        console.error(`Error during /sim: ${(err as Error).message}, Count: ${count}, Bet: ${bet}`);
        res.status(400).json({ error: (err as Error).message });
    }
});

router.get('/rtp', (req: Request, res: Response) => {
    const rtp = totalBets > 0 ? (totalWinnings / totalBets) * 100 : 0;
    res.json({ rtp });
});

router.post('/wallet/deposit', (req: Request, res: Response) => {
    const { amount } = req.body;
    try {
        if (!amount || amount <= 0) {
            throw new Error('Invalid deposit amount');
        }
        wallet.deposit(amount);
        res.json({ balance: wallet.getBalance() });
    } catch (err) {
        console.error(`Error during /wallet/deposit: ${(err as Error).message}, Amount: ${amount}`);
        res.status(400).json({ error: (err as Error).message });
    }
});

router.post('/wallet/withdraw', (req: Request, res: Response) => {
    const { amount } = req.body;
    try {
        if (!amount || amount <= 0) {
            throw new Error('Invalid withdraw amount');
        }
        wallet.withdraw(amount);
        res.json({ balance: wallet.getBalance() });
    } catch (err) {
        console.error(`Error during /wallet/withdraw: ${(err as Error).message}, Amount: ${amount}`);
        res.status(400).json({ error: (err as Error).message });
    }
});

router.get('/wallet/balance', (req: Request, res: Response) => {
    res.json({ balance: wallet.getBalance() });
});

export default router;

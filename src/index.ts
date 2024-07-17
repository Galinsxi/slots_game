import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { calculateWinnings, generateMatrix } from './gameLogic';
import routes from './routes';
import Wallet, { walletInstance as wallet } from './wallet';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('roll', async (bet) => {
        try {
            if (!bet || bet <= 0) {
                throw new Error('Invalid bet amount');
            }
            wallet.withdraw(bet);
            const matrix = await generateMatrix();
            const winnings = calculateWinnings(matrix);
            if (winnings > 0) {
                wallet.deposit(winnings);
            }
            socket.emit('result', {
                matrix: [matrix.slice(0, 3), matrix.slice(3, 6), matrix.slice(6, 9)],
                coins: wallet.getBalance(),
                winnings
            });
        } catch (err) {
            console.error(`Error during /play: ${(err as Error).message}, Bet: ${bet}`);
            socket.emit('error', { error: (err as Error).message });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

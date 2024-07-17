import { randomInt } from 'crypto';
import express from 'express';
import { readFileSync, watchFile } from 'fs';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static('public'));

type Symbol = 'cherry' | 'pear' | 'apple' | 'watermelon' | 'melon';
const symbols: Symbol[] = ['cherry', 'pear', 'apple', 'watermelon', 'melon'];

const reelLength = 30;
const reels: Symbol[][] = Array.from({ length: 5 }, () => 
  Array.from({ length: reelLength }, () => symbols[randomInt(symbols.length)])
);

let config = JSON.parse(readFileSync('config.json', 'utf-8'));

// Watch for changes in config.json and update the config object
watchFile('config.json', (curr, prev) => {
  config = JSON.parse(readFileSync('config.json', 'utf-8'));
  console.log('Config file updated:', config);
});

interface User {
  coins: number;
}

const users: Record<string, User> = {};

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  // Initialize user with 100 coins
  users[socket.id] = { coins: 100 };

  socket.on('roll', (bet: number) => {
    if (bet > users[socket.id].coins) {
      socket.emit('message', 'Insufficient coins to place the bet');
      return;
    }

    users[socket.id].coins -= bet;
    let matrix: Symbol[][];

    if (config.useHardcodedMatrix) {
      matrix = config.hardcodedMatrix;
    } else {
      matrix = [[], [], []];
      for (let i = 0; i < 3; i++) {
        const startPosition = randomInt(reelLength);
        for (let j = 0; j < 3; j++) {
          matrix[i][j] = reels[i][(startPosition + j) % reelLength];
        }
      }
    }

    const winnings = calculateWinnings(matrix, bet);
    users[socket.id].coins += winnings;

    console.log(`User ${socket.id} generated matrix:`, matrix);
    socket.emit('result', { matrix, coins: users[socket.id].coins, winnings });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    delete users[socket.id];
  });
});

function calculateWinnings(matrix: Symbol[][], bet: number): number {
  let winnings = 0;
  for (let row of matrix) {
    if (row[0] === row[1] && row[1] === row[2]) {
      winnings += bet * 5;
    }
  }
  return winnings;
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

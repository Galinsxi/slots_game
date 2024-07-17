const socket = io();
const symbols = ['cherry', 'pear', 'apple', 'watermelon', 'melon']; // Example symbol names
let isRolling = false;
let rollCount = 0;

document.getElementById('roll-button').addEventListener('click', () => {
  if (!isRolling) {
    startRolling();
  } else {
    stopRolling();
  }
});

function startRolling() {
  isRolling = true;
  document.getElementById('roll-button').textContent = 'Stop';

  const columns = document.querySelectorAll('.column');
  columns.forEach(column => {
    column.innerHTML = ''; // Clear previous symbols

    // Add mock images for fast rolling effect
    for (let i = 0; i < 20; i++) { // More mock images for a smoother effect
      const mockSymbolDiv = document.createElement('div');
      const mockSymbolImg = document.createElement('img');
      mockSymbolImg.src = `slots_icons/${symbols[Math.floor(Math.random() * symbols.length)]}.png`;
      mockSymbolDiv.appendChild(mockSymbolImg);
      column.appendChild(mockSymbolDiv);
    }

    // Trigger fast rolling animation
    column.childNodes.forEach((div, index) => {
      div.style.animation = `fast-roll 0.1s linear infinite`; // Increase speed of rolling
    });
  });
}

function stopRolling() {
  isRolling = false;
  document.getElementById('roll-button').textContent = 'Roll';

  // Emit 'roll' event to get the result from the server
  const bet = 10; // Example bet amount
  socket.emit('roll', bet);
  rollCount++;
}

socket.on('result', ({ matrix, coins, winnings }) => {
  console.log('Server Result:', matrix); // Log the result to debug
  console.log('Coins:', coins);
  console.log('Winnings:', winnings);
  const columns = document.querySelectorAll('.column');
  columns.forEach(column => {
    column.innerHTML = ''; // Clear previous symbols
  });

  // Ensure each column corresponds to a matrix column
  for (let colIndex = 0; colIndex < 3; colIndex++) {
    const columnDiv = columns[colIndex];

    // Add the actual result symbols
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const symbolDiv = document.createElement('div');
      const symbolImg = document.createElement('img');
      const symbolName = matrix[rowIndex][colIndex];
      if (!symbolName) {
        console.error(`Symbol at [${rowIndex}][${colIndex}] is undefined`);
        continue;
      }
      symbolImg.src = `slots_icons/${symbolName}.png`;
      symbolDiv.appendChild(symbolImg);
      columnDiv.appendChild(symbolDiv);
    }
  }

  // Update UI with coins and winnings
  document.getElementById('coins').textContent = `Coins: ${coins}`;
  document.getElementById('winnings').textContent = `Winnings: ${winnings}`;

  // Check if the user is out of coins
  if (coins === 0) {
    document.getElementById('score').textContent = `Score: ${rollCount} rolls`;
    document.getElementById('play-again-button').style.display = 'block';
    document.getElementById('roll-button').style.display = 'none';
  }
});

// Event listener for the Play Again button
document.getElementById('play-again-button').addEventListener('click', () => {
  location.reload();
});

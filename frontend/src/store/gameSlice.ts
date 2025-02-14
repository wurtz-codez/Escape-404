import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Position {
  x: number;
  y: number;
  rotation: number;
}

export interface GameState {
  playerPosition: Position;
  startPosition: Position;
  exitPosition: Position;
  lives: number;
  moves: string[];
  availableMoves: string[];
  visitedCells: boolean[][];
  blockedCells: boolean[][];
  hasWon: boolean;
  gameTime: number;
  isGameOver: boolean;
}

const initializeGame = () => {
  // Fixed start and end positions
  const start = { x: 0, y: 9 }; // Bottom left
  const exit = { x: 9, y: 0 }; // Top right
  
  // Initialize the blocked cells
  const blocked = Array(10).fill(null).map(() => Array(10).fill(false));
  
  // Add random blocked cells, avoiding start/end positions and their adjacent cells
  const protectedCells = [
    // Start position and adjacent cells
    [0, 9], [0, 8], [1, 9], [1, 8],
    // End position and adjacent cells
    [9, 0], [8, 0], [9, 1], [8, 1]
  ];

  const isValidBlockedPosition = (x: number, y: number): boolean => {
    // Check if position is protected
    if (protectedCells.some(([px, py]) => px === x && py === y)) {
      return false;
    }

    // Check adjacent cells (including diagonals)
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const newX = x + dx;
        const newY = y + dy;
        
        // Skip checking the cell itself
        if (dx === 0 && dy === 0) continue;
        
        // Check if adjacent cell is within bounds and blocked
        if (
          newX >= 0 && newX < 10 &&
          newY >= 0 && newY < 10 &&
          blocked[newY][newX]
        ) {
          return false;
        }
      }
    }

    return true;
  };

  // Add blocked cells with spacing
  let attempts = 0;
  let blockedCount = 0;
  const minBlocked = 16; // Minimum required blocked cells
  const maxBlocked = 20; // Maximum blocked cells
  const maxAttempts = 2000; // Increased max attempts to ensure minimum is reached

  while (blockedCount < maxBlocked && attempts < maxAttempts) {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    
    if (isValidBlockedPosition(x, y)) {
      blocked[y][x] = true;
      blockedCount++;
    }
    
    attempts++;

    // If we've made many attempts but haven't reached minimum, reset and try again
    if (attempts === maxAttempts && blockedCount < minBlocked) {
      attempts = 0;
      blockedCount = 0;
      // Reset the blocked array
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          blocked[i][j] = false;
        }
      }
    }
  }
  
  // If we still haven't reached minimum blocked cells, try one more time with a different strategy
  if (blockedCount < minBlocked) {
    // Try placing blocks in a more systematic way
    for (let y = 2; y < 8; y += 2) {
      for (let x = 2; x < 8; x += 2) {
        if (blockedCount < minBlocked && isValidBlockedPosition(x, y)) {
          blocked[y][x] = true;
          blockedCount++;
        }
      }
    }
  }
  
  return {
    startPosition: { ...start, rotation: 0 },
    exitPosition: { ...exit, rotation: 0 },
    playerPosition: { ...start, rotation: 0 },
    blockedCells: blocked,
    visitedCells: Array(10).fill(null).map(() => Array(10).fill(false)),
    lives: 3,
    moves: [],
    availableMoves: [],
    hasWon: false,
    gameTime: 0,
    isGameOver: false
  };
};

const initialState: GameState = initializeGame();

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    movePlayer: (state, action: PayloadAction<Position>) => {
      state.playerPosition = action.payload;
      state.visitedCells[action.payload.y][action.payload.x] = true;
      
      if (action.payload.x === state.exitPosition.x && 
          action.payload.y === state.exitPosition.y) {
        state.hasWon = true;
      }
    },
    reduceLives: (state) => {
      state.lives = Math.max(0, state.lives - 1);
      if (state.lives === 0) {
        state.isGameOver = true;
      }
    },
    addMove: (state, action: PayloadAction<string>) => {
      state.moves.push(action.payload);
    },
    updateGameTime: (state, action: PayloadAction<number>) => {
      state.gameTime = action.payload;
    },
    resetGameTime: (state) => {
      state.gameTime = 0;
    },
    setAvailableMoves: (state, action: PayloadAction<string[]>) => {
      state.availableMoves = action.payload;
    },
    undoLastMove: (state) => {
      if (state.moves.length > 0) {
        const lastMove = state.moves[state.moves.length - 1];
        state.moves.pop();
        
        const newPos = { ...state.playerPosition };
        switch (lastMove) {
          case 'question':
            newPos.y += 1;
            newPos.rotation = 0;
            break;
          case 'puzzle':
            newPos.x += 1;
            newPos.rotation = 90;
            break;
          case 'book':
            newPos.x -= 1;
            newPos.rotation = 270;
            break;
          case 'pencil':
            newPos.y -= 1;
            newPos.rotation = 180;
            break;
        }
        state.playerPosition = newPos;
        state.visitedCells[state.playerPosition.y][state.playerPosition.x] = false;
        state.hasWon = false;
      }
    },
    resetGame: () => initializeGame(),
  },
});

export const { 
  movePlayer, 
  reduceLives, 
  addMove, 
  setAvailableMoves, 
  undoLastMove,
  resetGame,
  updateGameTime,
  resetGameTime
} = gameSlice.actions;

export default gameSlice.reducer;
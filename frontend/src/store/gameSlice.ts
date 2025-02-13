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
}

const getRandomCorner = () => {
  const corners = [
    { x: 0, y: 0 },
    { x: 5, y: 0 },
    { x: 0, y: 5 },
    { x: 5, y: 5 }
  ];
  return corners[Math.floor(Math.random() * corners.length)];
};

const generateBlockedCells = (start: Position, exit: Position) => {
  const blocked = Array(6).fill(null).map(() => Array(6).fill(false));
  
  for (let i = 0; i < 8; i++) {
    let x = Math.floor(Math.random() * 6);
    let y = Math.floor(Math.random() * 6);
    
    while ((x === start.x && y === start.y) || 
           (x === exit.x && y === exit.y)) {
      x = Math.floor(Math.random() * 6);
      y = Math.floor(Math.random() * 6);
    }
    
    blocked[y][x] = true;
  }
  
  return blocked;
};

const initializeGame = () => {
  const start = getRandomCorner();
  let exit = getRandomCorner();
  
  while (exit.x === start.x && exit.y === start.y) {
    exit = getRandomCorner();
  }
  
  return {
    startPosition: { ...start, rotation: 0 },
    exitPosition: { ...exit, rotation: 0 },
    playerPosition: { ...start, rotation: 0 },
    blockedCells: generateBlockedCells(start, exit),
    visitedCells: Array(6).fill(null).map(() => Array(6).fill(false)),
    lives: 3,
    moves: [],
    availableMoves: [],
    hasWon: false
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
    },
    addMove: (state, action: PayloadAction<string>) => {
      state.moves.push(action.payload);
    },
    setAvailableMoves: (state, action: PayloadAction<string[]>) => {
      // Filter out moves that would result in backtracking
      const currentPos = state.playerPosition;
      const filteredMoves = action.payload.filter(move => {
        let newX = currentPos.x;
        let newY = currentPos.y;
        
        switch (move) {
          case 'question': // up
            newY--;
            break;
          case 'puzzle': // left
            newX--;
            break;
          case 'book': // right
            newX++;
            break;
          case 'pencil': // down
            newY++;
            break;
        }
        
        // Check if this move would lead to a previously visited cell
        return !state.visitedCells[newY]?.[newX];
      });
      
      state.availableMoves = filteredMoves;
    },
    undoLastMove: (state) => {
      if (state.moves.length > 0) {
        const lastMove = state.moves[state.moves.length - 1];
        state.moves.pop();
        
        // Update player position based on the undone move
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
  resetGame 
} = gameSlice.actions;

export default gameSlice.reducer;
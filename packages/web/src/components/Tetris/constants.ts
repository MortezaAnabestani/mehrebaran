
import { Tetromino } from './types';

export const COLS = 10;
export const ROWS = 20;

export const TETROMINOS: Record<string, Tetromino> = {
  I: {
    shape: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    color: '#22d3ee', // Cyan 400
  },
  J: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    color: '#0ea5e9', // Sky 500
  },
  L: {
    shape: [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    color: '#38bdf8', // Sky 400
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#67e8f9', // Cyan 300
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#0284c7', // Sky 600
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#7dd3fc', // Sky 300
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#075985', // Sky 800
  },
};

export const randomTetromino = (): Tetromino => {
  const keys = Object.keys(TETROMINOS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOS[key];
};

export const INITIAL_LEVEL = 1;
export const INITIAL_SCORE = 0;
export const INITIAL_LINES = 0;

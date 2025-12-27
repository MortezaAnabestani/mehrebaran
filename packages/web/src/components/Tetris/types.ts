
export type Shape = number[][];

export interface Tetromino {
  shape: Shape;
  color: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  board: string[][];
  activePiece: ActivePiece | null;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface ActivePiece {
  pos: Position;
  tetromino: Tetromino;
  collided: boolean;
}

export enum Direction {
  LEFT = -1,
  RIGHT = 1,
  DOWN = 0,
}

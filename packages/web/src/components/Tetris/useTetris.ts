import { useState, useEffect, useCallback, useRef } from "react";
import { COLS, ROWS, randomTetromino } from "./constants";
import { GameState, Position, Direction, Shape } from "./types";

const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(""));

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    activePiece: null,
    nextPiece: randomTetromino(),
    score: 0,
    level: 1,
    lines: 0,
    isGameOver: false,
    isPaused: true,
  });

  const timerRef = useRef<number | null>(null);

  const checkCollision = useCallback((pos: Position, shape: Shape, board: string[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const nextX = pos.x + x;
          const nextY = pos.y + y;
          if (nextX < 0 || nextX >= COLS || nextY >= ROWS || (nextY >= 0 && board[nextY][nextX] !== "")) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const spawnPiece = useCallback(() => {
    setGameState((prev) => {
      const piece = prev.nextPiece;
      const next = randomTetromino();
      const pos = { x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2), y: 0 };

      if (checkCollision(pos, piece.shape, prev.board)) {
        return { ...prev, isGameOver: true };
      }

      return {
        ...prev,
        activePiece: { pos, tetromino: piece, collided: false },
        nextPiece: next,
      };
    });
  }, [checkCollision]);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      activePiece: null,
      nextPiece: randomTetromino(),
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false,
    });
    // spawnPiece is handled by effect
  }, []);

  const rotate = (shape: Shape): Shape => {
    const rotated = shape[0].map((_, index) => shape.map((row) => row[index]).reverse());
    return rotated;
  };

  const move = useCallback(
    (dir: Direction) => {
      setGameState((prev) => {
        if (!prev.activePiece || prev.isPaused || prev.isGameOver) return prev;

        const { pos, tetromino } = prev.activePiece;
        const newPos = { ...pos, x: pos.x + dir };

        if (!checkCollision(newPos, tetromino.shape, prev.board)) {
          return {
            ...prev,
            activePiece: { ...prev.activePiece, pos: newPos },
          };
        }
        return prev;
      });
    },
    [checkCollision]
  );

  const handleRotate = useCallback(() => {
    setGameState((prev) => {
      if (!prev.activePiece || prev.isPaused || prev.isGameOver) return prev;
      const { pos, tetromino } = prev.activePiece;
      const newShape = rotate(tetromino.shape);

      if (!checkCollision(pos, newShape, prev.board)) {
        return {
          ...prev,
          activePiece: {
            ...prev.activePiece,
            tetromino: { ...tetromino, shape: newShape },
          },
        };
      }
      return prev;
    });
  }, [checkCollision]);

  const lockPiece = (state: GameState): GameState => {
    if (!state.activePiece) return state;

    const newBoard = state.board.map((row) => [...row]);
    const { pos, tetromino } = state.activePiece;

    tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardY = pos.y + y;
          const boardX = pos.x + x;
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            newBoard[boardY][boardX] = tetromino.color;
          }
        }
      });
    });

    let linesCleared = 0;
    const finalBoard = newBoard.reduce((acc, row) => {
      if (row.every((cell) => cell !== "")) {
        linesCleared++;
        acc.unshift(Array(COLS).fill(""));
        return acc;
      }
      acc.push(row);
      return acc;
    }, [] as string[][]);

    const newScore = state.score + linesCleared * 100 * state.level;
    const newTotalLines = state.lines + linesCleared;
    const newLevel = Math.floor(newTotalLines / 10) + 1;

    return {
      ...state,
      board: finalBoard,
      activePiece: null,
      score: newScore,
      lines: newTotalLines,
      level: newLevel,
    };
  };

  const drop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.activePiece || prev.isPaused || prev.isGameOver) return prev;

      const { pos, tetromino } = prev.activePiece;
      const newPos = { ...pos, y: pos.y + 1 };

      if (!checkCollision(newPos, tetromino.shape, prev.board)) {
        return {
          ...prev,
          activePiece: { ...prev.activePiece, pos: newPos },
        };
      } else {
        return lockPiece(prev);
      }
    });
  }, [checkCollision]);

  const hardDrop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.activePiece || prev.isPaused || prev.isGameOver) return prev;
      let currPos = { ...prev.activePiece.pos };
      while (
        !checkCollision({ ...currPos, y: currPos.y + 1 }, prev.activePiece.tetromino.shape, prev.board)
      ) {
        currPos.y += 1;
      }
      return lockPiece({
        ...prev,
        activePiece: { ...prev.activePiece, pos: currPos },
      });
    });
  }, [checkCollision]);

  useEffect(() => {
    if (!gameState.activePiece && !gameState.isGameOver && !gameState.isPaused) {
      spawnPiece();
    }
  }, [gameState.activePiece, gameState.isGameOver, gameState.isPaused, spawnPiece]);

  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Professional speed scaling: each level decreases the interval exponentially
    // 800ms base, minus 10% per level, floor at 100ms
    const delay = Math.max(100, 800 * Math.pow(0.85, gameState.level - 1));
    timerRef.current = window.setInterval(drop, delay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isPaused, gameState.isGameOver, gameState.level, drop]);

  const togglePause = () => setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));

  return {
    gameState,
    move,
    rotate: handleRotate,
    drop,
    hardDrop,
    resetGame,
    togglePause,
  };
};

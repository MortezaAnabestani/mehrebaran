import React from "react";
import { COLS, ROWS } from "./constants";
import { GameState, Position, Shape } from "./types";

interface TetrisBoardProps {
  gameState: GameState;
}

// نگاشت رنگ‌های استاندارد به پالت نئو-قاجار
const QAJAR_PALETTE: Record<string, string> = {
  cyan: "#008F8C", // Turquoise_Zangari
  blue: "#1A4D7D", // Lapis_Royal
  orange: "#CCA43B", // Gold_Tala
  yellow: "#E8D7AE", // Gold_Pale
  green: "#7C9D8E", // Emerald_Pesteh
  purple: "#A50340", // Rose_Dark
  red: "#D90452", // Rose_Primary
  // Fallback for other colors
  default: "#CCA43B",
};

const getQajarColor = (color: string | null | undefined): string => {
  if (!color) return "";
  // اگر رنگ هگز است همان را برگردان، اگر نام رنگ است از پالت بردار
  return color.startsWith("#") ? color : QAJAR_PALETTE[color] || color;
};

const TetrisBoard: React.FC<TetrisBoardProps> = ({ gameState }) => {
  const { board, activePiece } = gameState;

  const getGhostPos = (): Position | null => {
    if (!activePiece) return null;
    let ghostY = activePiece.pos.y;
    while (!checkCollision({ ...activePiece.pos, y: ghostY + 1 }, activePiece.tetromino.shape, board)) {
      ghostY++;
    }
    return { ...activePiece.pos, y: ghostY };
  };

  const checkCollision = (pos: Position, shape: Shape, board: string[][]) => {
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
  };

  const ghostPos = getGhostPos();

  const renderCell = (y: number, x: number) => {
    let rawColor = board[y][x];
    let isGhost = false;

    if (activePiece) {
      const { pos, tetromino } = activePiece;
      if (
        y >= pos.y &&
        y < pos.y + tetromino.shape.length &&
        x >= pos.x &&
        x < pos.x + tetromino.shape[0].length
      ) {
        if (tetromino.shape[y - pos.y][x - pos.x] !== 0) {
          rawColor = tetromino.color;
        }
      }
    }

    if (!rawColor && ghostPos && activePiece) {
      const { tetromino } = activePiece;
      if (
        y >= ghostPos.y &&
        y < ghostPos.y + tetromino.shape.length &&
        x >= ghostPos.x &&
        x < ghostPos.x + tetromino.shape[0].length
      ) {
        if (tetromino.shape[y - ghostPos.y][x - ghostPos.x] !== 0) {
          rawColor = tetromino.color;
          isGhost = true;
        }
      }
    }

    const color = getQajarColor(rawColor);

    return (
      <div key={`${x}-${y}`} className="w-full h-full relative p-[1px]">
        <div
          className="w-full h-full transition-all duration-150"
          style={{
            backgroundColor: color
              ? isGhost
                ? `${color}33` // 20% opacity for ghost
                : color
              : "rgba(16, 46, 74, 0.2)", // Lapis_Base transparent

            // استایل شیشه رنگی (Orosi)
            boxShadow:
              color && !isGhost
                ? `inset 0 0 4px rgba(255,255,255,0.5), 0 0 8px ${color}88`
                : "inset 0 0 2px rgba(0,0,0,0.2)",

            borderRadius: color ? "4px" : "1px",
            border: isGhost ? `1px dashed ${color}` : color ? `1px solid rgba(255,255,255,0.2)` : "none",

            backdropFilter: "blur(2px)",
          }}
        />
      </div>
    );
  };

  return (
    <div
      className="grid gap-0 border-[3px] border-[#CCA43B] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] bg-[#102E4A]/90 relative overflow-hidden rounded-t-[100px] rounded-b-lg"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        aspectRatio: "1 / 2",
        width: "100%",
        // پترن هندسی ظریف در پس‌زمینه
        backgroundImage: `radial-gradient(#CCA43B 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
        opacity: 0.95,
      }}
    >
      {/* افکت نور روی شیشه */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10" />

      {Array.from({ length: ROWS }).map((_, y) =>
        Array.from({ length: COLS }).map((_, x) => renderCell(y, x))
      )}
    </div>
  );
};

export default TetrisBoard;

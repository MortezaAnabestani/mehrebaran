"use client";

import React, { useEffect, useCallback } from "react";
import { useTetris } from "./useTetris";
import TetrisBoard from "./TetrisBoard";
import Sidebar from "./Sidebar";
import { Direction } from "./types";
import { RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ArrowUp, Zap, Power } from "lucide-react";

interface TetrisProps {
  topText?: string;
  bottomText?: string;
}

const Tetris: React.FC<TetrisProps> = ({ topText, bottomText }) => {
  const { gameState, move, rotate, drop, hardDrop, resetGame, togglePause } = useTetris();

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (gameState.isGameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          move(Direction.LEFT);
          break;
        case "ArrowRight":
          move(Direction.RIGHT);
          break;
        case "ArrowDown":
          drop();
          break;
        case "ArrowUp":
          rotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "p":
          togglePause();
          break;
        default:
          break;
      }
    },
    [gameState.isGameOver, move, drop, rotate, hardDrop, togglePause]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col translate-y-5 items-center justify-center p-4" dir="ltr">
      {/* Handheld Case Wrapper */}
      <div className="relative w-[360px] md:w-[410px] bg-slate-900 p-4 md:p-4 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_-8px_15px_rgba(255,255,255,0.05)] border-t-2 border-slate-800">
        {/* Top Decorative Elements */}
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan]" />
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          {topText ? (
            <h1 className="text-[10px] font-bold tracking-wider text-cyan-400 text-center flex-1">
              {topText}
            </h1>
          ) : (
            <h1 className="text-xs font-retro tracking-[0.2em] text-cyan-700">CORE SYSTEM 01</h1>
          )}
        </div>

        {/* Screen Bezel */}
        <div className="bg-slate-800 p-4 rounded-xl shadow-inner border-2 border-slate-950">
          <div className="flex flex-row gap-4 items-stretch">
            {/* Main LCD Area */}
            <div className="relative flex-1">
              <TetrisBoard gameState={gameState} />

              {/* Overlays */}
              {(gameState.isPaused || gameState.isGameOver) && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="bg-slate-900/90 border border-slate-700 p-4 text-center rounded-lg shadow-2xl backdrop-blur-sm">
                    {gameState.isGameOver ? (
                      <>
                        <h2 className="text-sm font-retro text-cyan-400 mb-1">TERMINATED</h2>
                        <p className="text-[10px] text-slate-500 mb-3 tracking-widest">
                          امتیاز: {gameState.score}
                        </p>
                        <button
                          onClick={resetGame}
                          className="text-[10px] font-retro text-cyan-500 hover:text-cyan-300"
                        >
                          دوباره
                        </button>
                      </>
                    ) : (
                      <p className="text-xs font-retro text-cyan-500 animate-pulse">STANDBY</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Side Display Panel (LCD Part 2) */}
            <div className="w-24 md:w-28 flex flex-col gap-4 py-1">
              <div className="flex-1 lcd-screen rounded p-2 flex flex-col justify-between border-2 border-slate-900 shadow-inner overflow-hidden">
                <Sidebar gameState={gameState} />
              </div>
            </div>
          </div>
        </div>

        {/* Brand/Model Label */}
        <div className="mt-4 mb-8 text-center">
          {bottomText ? (
            <span className="text-[9px] font-bold tracking-wide text-slate-600 px-2">{bottomText}</span>
          ) : (
            <span className="text-[10px] font-orbitron font-bold tracking-[0.4em] text-slate-700">
              NEON ATARI PRO
            </span>
          )}
        </div>

        {/* Physical Buttons Area */}
        <div className="grid grid-cols-2 gap-4">
          {/* D-PAD Left */}
          <div className="flex items-center justify-center">
            <div className="relative w-24 h-24">
              <button
                onClick={rotate}
                aria-label="Rotate piece"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-800 rounded button-retro flex items-center justify-center text-slate-600 hover:text-cyan-500 active:text-cyan-300"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={() => move(Direction.LEFT)}
                aria-label="Move left"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded button-retro flex items-center justify-center text-slate-600 hover:text-cyan-500 active:text-cyan-300"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => move(Direction.RIGHT)}
                aria-label="Move right"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded button-retro flex items-center justify-center text-slate-600 hover:text-cyan-500 active:text-cyan-300"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={drop}
                aria-label="Soft drop"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-800 rounded button-retro flex items-center justify-center text-slate-600 hover:text-cyan-500 active:text-cyan-300"
              >
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-900 rounded-sm" />
            </div>
          </div>

          {/* Action Buttons Right */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex gap-4">
              <button
                onClick={hardDrop}
                aria-label="Hard drop"
                className="w-12 h-12 bg-cyan-600 rounded-full button-retro border-2 border-cyan-800 flex items-center justify-center text-cyan-100"
              >
                <Zap size={20} />
              </button>
              <button
                onClick={rotate}
                aria-label="Rotate piece"
                className="w-12 h-12 bg-sky-700 rounded-full button-retro border-2 border-sky-900 flex items-center justify-center text-sky-100"
              >
                <RotateCcw size={20} />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <button
                  onClick={togglePause}
                  aria-label="Toggle pause"
                  className="w-8 h-3 bg-slate-800 rounded-full button-retro border border-slate-700 mb-1"
                />
                <span className="text-[6px] font-retro text-slate-600 uppercase">Start</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={resetGame}
                  aria-label="Reset game"
                  className="w-8 h-3 bg-slate-800 rounded-full button-retro border border-slate-700 mb-1"
                />
                <span className="text-[6px] font-retro text-slate-600 uppercase">Reset</span>
              </div>
            </div>
          </div>
        </div>

        {/* Speaker Grille Decorative */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-slate-950 rounded-full shadow-inner" />
          ))}
        </div>
      </div>

      {/* Footer System Message */}
      <div className="mt-8 flex items-center gap-2 text-[8px] font-retro text-slate-700 tracking-widest uppercase">
        <Power size={10} /> CPU Load Nominal // Level Speed Active
      </div>
    </div>
  );
};

export default Tetris;

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import OptimizedImage from "@/components/ui/OptimizedImage";

const Codabiat: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const letters: string[] = ["ک", "ب", "ی", "د", "ا", "ت", "01", "10", "1001", "0011", "1010", "0101"];

  const startAnimation = (): void => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * letters.length);
      const newLetter = letters[randomIndex];
      const key = `${newLetter}-${Date.now()}-${Math.random()}`;
      setWords((prev) => [...prev, key]);
      
      setTimeout(() => {
        setWords((prev) => prev.filter((w) => w !== key));
      }, 1200);
    }, 300);
  };

  const stopAnimation = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAnimation(); // cleanup on unmount
  }, []);

  return (
    <div className="flex md:justify-end justify-center px-4 py-2 relative" dir="rtl">
      <Link
        href="https://t.me/Morteza_anabestani"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center transition-all duration-500 space-x-2"
        onMouseEnter={startAnimation}
        onMouseLeave={stopAnimation}
      >
        <span className="text-[9px] text-gray-500 font-medium transition-all duration-300 flex flex-col items-end -translate-x-1.5">
          <span className="translate-y-3.5 group-hover:translate-y-0.5 duration-500 text-justify text-gray-50">
            Developed by
            <span className="font-black text-white group-hover:text-amber-200 ml-1">Codabiat</span>
          </span>
          <span className="opacity-0 translate-y-1.5 text-gray-50 group-hover:opacity-100 group-hover:translate-y-0.5 duration-500 text-justify">
            E-Lit Development Team
          </span>
        </span>

        <div className="relative w-6 h-6 overflow-visible">
          {words.map((wordKey) => {
            const word = wordKey.split("-")[0];
            return (
              <span
                key={wordKey}
                className="absolute bottom-2 left-1/2 transform text-[8px] text-amber-200 animate-rise"
              >
                {word}
              </span>
            );
          })}

          <OptimizedImage
            src="/icons/codabiat.webp"
            alt="Codabiat Logo"
            width={25}
            height={25}
            className="w-full h-full relative z-20"
            priority="down"
          />
        </div>
      </Link>

      <style jsx>{`
        @keyframes rise {
          0% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -30px) scale(0.8);
            opacity: 0;
          }
        }

        .animate-rise {
          animation: rise 1.2s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default Codabiat;

"use client";

import React, { useEffect, useRef } from "react";

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const RainEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raindrops = useRef<Raindrop[]>([]);
  const ripples = useRef<Ripple[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // تنظیم اندازه canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.25; // 25 درصد ارتفاع برای فضای بیشتر ریپل‌ها
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ایجاد قطرات اولیه
    const createRaindrops = () => {
      const count = Math.floor(canvas.width / 20); // تعداد قطرات بر اساس عرض
      raindrops.current = [];
      for (let i = 0; i < count; i++) {
        raindrops.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          speed: 3 + Math.random() * 5,
          length: 15 + Math.random() * 15,
        });
      }
    };
    createRaindrops();

    // ایجاد ریپل
    const createRipple = (x: number, y: number) => {
      ripples.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 30 + Math.random() * 20,
        alpha: 0.6,
      });
    };

    // انیمیشن
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // رسم و حرکت قطرات باران
      raindrops.current.forEach((drop, index) => {
        // رسم قطره
        ctx.strokeStyle = "rgba(173, 216, 230, 0.6)"; // آبی روشن
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        // حرکت به پایین
        drop.y += drop.speed;

        // برخورد به پایین - در 75% ارتفاع canvas برای فضای کافی ریپل
        const waterLevel = canvas.height * 0.75;
        if (drop.y >= waterLevel) {
          // ایجاد ریپل در سطح آب
          createRipple(drop.x, waterLevel);

          // ریست کردن قطره
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      // رسم و انیمیشن ریپل‌ها
      ripples.current = ripples.current.filter((ripple) => {
        // رسم ریپل
        ctx.strokeStyle = `rgba(173, 216, 230, ${ripple.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();

        // رسم ریپل دوم (کوچکتر)
        if (ripple.radius > 5) {
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // افزایش شعاع و کاهش شفافیت
        ripple.radius += 1.5;
        ripple.alpha -= 0.015;

        // حذف ریپل‌های محو شده
        return ripple.alpha > 0 && ripple.radius < ripple.maxRadius;
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full pointer-events-none"
      style={{ height: "25%" }}
    />
  );
};

export default RainEffect;

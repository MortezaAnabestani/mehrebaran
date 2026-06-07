"use client";
import { useEffect, useRef } from "react";

export default function RainGlass({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const R = (a: number, b: number) => a + Math.random() * (b - a);
    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);

    const resize = () => {
      canvas.width = canvas.parentElement!.offsetWidth;
      canvas.height = canvas.parentElement!.offsetHeight;
    };
    resize();
    const handleResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", handleResize);

    // --- لایه مه ---
    let fogCanvas: HTMLCanvasElement | null = null;
    function createFog() {
      if (canvas.width === 0 || canvas.height === 0) return;
      fogCanvas = document.createElement("canvas");
      fogCanvas.width = canvas.width;
      fogCanvas.height = canvas.height;
      const fogCtx = fogCanvas.getContext("2d")!;
      fogCtx.fillStyle = "rgba(150,210,255,0.03)";
      fogCtx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
      for (let i = 0; i < 300; i++) {
        const x = R(0, fogCanvas.width),
          y = R(0, fogCanvas.height),
          r = R(0.5, 2);
        fogCtx.beginPath();
        fogCtx.arc(x, y, r, 0, Math.PI * 2);
        fogCtx.fillStyle = `rgba(200,230,255,${R(0.02, 0.08)})`;
        fogCtx.fill();
      }
    }

    // --- Trail ---
    class Trail {
      x: number;
      y: number;
      r: number;
      points: { x: number; y: number }[];
      alpha: number;
      width: number;
      done = false;

      constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.points = [{ x, y }];
        this.alpha = 0.55;
        this.width = r * 0.9;
      }

      addPoint(x: number, y: number) {
        this.points.push({ x, y });
        if (this.points.length > 60) this.points.shift();
      }

      update(dt: number) {
        this.alpha -= dt * 0.12;
        if (this.alpha <= 0) this.done = true;
      }

      draw() {
        if (this.points.length < 2) return;
        ctx.save();
        for (let i = 1; i < this.points.length; i++) {
          const prog = i / this.points.length;
          ctx.globalAlpha = this.alpha * prog * 0.6;
          ctx.strokeStyle = "rgba(180,225,255,0.9)";
          ctx.lineWidth = this.width * (0.3 + prog * 0.7);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(this.points[i - 1].x, this.points[i - 1].y);
          ctx.lineTo(this.points[i].x, this.points[i].y);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // --- Drop ---
    type DropType = "tiny" | "normal" | "large";

    class Drop {
      x: number;
      y: number;
      r: number;
      type: DropType;
      vy = 0;
      vx = 0;
      sliding = false;
      slideDelay: number;
      elapsed = 0;
      wobbleT: number;
      wobbleSpeed: number;
      wobbleAmp: number;
      alpha: number;
      done = false;
      trail: Trail | null = null;
      mass: number;
      stickiness: number;

      constructor(x?: number, y?: number, r?: number, type: DropType = "normal") {
        this.type = type;
        this.x = x ?? R(5, canvas.width - 5);
        this.y = y ?? R(0, canvas.height * 0.5);
        this.r = r ?? (type === "tiny" ? R(0.8, 2.5) : type === "large" ? R(7, 14) : R(2.5, 7));
        this.slideDelay = type === "large" ? R(0.2, 1) : R(0.8, 4);
        this.wobbleT = R(0, Math.PI * 2);
        this.wobbleSpeed = R(0.8, 2.5);
        this.wobbleAmp = R(0.1, 0.5);
        this.alpha = type === "tiny" ? R(0.3, 0.6) : R(0.75, 0.98);
        this.mass = this.r * this.r;
        this.stickiness = type === "tiny" ? 0.98 : R(0.85, 0.95);
      }

      absorb(other: Drop) {
        this.r = Math.min(Math.sqrt(this.r * this.r + other.r * other.r), 15);
        this.mass = this.r * this.r;
        other.done = true;
        if (!this.sliding && this.r > 6) this.slideDelay = 0.1;
      }

      update(dt: number) {
        this.elapsed += dt;
        if (!this.sliding) {
          if (this.elapsed > this.slideDelay) this.sliding = true;
          else return;
        }
        this.wobbleT += this.wobbleSpeed * dt;
        this.vy += (60 + this.r * 15) * dt;
        this.vy *= this.stickiness;
        this.vx = Math.sin(this.wobbleT) * this.wobbleAmp * (1 + this.vy * 0.01);
        const px = this.x,
          py = this.y;
        this.x += this.vx;
        this.y += this.vy * dt;
        if (!this.trail) {
          this.trail = new Trail(px, py, this.r);
          trails.push(this.trail);
        } else this.trail.addPoint(this.x, this.y);
        if (this.y > canvas.height + this.r * 2) this.done = true;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        if (this.type === "tiny") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(200,235,255,0.7)";
          ctx.fill();
          ctx.restore();
          return;
        }

        const stretchY = this.sliding && this.vy > 15 ? Math.min(1.6, 1 + this.vy / 120) : 1;
        const stretchX = 1 / Math.sqrt(stretchY);

        // سایه
        ctx.shadowColor = "rgba(0,80,160,0.3)";
        ctx.shadowBlur = this.r * 1.5;
        ctx.shadowOffsetY = this.r * 0.5;

        // بدنه قطره
        const grad = ctx.createRadialGradient(
          this.x - this.r * 0.3,
          this.y - this.r * 0.4,
          this.r * 0.05,
          this.x,
          this.y,
          this.r * 1.1,
        );
        grad.addColorStop(0, "rgba(240,252,255,0.98)");
        grad.addColorStop(0.25, "rgba(200,235,255,0.9)");
        grad.addColorStop(0.6, "rgba(140,195,240,0.75)");
        grad.addColorStop(1, "rgba(80,150,220,0.35)");

        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(stretchX, stretchY);
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.restore();
        ctx.fillStyle = grad;
        ctx.fill();

        // لبه (surface tension)
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(stretchX, stretchY);
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.restore();
        ctx.strokeStyle = "rgba(180,225,255,0.4)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // برق اصلی
        const shineGrad = ctx.createRadialGradient(
          this.x - this.r * 0.3,
          this.y - this.r * 0.35,
          0,
          this.x - this.r * 0.2,
          this.y - this.r * 0.25,
          this.r * 0.55,
        );
        shineGrad.addColorStop(0, "rgba(255,255,255,0.95)");
        shineGrad.addColorStop(0.5, "rgba(255,255,255,0.4)");
        shineGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.ellipse(
          this.x - this.r * 0.28,
          this.y - this.r * 0.32,
          this.r * 0.38,
          this.r * 0.22,
          -0.4,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = shineGrad;
        ctx.fill();

        // برق ثانویه
        ctx.beginPath();
        ctx.ellipse(
          this.x + this.r * 0.2,
          this.y + this.r * 0.25,
          this.r * 0.12,
          this.r * 0.07,
          0.8,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.fill();

        ctx.restore();
      }
    }

    const drops: Drop[] = [];
    const trails: Trail[] = [];

    function init() {
      drops.length = 0;
      trails.length = 0;
      createFog();
      for (let i = 0; i < 120; i++)
        drops.push(new Drop(R(0, canvas.width), R(0, canvas.height), undefined, "tiny"));
      for (let i = 0; i < 25; i++) {
        const d = new Drop(undefined, undefined, undefined, "normal");
        d.elapsed = R(0, 3);
        drops.push(d);
      }
      for (let i = 0; i < 6; i++) {
        const d = new Drop(undefined, R(0, canvas.height * 0.3), undefined, "large");
        d.elapsed = R(0, 1.5);
        drops.push(d);
      }
    }
    init();

    function checkMerge() {
      for (let i = 0; i < drops.length; i++) {
        if (drops[i].done || drops[i].type === "tiny") continue;
        for (let j = i + 1; j < drops.length; j++) {
          if (drops[j].done || drops[j].type === "tiny") continue;
          if (dist(drops[i], drops[j]) < drops[i].r + drops[j].r - 1) {
            if (drops[i].r >= drops[j].r) drops[i].absorb(drops[j]);
            else drops[j].absorb(drops[i]);
          }
        }
      }
    }

    let spawnTimer = 0,
      mergeTimer = 0,
      last = 0;
    let animId: number;

    const loop = (ts: number) => {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (fogCanvas && fogCanvas.width > 0 && fogCanvas.height > 0) {
        ctx.globalAlpha = 0.6;
        ctx.drawImage(fogCanvas, 0, 0);
        ctx.globalAlpha = 1;
      }

      spawnTimer += dt;
      mergeTimer += dt;

      if (spawnTimer > 0.4) {
        const t: DropType = Math.random() < 0.3 ? "large" : "normal";
        drops.push(new Drop(undefined, R(0, canvas.height * 0.2), undefined, t));
        spawnTimer = 0;
      }

      if (mergeTimer > 0.2) {
        checkMerge();
        mergeTimer = 0;
      }

      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].update(dt);
        trails[i].draw();
        if (trails[i].done) trails.splice(i, 1);
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        drops[i].update(dt);
        drops[i].draw();
        if (drops[i].done) drops.splice(i, 1);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}

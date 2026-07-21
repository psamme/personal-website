"use client";

import { useEffect, useRef } from "react";

type Marble = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

type Barrier = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

const palette = ["#8fa88b", "#ac9fc6", "#c4c6c3"];

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export default function MarbleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const random = seededRandom(37);
    let marbles: Marble[] = [];
    let barriers: Barrier[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    const readBarriers = () => {
      const canvasRect = canvas.getBoundingClientRect();
      barriers = Array.from(document.querySelectorAll<HTMLElement>("[data-marble-barrier]"))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            left: rect.left - canvasRect.left - 4,
            top: rect.top - canvasRect.top - 4,
            right: rect.right - canvasRect.left + 4,
            bottom: rect.bottom - canvasRect.top + 4,
          };
        })
        .filter((barrier) => barrier.bottom > 0 && barrier.top < height);
    };

    const reset = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      readBarriers();

      const count = width < 700 ? 34 : width < 1100 ? 52 : 76;
      marbles = Array.from({ length: count }, (_, index) => ({
        x: 14 + random() * (width - 28),
        y: reduceMotion ? 14 + random() * (height - 28) : -18 - index * (8 + random() * 8),
        vx: (random() - 0.5) * 0.6,
        vy: reduceMotion ? 0 : random() * 0.4,
        radius: 2.8 + random() * 3.3,
        color: palette[Math.floor(random() * palette.length)],
      }));
    };

    const resolveBarrier = (marble: Marble, previousY: number, barrier: Barrier) => {
      const nearestX = Math.max(barrier.left, Math.min(marble.x, barrier.right));
      const nearestY = Math.max(barrier.top, Math.min(marble.y, barrier.bottom));
      const dx = marble.x - nearestX;
      const dy = marble.y - nearestY;
      const distanceSquared = dx * dx + dy * dy;

      if (distanceSquared >= marble.radius * marble.radius) return;

      if (previousY + marble.radius <= barrier.top && marble.vy >= 0) {
        marble.y = barrier.top - marble.radius;
        marble.vy *= -0.24;
        marble.vx *= 0.96;
        return;
      }

      const distance = Math.sqrt(distanceSquared);
      if (distance > 0) {
        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = marble.radius - distance;
        marble.x += nx * overlap;
        marble.y += ny * overlap;
        const velocity = marble.vx * nx + marble.vy * ny;
        if (velocity < 0) {
          marble.vx -= velocity * nx * 1.35;
          marble.vy -= velocity * ny * 1.35;
        }
        return;
      }

      const exits = [
        { distance: Math.abs(marble.x - barrier.left), x: barrier.left - marble.radius, y: marble.y },
        { distance: Math.abs(barrier.right - marble.x), x: barrier.right + marble.radius, y: marble.y },
        { distance: Math.abs(marble.y - barrier.top), x: marble.x, y: barrier.top - marble.radius },
        { distance: Math.abs(barrier.bottom - marble.y), x: marble.x, y: barrier.bottom + marble.radius },
      ].sort((a, b) => a.distance - b.distance);
      marble.x = exits[0].x;
      marble.y = exits[0].y;
      marble.vy *= -0.18;
    };

    const collideMarbles = () => {
      for (let i = 0; i < marbles.length; i += 1) {
        for (let j = i + 1; j < marbles.length; j += 1) {
          const first = marbles[i];
          const second = marbles[j];
          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const minimum = first.radius + second.radius;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared === 0 || distanceSquared >= minimum * minimum) continue;

          const distance = Math.sqrt(distanceSquared);
          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = (minimum - distance) / 2;
          first.x -= nx * overlap;
          first.y -= ny * overlap;
          second.x += nx * overlap;
          second.y += ny * overlap;

          const relativeVelocity = (second.vx - first.vx) * nx + (second.vy - first.vy) * ny;
          if (relativeVelocity < 0) {
            const impulse = relativeVelocity * 0.44;
            first.vx += impulse * nx;
            first.vy += impulse * ny;
            second.vx -= impulse * nx;
            second.vy -= impulse * ny;
          }
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const marble of marbles) {
        const shine = context.createRadialGradient(
          marble.x - marble.radius * 0.38,
          marble.y - marble.radius * 0.42,
          marble.radius * 0.08,
          marble.x,
          marble.y,
          marble.radius,
        );
        shine.addColorStop(0, "#ffffff");
        shine.addColorStop(0.22, marble.color);
        shine.addColorStop(1, "#626761");
        context.beginPath();
        context.arc(marble.x, marble.y, marble.radius, 0, Math.PI * 2);
        context.fillStyle = shine;
        context.fill();
      }
    };

    const tick = () => {
      if (!reduceMotion) {
        for (const marble of marbles) {
          const previousY = marble.y;
          marble.vy += 0.115;
          marble.vx *= 0.997;
          marble.vy = Math.min(marble.vy, 5.8);
          marble.x += marble.vx;
          marble.y += marble.vy;

          if (marble.x - marble.radius < 0) {
            marble.x = marble.radius;
            marble.vx *= -0.45;
          } else if (marble.x + marble.radius > width) {
            marble.x = width - marble.radius;
            marble.vx *= -0.45;
          }

          if (marble.y + marble.radius > height - 2) {
            marble.y = height - marble.radius - 2;
            marble.vy *= -0.18;
            marble.vx *= 0.94;
          }

          for (const barrier of barriers) resolveBarrier(marble, previousY, barrier);
        }
        collideMarbles();
      }

      draw();
      frame = window.requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(reset);
    resizeObserver.observe(canvas);
    window.addEventListener("load", readBarriers);
    reset();
    tick();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("load", readBarriers);
    };
  }, []);

  return <canvas ref={canvasRef} className="marble-field" aria-hidden="true" />;
}

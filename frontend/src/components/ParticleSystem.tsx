import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ParticleSystemProps {
  particleCount?: number;
  colors?: string[];
  speed?: number;
  size?: number;
  className?: string;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 50,
  colors = ['rgba(2, 191, 122, 0.3)', 'rgba(2, 191, 122, 0.2)', 'rgba(2, 191, 122, 0.1)'],
  speed = 0.5,
  size = 2,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<any[]>([]);
  const isActiveRef = useRef(true);

  // Optimized animation loop without throttling
  const animate = useCallback(() => {
    if (!isActiveRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isActiveRef.current = true;

    // Функция для изменения размера canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Создание частиц
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = size + Math.random() * 2;
        this.opacity = 0.1 + Math.random() * 0.3;
        this.life = 0;
        this.maxLife = 100 + Math.random() * 100;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Обновление прозрачности на основе жизни
        this.opacity = Math.max(0, (this.maxLife - this.life) / this.maxLife * 0.4);

        // Перезапуск частицы если она умерла или вышла за границы
        if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * speed;
          this.vy = (Math.random() - 0.5) * speed;
          this.life = 0;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Инициализация частиц
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    // Запуск анимации
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      isActiveRef.current = false;
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, colors, speed, size, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      style={{
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default ParticleSystem;
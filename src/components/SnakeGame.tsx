import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = 'UP';
const SPEED = 100;

interface SnakeGameProps {
  onScoreChange?: (score: number) => void;
  onHighScoreChange?: (highScore: number) => void;
}

export default function SnakeGame({ onScoreChange, onHighScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      onHighScoreChange?.(score);
    }
  }, [score, highScore, onHighScoreChange]);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Ensure food doesn't spawn on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setGameStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          if (!gameStarted || isGameOver) resetGame();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameStarted, isGameOver]);

  useEffect(() => {
    if (isGameOver || !gameStarted) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return;
      }

      // Self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return;
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameLoop = setInterval(moveSnake, SPEED);
    return () => clearInterval(gameLoop);
  }, [snake, direction, isGameOver, gameStarted, food, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#000000'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle Cyan)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food (Neon Pink)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake (Neon Cyan)
    snake.forEach((segment, index) => {
      ctx.fillStyle = '#00f3ff';
      if (index === 0) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f3ff';
      } else {
        ctx.globalAlpha = 1 - (index / snake.length) * 0.8;
      }

      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
    });
  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="relative z-10 w-[500px] h-[500px] bg-black border-4 border-neon-cyan shadow-[0_0_40px_rgba(0,243,255,0.2)] rounded-sm overflow-hidden flex flex-col transition-all duration-500">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="flex-1 bg-[rgba(0,243,255,0.02)]"
        />
        
        <AnimatePresence>
          {!gameStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <div className="text-white/30 text-[10px] font-mono mb-8 uppercase tracking-[0.2em]">
                 Awaiting Input Sequence
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="group relative px-10 py-5 bg-neon-cyan/10 border-2 border-neon-cyan rounded-sm text-neon-cyan font-black italic text-lg tracking-widest transition-all hover:bg-neon-cyan hover:text-black flex items-center gap-3"
              >
                <div className="absolute inset-0 blur-xl bg-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play size={24} fill="currentColor" />
                <span className="relative">INITIATE GAME</span>
              </motion.button>
              <p className="mt-8 text-white/30 text-[10px] font-mono tracking-[0.3em]">
                SPACE TO START / [W,A,S,D] TO MOVE
              </p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center border-2 border-neon-pink/50"
            >
              <h2 className="text-6xl font-black text-white mb-2 tracking-tighter italic neon-text-pink">SYSTEM FAILURE</h2>
              <p className="text-neon-pink font-mono mb-12 tracking-[0.5em] text-sm">TOTAL SCORE: {score.toLocaleString()}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-10 py-4 bg-white text-black rounded-sm font-black italic tracking-widest flex items-center gap-2 transition-all hover:bg-neon-cyan shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <RefreshCw size={22} className="stroke-[3]" /> REBOOT SYSTEM
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

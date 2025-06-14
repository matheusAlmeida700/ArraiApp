import { useState, useEffect, useRef, useCallback } from "react";
import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import {
  Timer,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStats } from "@/hooks/useUserData";

interface Position {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
  type: "normal" | "bonus";
}

export default function SnakeRush() {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const [gameState, setGameState] = useState<
    "ready" | "playing" | "paused" | "gameOver"
  >("ready");
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">(
    "right"
  );
  const [food, setFood] = useState<Food>({ x: 15, y: 15, type: "normal" });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [xpEarned, setXpEarned] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(150);

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;

  const resetGame = useCallback(() => {
    setGameState("ready");
    setSnake([{ x: 10, y: 10 }]);
    setDirection("right");
    setFood({ x: 15, y: 15, type: "normal" });
    setScore(0);
    setTimeLeft(60);
    setXpEarned(0);
    setGameSpeed(150);
  }, []);

  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Food;
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
        type: Math.random() < 0.2 ? "bonus" : "normal",
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      )
    );

    return newFood;
  }, []);

  const startGame = () => {
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("gameOver");
      const finalXP = Math.max(50, score * 2);
      setXpEarned(finalXP);
      updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });
    }
  }, [timeLeft, gameState, score]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (direction !== "down") setDirection("up");
          break;
        case "ArrowDown":
        case "s":
          if (direction !== "up") setDirection("down");
          break;
        case "ArrowLeft":
        case "a":
          if (direction !== "right") setDirection("left");
          break;
        case "ArrowRight":
        case "d":
          if (direction !== "left") setDirection("right");
          break;
        case " ":
          e.preventDefault();
          setGameState(gameState === "playing" ? "paused" : "playing");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      setSnake((currentSnake) => {
        const newSnake = [...currentSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "up":
            head.y -= 1;
            break;
          case "down":
            head.y += 1;
            break;
          case "left":
            head.x -= 1;
            break;
          case "right":
            head.x += 1;
            break;
        }

        if (
          head.x < 0 ||
          head.x >= CANVAS_WIDTH / GRID_SIZE ||
          head.y < 0 ||
          head.y >= CANVAS_HEIGHT / GRID_SIZE
        ) {
          setGameState("gameOver");
          const finalXP = Math.max(30, score * 2);
          setXpEarned(finalXP);
          updateStats({
            userId: user.id,
            xpToAdd: finalXP,
            coinsToAdd: finalXP,
          });
          return currentSnake;
        }

        if (
          newSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameState("gameOver");
          const finalXP = Math.max(30, score * 2);
          setXpEarned(finalXP);
          updateStats({
            userId: user.id,
            xpToAdd: finalXP,
            coinsToAdd: finalXP,
          });
          return currentSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          const points = food.type === "bonus" ? 30 : 10;
          setScore((prev) => prev + points);
          setFood(generateFood(newSnake));

          setGameSpeed((prev) => Math.max(80, prev - 2));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState, direction, food, gameSpeed, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const render = () => {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.strokeStyle = "#16213e";
      ctx.lineWidth = 1;
      for (let i = 0; i <= CANVAS_WIDTH; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i <= CANVAS_HEIGHT; i += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      snake.forEach((segment, index) => {
        if (index === 0) {
          const gradient = ctx.createRadialGradient(
            segment.x * GRID_SIZE + GRID_SIZE / 2,
            segment.y * GRID_SIZE + GRID_SIZE / 2,
            0,
            segment.x * GRID_SIZE + GRID_SIZE / 2,
            segment.y * GRID_SIZE + GRID_SIZE / 2,
            GRID_SIZE / 2
          );
          gradient.addColorStop(0, "#00ff88");
          gradient.addColorStop(1, "#00cc66");
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = `rgba(0, 255, 136, ${0.8 - index * 0.02})`;
        }

        ctx.fillRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2
        );
      });

      const foodGradient = ctx.createRadialGradient(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        0,
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2
      );

      if (food.type === "bonus") {
        foodGradient.addColorStop(0, "#ffd700");
        foodGradient.addColorStop(1, "#ff8c00");
      } else {
        foodGradient.addColorStop(0, "#ff4757");
        foodGradient.addColorStop(1, "#c44569");
      }

      ctx.fillStyle = foodGradient;
      ctx.fillRect(
        food.x * GRID_SIZE + 2,
        food.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
      );

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [snake, food]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <GameLayout
        title="Snake Rush"
        onRestart={resetGame}
        gameCompleted={gameState === "gameOver"}
        xpEarned={xpEarned}
        score={score}
      >
        <div className="max-w-4xl mx-auto text-center">
          {gameState === "ready" && (
            <div className="space-y-6 animate-slide-up">
              <div className="text-6xl mb-4">🐍</div>
              <h2 className="text-4xl font-bold text-white mb-4">Snake Rush</h2>
              <p className="text-purple-100 text-xl mb-8">
                Guie a cobra, colete comida e cresça o máximo possível!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <ArrowUp className="h-8 w-8 text-green-300 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Controles</h3>
                  <p className="text-purple-100 text-sm">
                    Use as setas ou WASD para mover
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <Timer className="h-8 w-8 text-blue-200 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Objetivo</h3>
                  <p className="text-purple-100 text-sm">
                    Colete comida e evite colidir com paredes ou seu corpo
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span className="text-white font-bold">Recompensa XP</span>
                </div>
                <div className="text-3xl font-bold text-yellow-300">
                  Até +300 XP
                </div>
              </div>

              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-xl font-bold rounded-xl transform hover:scale-105 transition-all"
              >
                <ArrowUp className="h-6 w-6 mr-2" />
                Começar Jogo
              </Button>
            </div>
          )}

          {(gameState === "playing" || gameState === "paused") && (
            <>
              <div className="flex justify-center gap-6 mb-6 flex-wrap">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="text-green-200 text-sm font-medium">
                    Pontuação
                  </div>
                  <div className="text-white text-2xl font-bold">{score}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="text-blue-200 text-sm font-medium">Tempo</div>
                  <div className="text-white text-2xl font-bold">
                    {timeLeft}s
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                  <div className="text-purple-200 text-sm font-medium">
                    Tamanho
                  </div>
                  <div className="text-white text-2xl font-bold">
                    {snake.length}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="border-2 border-white/30 rounded-xl shadow-2xl bg-gray-900"
                  />
                  {gameState === "paused" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                      <div className="text-white text-2xl font-bold">
                        PAUSADO
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto mb-6">
                <Button
                  onClick={() => setDirection("up")}
                  disabled={direction === "down"}
                  className="bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setDirection("down")}
                  disabled={direction === "up"}
                  className="bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  <ArrowDown className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setDirection("left")}
                  disabled={direction === "right"}
                  className="bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setDirection("right")}
                  disabled={direction === "left"}
                  className="bg-white/10 hover:bg-white/20 border border-white/20"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-white/70 text-sm">
                Pressione ESPAÇO para pausar • Use setas ou WASD para mover
              </p>
            </>
          )}
        </div>
      </GameLayout>
    </div>
  );
}

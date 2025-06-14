import { useState, useEffect, useRef, useCallback } from "react";
import { GameLayout } from "@/components/GameLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStats } from "@/hooks/useUserData";

interface Circle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  timeLeft: number;
  maxTime: number;
}

const colors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

export default function TapFrenzy() {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const [gameState, setGameState] = useState<"ready" | "playing" | "completed">(
    "ready"
  );
  const [circles, setCircles] = useState<Circle[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [xpEarned, setXpEarned] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();

  const resetGame = useCallback(() => {
    setGameState("ready");
    setCircles([]);
    setScore(0);
    setTimeLeft(30);
    setXpEarned(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startGame = () => {
    setGameState("playing");

    intervalRef.current = setInterval(() => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const newCircle: Circle = {
          id: Date.now() + Math.random(),
          x: Math.random() * (rect.width - 80) + 40,
          y: Math.random() * (rect.height - 80) + 40,
          size: 40 + Math.random() * 30,
          color: colors[Math.floor(Math.random() * colors.length)],
          timeLeft: 2000 + Math.random() * 1000,
          maxTime: 2000 + Math.random() * 1000,
        };

        setCircles((prev) => [...prev, newCircle]);
      }
    }, 500);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("completed");
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (gameState === "playing") {
      const updateInterval = setInterval(() => {
        setCircles((prev) =>
          prev
            .map((circle) => ({
              ...circle,
              timeLeft: circle.timeLeft - 50,
            }))
            .filter((circle) => circle.timeLeft > 0)
        );
      }, 50);

      return () => clearInterval(updateInterval);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "completed") {
      const finalXP = score;
      updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });
      setXpEarned(finalXP);
    }
  }, [gameState, score]);

  const handleCircleClick = (circleId: number, event: React.MouseEvent) => {
    event.preventDefault();

    setCircles((prev) => prev.filter((circle) => circle.id !== circleId));
    setScore((prev) => prev + 5);

    const target = event.currentTarget as HTMLElement;
    target.style.transform = "scale(1.5)";
    target.style.opacity = "0";

    setTimeout(() => {
      target.remove();
    }, 200);
  };

  return (
    <GameLayout
      title="Estoura-Botões"
      onRestart={resetGame}
      gameCompleted={gameState === "completed"}
      xpEarned={xpEarned}
      score={score}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-8 mb-6">
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Tempo</div>
            <div className="text-white text-xl font-bold">{timeLeft}s</div>
          </div>
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Pontos</div>
            <div className="text-white text-xl font-bold">{score}</div>
          </div>
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Círculos</div>
            <div className="text-white text-xl font-bold">{circles.length}</div>
          </div>
        </div>

        {gameState === "ready" && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Prepare-se!</h2>
            <p className="text-gray-300 mb-6">
              Clique nos círculos coloridos antes que desapareçam!
            </p>
            <p className="text-purple-300 text-sm mb-6">
              30 segundos • 10 pontos por círculo • Seja rápido!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Começar Jogo
            </button>
          </div>
        )}

        {gameState === "playing" && (
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 border border-purple-500/30 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden"
            style={{ minHeight: "400px" }}
          >
            {circles.map((circle) => {
              const opacity = circle.timeLeft / circle.maxTime;
              const scale = 0.5 + opacity * 0.5;

              return (
                <div
                  key={circle.id}
                  onClick={(e) => handleCircleClick(circle.id, e)}
                  className="absolute rounded-full cursor-pointer transition-all duration-150 transform hover:scale-110 animate-pulse"
                  style={{
                    left: circle.x,
                    top: circle.y,
                    width: circle.size,
                    height: circle.size,
                    backgroundColor: circle.color,
                    opacity: opacity,
                    transform: `scale(${scale})`,
                    boxShadow: `0 0 20px ${circle.color}50`,
                  }}
                />
              );
            })}

            <div className="absolute top-4 left-4 text-white text-lg font-bold">
              Tempo: {timeLeft}s
            </div>
            <div className="absolute top-4 right-4 text-white text-lg font-bold">
              Score: {score}
            </div>
          </div>
        )}

        {gameState === "completed" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Tempo Esgotado!
            </h2>
            <p className="text-gray-300 text-lg">
              Você clicou em {score / 10} círculos!
            </p>
          </div>
        )}
      </div>
    </GameLayout>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import { GameLayout } from "@/components/GameLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStats } from "@/hooks/useUserData";

interface Target {
  x: number;
  y: number;
  rotation: number;
  speed: number;
  direction: { x: number; y: number };
}

export default function TargetStrike() {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [gameState, setGameState] = useState<"ready" | "playing" | "completed">(
    "ready"
  );
  const [currentRound, setCurrentRound] = useState(1);
  const [shots, setShots] = useState(3);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [target, setTarget] = useState<Target>({
    x: 300,
    y: 300,
    rotation: 0,
    speed: 2,
    direction: { x: 1, y: 1 },
  });

  const resetGame = useCallback(() => {
    setGameState("ready");
    setCurrentRound(1);
    setShots(3);
    setScore(0);
    setXpEarned(0);
    setTarget({
      x: 300,
      y: 300,
      rotation: 0,
      speed: 2,
      direction: { x: 1, y: 1 },
    });
    console.log("Game reset");
  }, []);

  const startGame = () => {
    setGameState("playing");
    setTarget((prev) => ({ ...prev, speed: 2 }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 600;

    const animate = () => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(139, 92, 246, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(target.x, target.y);
      ctx.rotate(target.rotation);

      const rings = [
        { radius: 80, color: "#ef4444", points: 10 },
        { radius: 64, color: "#f97316", points: 25 },
        { radius: 48, color: "#eab308", points: 50 },
        { radius: 32, color: "#22c55e", points: 75 },
        { radius: 16, color: "#8b5cf6", points: 100 },
      ];

      rings.forEach((ring) => {
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.fillStyle = ring.color + "20";
        ctx.fill();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.shadowBlur = 0;
      });

      const pulseSize = 12 + Math.sin(Date.now() * 0.01) * 3;
      ctx.beginPath();
      ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const moveInterval = setInterval(() => {
      setTarget((prev) => {
        const canvas = canvasRef.current;
        if (!canvas) return prev;

        let newX = prev.x + prev.direction.x * prev.speed;
        let newY = prev.y + prev.direction.y * prev.speed;
        let newDirection = { ...prev.direction };

        if (newX <= 100 || newX >= canvas.width - 100) {
          newDirection.x = -prev.direction.x;
          newX = Math.max(100, Math.min(canvas.width - 100, newX));
        }
        if (newY <= 100 || newY >= canvas.height - 100) {
          newDirection.y = -prev.direction.y;
          newY = Math.max(100, Math.min(canvas.height - 100, newY));
        }

        return {
          ...prev,
          x: newX,
          y: newY,
          rotation: prev.rotation + 0.05,
          direction: newDirection,
        };
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [gameState]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing" || shots <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    const distance = Math.sqrt(
      Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2)
    );

    let points = 0;
    if (distance <= 16) points = 100;
    else if (distance <= 32) points = 75;
    else if (distance <= 48) points = 50;
    else if (distance <= 64) points = 25;
    else if (distance <= 80) points = 10;

    const roundMultiplier = currentRound;
    const earnedPoints = points * roundMultiplier;

    setScore((prev) => prev + earnedPoints);
    setShots((prev) => prev - 1);

    const canvas2d = canvasRef.current?.getContext("2d");
    if (canvas2d) {
      canvas2d.save();
      canvas2d.globalAlpha = 0.8;
      canvas2d.fillStyle = points > 0 ? "#22c55e" : "#ef4444";
      canvas2d.shadowColor = points > 0 ? "#22c55e" : "#ef4444";
      canvas2d.shadowBlur = 20;
      canvas2d.beginPath();
      canvas2d.arc(clickX, clickY, 20, 0, Math.PI * 2);
      canvas2d.fill();
      canvas2d.restore();

      setTimeout(() => {}, 500);
    }

    if (shots - 1 <= 0) {
      if (currentRound < 3) {
        setTimeout(() => {
          setCurrentRound((prev) => prev + 1);
          setShots(3);
          setTarget((prev) => ({
            ...prev,
            speed: prev.speed + 1,
            direction: {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
            },
          }));
          console.log(`Starting round ${currentRound + 1}`);
        }, 1000);
      } else {
        const finalXP = Math.floor(score / 10) + 50;
        setXpEarned(finalXP);
        updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });
        setGameState("completed");
      }
    }
  };

  return (
    <GameLayout
      title="Tiro no Alvo"
      onRestart={resetGame}
      gameCompleted={gameState === "completed"}
      xpEarned={xpEarned}
      score={score}
    >
      <div className="max-w-4xl mx-auto text-center">
        {gameState === "ready" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold gradient-text">Tiro no Alvo</h2>
              <p className="text-gray-300 text-lg">
                🎯 Acerte o centro do alvo em movimento para ganhar pontos
                máximos!
              </p>
              <div className="flex justify-center gap-6 text-sm flex-wrap">
                <span className="text-purple-300">🎯 Centro = 100pts</span>
                <span className="text-green-300">🟢 Verde = 75pts</span>
                <span className="text-yellow-300">🟡 Amarelo = 50pts</span>
                <span className="text-orange-300">🟠 Laranja = 25pts</span>
                <span className="text-red-300">🔴 Vermelho = 10pts</span>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-6 max-w-md mx-auto">
                <div className="text-purple-300 font-semibold mb-2">
                  🏆 Recompensa XP
                </div>
                <div className="text-2xl font-bold text-white">
                  Até +{Math.floor(1000 / 10) + 50} XP
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              🎯 Iniciar Missão
            </button>
          </div>
        )}

        {/* Game Stats */}
        {gameState === "playing" && (
          <>
            <div className="flex justify-center gap-8 mb-6">
              <div className="glass-effect rounded-lg p-4 min-w-[100px]">
                <div className="text-purple-300 text-sm font-medium">
                  Rodada
                </div>
                <div className="text-white text-2xl font-bold">
                  {currentRound}/3
                </div>
              </div>
              <div className="glass-effect rounded-lg p-4 min-w-[100px]">
                <div className="text-purple-300 text-sm font-medium">Tiros</div>
                <div className="text-white text-2xl font-bold">{shots}</div>
              </div>
              <div className="glass-effect rounded-lg p-4 min-w-[120px]">
                <div className="text-purple-300 text-sm font-medium">
                  Pontos
                </div>
                <div className="text-white text-2xl font-bold">
                  {score.toLocaleString()}
                </div>
              </div>
              <div className="glass-effect rounded-lg p-4 min-w-[120px]">
                <div className="text-purple-300 text-sm font-medium">
                  Velocidade
                </div>
                <div className="text-white text-2xl font-bold">
                  {target.speed.toFixed(1)}x
                </div>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="flex justify-center mb-6">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="border-2 border-purple-500/30 rounded-xl bg-slate-900 cursor-crosshair max-w-full shadow-2xl shadow-purple-500/20"
                style={{ maxHeight: "70vh" }}
              />
            </div>

            {/* Game Status */}
            <div className="text-center">
              <p className="text-purple-300 text-lg font-medium">
                {shots > 0
                  ? `Restam ${shots} tiro${shots > 1 ? "s" : ""}!`
                  : "Preparando próxima rodada..."}
              </p>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}

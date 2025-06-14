import { useState, useEffect, useCallback } from "react";
import { GameLayout } from "@/components/GameLayout";
import { Timer, Target, Heart } from "lucide-react";
import { useUpdateUserStats } from "@/hooks/useUserData";
import { useAuth } from "@/contexts/AuthContext";

interface Balloon {
  id: number;
  x: number;
  y: number;
  color: string;
  timeLeft: number;
  isExploding: boolean;
  maxTime: number;
}

const ExplodingBalloons = () => {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(true);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [targetColor, setTargetColor] = useState("red");
  const [round, setRound] = useState(1);

  const colors = ["red", "blue", "green", "yellow", "purple", "pink"];
  const colorStyles = {
    red: "bg-gradient-to-b from-red-400 to-red-600",
    blue: "bg-gradient-to-b from-blue-400 to-blue-600",
    green: "bg-gradient-to-b from-green-400 to-green-600",
    yellow: "bg-gradient-to-b from-yellow-400 to-yellow-600",
    purple: "bg-gradient-to-b from-purple-400 to-purple-600",
    pink: "bg-gradient-to-b from-pink-400 to-pink-600",
  };

  const createBalloon = useCallback(() => {
    const maxTime = Math.max(3000 - round * 100, 2000);
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newBalloon: Balloon = {
      id: Date.now() + Math.random(),
      x: Math.random() * 75 + 10,
      y: Math.random() * 70 + 15,
      color,
      timeLeft: maxTime,
      maxTime: maxTime,
      isExploding: false,
    };
    return newBalloon;
  }, [round]);

  const initializeGame = () => {
    setBalloons([]);
    setScore(0);
    setLives(3);
    setTimeLeft(30);
    setRound(1);
    setGameStarted(true);
    setGameCompleted(false);
    setXpEarned(0);
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && lives > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if ((timeLeft === 0 || lives === 0) && !gameCompleted) {
      setGameCompleted(true);
      const finalXP = Math.max(50, score);
      setXpEarned(finalXP);
      updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });
    }
  }, [timeLeft, gameStarted, gameCompleted, score, lives]);

  useEffect(() => {
    if (!gameStarted || gameCompleted) return;

    const spawnInterval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length < 3 + Math.floor(round / 2)) {
          return [...prev, createBalloon()];
        }
        return prev;
      });
    }, Math.max(1500 - round * 100, 800));

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameCompleted, round, createBalloon]);

  useEffect(() => {
    if (!gameStarted || gameCompleted) return;

    const updateInterval = setInterval(() => {
      setBalloons((prev) => {
        const updated = prev.map((balloon) => ({
          ...balloon,
          timeLeft: Math.max(0, balloon.timeLeft - 50),
        }));

        const exploded = updated.filter(
          (balloon) => balloon.timeLeft <= 0 && !balloon.isExploding
        );
        if (exploded.length > 0) {
          exploded.forEach((balloon) => {
            if (balloon.color === targetColor) {
              setLives((current) => Math.max(0, current - 1));
            }
          });
        }

        return updated.filter((balloon) => balloon.timeLeft > 0);
      });
    }, 50);

    return () => clearInterval(updateInterval);
  }, [gameStarted, gameCompleted, targetColor]);

  const handleBalloonClick = (balloon: Balloon) => {
    if (balloon.color === targetColor) {
      setScore((prev) => prev + 100 + round);
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));

      if ((score + 100 + round * 20) % 500 === 0) {
        setRound((prev) => prev + 1);
        setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
      }
    } else {
      setLives((prev) => Math.max(0, prev - 1));
      setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
      <GameLayout
        title="Balões Explosivos"
        onRestart={initializeGame}
        gameCompleted={gameCompleted}
        xpEarned={xpEarned}
        score={score}
      >
        <div className="max-w-6xl mx-auto space-y-6">
          {gameStarted && (
            <>
              <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-bold">{score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    <span className="text-white font-bold">{lives}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-bold">{timeLeft}s</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-200">Round:</span>
                    <span className="text-white font-bold">{round}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-orange-200 font-medium">
                    Acerte apenas:
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full ${
                      colorStyles[targetColor as keyof typeof colorStyles]
                    } border-4 border-white shadow-lg animate-pulse`}
                  ></div>
                </div>
              </div>

              <div className="relative h-96 bg-gradient-to-b from-sky-400/50 to-white/20 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                {balloons.map((balloon) => (
                  <div
                    key={balloon.id}
                    onClick={() => handleBalloonClick(balloon)}
                    className={`absolute w-16 h-20 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                      colorStyles[balloon.color as keyof typeof colorStyles]
                    } shadow-lg border-2 border-white/30`}
                    style={{
                      left: `${balloon.x}%`,
                      top: `${balloon.y}%`,
                      animation: `bounce 2s infinite ease-in-out`,
                    }}
                  >
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-600"></div>

                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/40 rounded-full"></div>

                    <div
                      className="absolute bottom-0 left-0 bg-red-500 rounded-full transition-all duration-100"
                      style={{
                        width: `${(balloon.timeLeft / balloon.maxTime) * 100}%`,
                        height: "4px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </GameLayout>
    </div>
  );
};

export default ExplodingBalloons;

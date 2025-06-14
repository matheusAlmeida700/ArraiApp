import { useState, useEffect, useCallback } from "react";
import { GameLayout } from "@/components/GameLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStats } from "@/hooks/useUserData";

type GameState = "ready" | "showing" | "input" | "completed" | "failed";

interface Light {
  id: number;
  color: string;
  active: boolean;
}

const colors = [
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#eab308",
  "#8b5cf6",
  "#f97316",
];

export default function MemoryPulse() {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const [gameState, setGameState] = useState<GameState>("ready");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [showingIndex, setShowingIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [lights, setLights] = useState<Light[]>([]);

  useEffect(() => {
    const initialLights = colors.map((color, index) => ({
      id: index,
      color,
      active: false,
    }));
    setLights(initialLights);
  }, []);

  const resetGame = useCallback(() => {
    setGameState("ready");
    setSequence([]);
    setUserInput([]);
    setShowingIndex(0);
    setCurrentLevel(1);
    setLives(3);
    setScore(0);
    setXpEarned(0);
    setLights(
      colors.map((color, index) => ({
        id: index,
        color,
        active: false,
      }))
    );
  }, []);

  const startGame = () => {
    setGameState("showing");
    generateSequence();
  };

  const generateSequence = useCallback(() => {
    const newSequence = [];
    for (let i = 0; i < currentLevel; i++) {
      newSequence.push(Math.floor(Math.random() * 6));
    }
    setSequence(newSequence);
    setShowingIndex(0);
    setUserInput([]);
  }, [currentLevel]);

  useEffect(() => {
    if (gameState === "showing" && sequence.length > 0) {
      if (showingIndex < sequence.length) {
        const lightId = sequence[showingIndex];
        setLights((prev) =>
          prev.map((light) => ({
            ...light,
            active: light.id === lightId,
          }))
        );

        const timer = setTimeout(() => {
          setLights((prev) =>
            prev.map((light) => ({
              ...light,
              active: false,
            }))
          );

          setTimeout(() => {
            setShowingIndex((prev) => prev + 1);
          }, 200);
        }, 600);

        return () => clearTimeout(timer);
      } else {
        setTimeout(() => {
          setGameState("input");
        }, 500);
      }
    }
  }, [gameState, sequence, showingIndex]);

  const handleLightClick = (lightId: number) => {
    if (gameState !== "input") return;

    const newUserInput = [...userInput, lightId];
    setUserInput(newUserInput);

    setLights((prev) =>
      prev.map((light) => ({
        ...light,
        active: light.id === lightId,
      }))
    );

    setTimeout(() => {
      setLights((prev) =>
        prev.map((light) => ({
          ...light,
          active: false,
        }))
      );
    }, 200);

    const currentIndex = newUserInput.length - 1;
    if (newUserInput[currentIndex] !== sequence[currentIndex]) {
      setLives((prev) => prev - 1);

      if (lives <= 1) {
        const finalXp = score;
        setXpEarned(finalXp);
        updateStats({
          userId: user.id,
          xpToAdd: finalXp,
          coinsToAdd: finalXp,
        });
        setGameState("failed");
      } else {
        setTimeout(() => {
          setGameState("showing");
          setShowingIndex(0);
          setUserInput([]);
        }, 1000);
      }
      return;
    }

    if (newUserInput.length === sequence.length) {
      const points = currentLevel * 10;
      setScore((prev) => prev + points);
      setCurrentLevel((prev) => prev + 1);

      if (currentLevel >= 10) {
        const finalXp = score;
        setXpEarned(finalXp);
        updateStats({
          userId: user.id,
          xpToAdd: finalXp,
          coinsToAdd: finalXp,
        });

        setGameState("completed");
      } else {
        setTimeout(() => {
          setGameState("showing");
          generateSequence();
        }, 1000);
      }
    }
  };

  return (
    <GameLayout
      title="Sequência Explosiva"
      onRestart={resetGame}
      gameCompleted={gameState === "completed" || gameState === "failed"}
      xpEarned={xpEarned}
      score={score}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-8 mb-6">
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Nível</div>
            <div className="text-white text-xl font-bold">{currentLevel}</div>
          </div>
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Vidas</div>
            <div className="text-white text-xl font-bold">
              {"❤️".repeat(lives)}
              {"🤍".repeat(3 - lives)}
            </div>
          </div>
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Pontos</div>
            <div className="text-white text-xl font-bold">{score}</div>
          </div>
        </div>

        {gameState === "ready" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text mb-6">
              Sequência de Luzes
            </h2>
            <p className="text-gray-300 mb-6">
              Memorize e repita a sequência de luzes!
            </p>
            <p className="text-purple-300 text-sm mb-8">
              • Observe a sequência
              <br />
              • Clique nas luzes na ordem correta
              <br />
              • A cada nível, a sequência fica maior
              <br />• 3 vidas para completar 10 níveis
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Começar Jogo
            </button>
          </div>
        )}

        {(gameState === "showing" || gameState === "input") && (
          <div className="text-center">
            <div className="mb-8">
              {gameState === "showing" && (
                <div className="text-2xl font-bold text-yellow-400">
                  Memorize a sequência...
                </div>
              )}
              {gameState === "input" && (
                <div className="text-2xl font-bold text-green-400">
                  Repita a sequência!
                </div>
              )}
              <div className="text-lg text-gray-400 mt-2">
                Nível {currentLevel} - {sequence.length} luzes
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              {lights.map((light, index) => (
                <div
                  key={light.id}
                  onClick={() => handleLightClick(light.id)}
                  className={`
                    w-24 h-24 rounded-full cursor-pointer transition-all duration-200 transform
                    ${
                      gameState === "input"
                        ? "hover:scale-110"
                        : "cursor-default"
                    }
                    ${
                      light.active
                        ? "scale-125 animate-pulse"
                        : "hover:scale-105"
                    }
                  `}
                  style={{
                    backgroundColor: light.active
                      ? light.color
                      : light.color + "40",
                    boxShadow: light.active
                      ? `0 0 30px ${light.color}`
                      : `0 0 10px ${light.color}20`,
                    border: `2px solid ${light.color}80`,
                  }}
                />
              ))}
            </div>

            {gameState === "input" && (
              <div className="mt-8">
                <div className="text-sm text-gray-400 mb-2">
                  Progresso: {userInput.length}/{sequence.length}
                </div>
                <div className="w-64 mx-auto bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(userInput.length / sequence.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {gameState === "failed" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-400 mb-4">
              Sequência Perdida!
            </h2>
            <p className="text-gray-300 text-lg mb-4">
              Você chegou ao nível {currentLevel}
            </p>
            <p className="text-purple-300">Pontuação final: {score} pontos</p>
          </div>
        )}
      </div>
    </GameLayout>
  );
}

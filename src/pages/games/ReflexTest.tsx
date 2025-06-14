import { useState, useEffect, useCallback } from "react";
import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Zap, Target, TrendingUp } from "lucide-react";
import { useUpdateUserStats } from "@/hooks/useUserData";
import { useAuth } from "@/contexts/AuthContext";

const ReflexTest = () => {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const [gameState, setGameState] = useState<
    "waiting" | "ready" | "click" | "result" | "finished"
  >("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [allTimes, setAllTimes] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);

  const maxAttempts = 5;

  const getAverageTime = () => {
    if (allTimes.length === 0) return 0;
    return Math.round(
      allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length
    );
  };

  const getBestTime = () => {
    if (allTimes.length === 0) return 0;
    return Math.min(...allTimes);
  };

  const initializeGame = () => {
    setGameState("waiting");
    setReactionTime(null);
    setAllTimes([]);
    setAttempts(0);
    setStartTime(null);
    setGameStarted(true);
    setGameCompleted(false);
    setXpEarned(0);
    setTooEarly(false);
    if (timeoutId) clearTimeout(timeoutId);
    startNewAttempt();
  };

  const startNewAttempt = useCallback(() => {
    setGameState("ready");
    setReactionTime(null);
    setTooEarly(false);

    const delay = Math.random() * 4000 + 1000;
    const id = setTimeout(() => {
      setGameState("click");
      setStartTime(Date.now());
    }, delay);

    setTimeoutId(id);
  }, []);

  const handleClick = () => {
    if (gameState === "ready") {
      setTooEarly(true);
      setGameState("result");
      if (timeoutId) clearTimeout(timeoutId);

      setTimeout(() => {
        if (attempts + 1 >= maxAttempts) {
          finishGame();
        } else {
          setAttempts((prev) => prev + 1);
          startNewAttempt();
        }
      }, 2000);
    } else if (gameState === "click" && startTime) {
      const endTime = Date.now();
      const reaction = endTime - startTime;
      setReactionTime(reaction);
      setAllTimes((prev) => [...prev, reaction]);
      setGameState("result");

      setTimeout(() => {
        if (attempts + 1 >= maxAttempts) {
          finishGame();
        } else {
          setAttempts((prev) => prev + 1);
          startNewAttempt();
        }
      }, 2000);
    }
  };

  const finishGame = () => {
    setGameCompleted(true);
    const avgTime = getAverageTime();
    const bestTime = getBestTime();

    let finalXP = 10;
    if (avgTime < 300) finalXP += 50;
    else if (avgTime < 400) finalXP += 25;
    else if (avgTime < 500) finalXP += 10;

    if (bestTime < 250) finalXP += 25;

    updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });

    setXpEarned(finalXP);
  };

  const getStateMessage = () => {
    switch (gameState) {
      case "ready":
        return "Aguarde o sinal...";
      case "click":
        return "CLIQUE AGORA!";
      case "result":
        if (tooEarly) return "Muito cedo!";
        return `${reactionTime}ms`;
      default:
        return "Prepare-se...";
    }
  };

  const getStateColor = () => {
    switch (gameState) {
      case "ready":
        return "from-red-600 to-red-800";
      case "click":
        return "from-green-500 to-green-700 animate-pulse";
      case "result":
        if (tooEarly) return "from-red-600 to-red-800";
        return "from-blue-600 to-blue-800";
      default:
        return "from-purple-600 to-purple-800";
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <GameLayout
      title="Teste de Reflexo"
      onRestart={initializeGame}
      gameCompleted={gameCompleted}
      xpEarned={xpEarned}
      score={allTimes.length > 0 ? getBestTime() : 0}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Stats */}
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-bold">
                {attempts + 1}/{maxAttempts}
              </span>
            </div>
            {allTimes.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-green-400" />
                  <span className="text-white font-bold">
                    {getBestTime()}ms
                  </span>
                  <span className="text-gray-400 text-sm">melhor</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-bold">
                    {getAverageTime()}ms
                  </span>
                  <span className="text-gray-400 text-sm">média</span>
                </div>
              </>
            )}
          </div>

          {!gameStarted && (
            <Button
              onClick={initializeGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-bold rounded-xl"
            >
              <Zap className="h-5 w-5 mr-2" />
              Iniciar Teste
            </Button>
          )}
        </div>

        {/* Game Area */}
        {gameStarted && !gameCompleted && (
          <div className="flex flex-col items-center space-y-8">
            <div
              onClick={handleClick}
              className={`w-80 h-80 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${getStateColor()} flex items-center justify-center shadow-2xl border-4 border-white/20 select-none`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {getStateMessage()}
                </div>
                {gameState === "ready" && (
                  <div className="text-sm text-white/70">Não clique ainda!</div>
                )}
                {gameState === "click" && (
                  <div className="text-lg text-white/90 animate-bounce">
                    O mais rápido possível!
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progresso</span>
                <span>
                  {attempts}/{maxAttempts}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(attempts / maxAttempts) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Results History */}
        {allTimes.length > 0 && !gameCompleted && (
          <div className="bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
            <h3 className="text-lg font-bold text-white mb-4">
              Tentativas Anteriores
            </h3>
            <div className="flex flex-wrap gap-3">
              {allTimes.map((time, index) => (
                <Badge
                  key={index}
                  className={`${
                    time < 300
                      ? "bg-green-600"
                      : time < 400
                      ? "bg-yellow-600"
                      : time < 500
                      ? "bg-orange-600"
                      : "bg-red-600"
                  } text-white px-3 py-1`}
                >
                  #{index + 1}: {time}ms
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!gameStarted && (
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold gradient-text">Como Jogar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-purple-300 font-semibold mb-2">
                  🎯 Objetivo
                </div>
                <p className="text-gray-300 text-sm">
                  Clique o mais rápido possível quando ver "CLIQUE AGORA!"
                </p>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-purple-300 font-semibold mb-2">
                  ⚠️ Atenção
                </div>
                <p className="text-gray-300 text-sm">
                  Não clique antes do sinal - aguarde!
                </p>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-purple-300 font-semibold mb-2">
                  🔥 Velocidade
                </div>
                <p className="text-gray-300 text-sm">
                  Menos de 300ms = Excelente!
                </p>
              </div>
              <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20">
                <div className="text-purple-300 font-semibold mb-2">
                  🏆 Pontuação
                </div>
                <p className="text-gray-300 text-sm">
                  XP baseado na sua velocidade média
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default ReflexTest;

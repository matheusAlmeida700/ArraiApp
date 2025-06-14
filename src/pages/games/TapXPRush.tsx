import { useState, useEffect, useCallback, useRef } from "react";
import { GameLayout } from "@/components/GameLayout";
import { PreGameInstructions } from "@/components/PreGameInstructions";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStats } from "@/hooks/useUserData";

export default function TapXPRush() {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const [gameState, setGameState] = useState<"ready" | "playing" | "completed">(
    "ready"
  );
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [combo, setCombo] = useState(1);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [effects, setEffects] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const comboTimerRef = useRef<NodeJS.Timeout>();

  const resetGame = useCallback(() => {
    setGameState("ready");
    setTaps(0);
    setTimeLeft(10);
    setCombo(1);
    setLastTapTime(0);
    setXpEarned(0);
    setEffects([]);
    if (timerRef.current) clearInterval(timerRef.current);
    if (comboTimerRef.current) clearInterval(comboTimerRef.current);
  }, []);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(10);
    setLastTapTime(Date.now());

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("completed");

          if (timerRef.current) clearInterval(timerRef.current);
          if (comboTimerRef.current) clearInterval(comboTimerRef.current);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    comboTimerRef.current = setInterval(() => {
      const now = Date.now();
      setLastTapTime((prevLastTap) => {
        if (now - prevLastTap > 1000) {
          setCombo(1);
        }
        return prevLastTap;
      });
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (comboTimerRef.current) clearInterval(comboTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (gameState === "completed") {
      const finalXP = Math.floor(taps + combo);
      setXpEarned(finalXP);

      updateStats({
        userId: user.id,
        xpToAdd: finalXP,
        coinsToAdd: finalXP,
      });
    }
  }, [gameState]);

  const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== "playing") return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime;

    if (timeSinceLastTap < 200) {
      setCombo((prev) => Math.min(prev + 0.5, 10));
    } else if (timeSinceLastTap < 500) {
      setCombo((prev) => Math.min(prev + 0.2, 10));
    }

    setTaps((prev) => prev + 1);
    setLastTapTime(now);

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newEffect = {
      id: now + Math.random(),
      x,
      y,
    };

    setEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id));
    }, 1000);
  };

  const instructions = [
    {
      icon: "👆",
      title: "Toque Rápido",
      description:
        "Clique o mais rápido possível na área circular durante 10 segundos",
    },
    {
      icon: "🔥",
      title: "Combo System",
      description:
        "Toques consecutivos rápidos aumentam o multiplicador de combo",
    },
    {
      icon: "⚡",
      title: "Velocidade",
      description: "Seja consistente para manter o combo e maximizar o XP",
    },
    {
      icon: "🏆",
      title: "Objetivo",
      description: "Acumule o máximo de toques possível em 10 segundos",
    },
  ];

  return (
    <GameLayout
      title="Tap XP Rush"
      onRestart={resetGame}
      gameCompleted={gameState === "completed"}
      xpEarned={xpEarned}
      score={taps}
    >
      <div className="max-w-4xl mx-auto">
        {gameState === "ready" && (
          <PreGameInstructions
            gameTitle="Tap XP Rush"
            gameDescription="Clique o máximo possível em 10 segundos! Toques rápidos aumentam o combo e multiplicam seu XP final."
            gameEmoji="🚀"
            instructions={instructions}
            maxXP={1000}
            onStartGame={startGame}
            buttonText="Iniciar Rush"
          />
        )}

        {gameState === "playing" && (
          <>
            <div className="flex justify-center gap-8 mb-6">
              <div className="glass-effect rounded-lg p-3">
                <div className="text-purple-300 text-sm">Tempo</div>
                <div className="text-white text-xl font-bold">{timeLeft}s</div>
              </div>
              <div className="glass-effect rounded-lg p-3">
                <div className="text-purple-300 text-sm">Toques</div>
                <div className="text-white text-xl font-bold">{taps}</div>
              </div>
              <div className="glass-effect rounded-lg p-3">
                <div className="text-purple-300 text-sm">Combo</div>
                <div className="text-white text-xl font-bold">
                  {combo.toFixed(1)}x
                </div>
              </div>
              <div className="glass-effect rounded-lg p-3">
                <div className="text-purple-300 text-sm">XP Total</div>
                <div className="text-white text-xl font-bold">
                  {Math.floor(taps * combo)}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl font-bold text-purple-300 mb-2">
                  {timeLeft}
                </div>
                <div className="text-lg text-gray-400">segundos restantes</div>
              </div>

              <div
                onClick={handleTap}
                className="relative mx-auto w-80 h-80 rounded-full cursor-pointer select-none overflow-hidden"
                style={{
                  background: `radial-gradient(circle, 
                    ${
                      combo > 5 ? "#ec4899" : combo > 3 ? "#8b5cf6" : "#6366f1"
                    } 0%, 
                    ${
                      combo > 5 ? "#7c3aed" : combo > 3 ? "#6366f1" : "#4f46e5"
                    } 100%)`,
                  boxShadow: `0 0 ${20 + combo * 5}px ${
                    combo > 5 ? "#ec4899" : combo > 3 ? "#8b5cf6" : "#6366f1"
                  }`,
                  transform: `scale(${0.9 + Math.min(combo * 0.02, 0.2)})`,
                  transition: "all 0.1s ease",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-4xl font-bold">
                    {combo >= 8
                      ? "🔥"
                      : combo >= 5
                      ? "⚡"
                      : combo >= 3
                      ? "✨"
                      : "👆"}
                  </div>
                </div>

                {effects.map((effect) => (
                  <div
                    key={effect.id}
                    className="absolute pointer-events-none animate-ping"
                    style={{
                      left: effect.x - 10,
                      top: effect.y - 10,
                      width: 20,
                      height: 20,
                      background: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "50%",
                    }}
                  />
                ))}

                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: `radial-gradient(circle, transparent 60%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-2xl font-bold text-white">
                  {taps} toques
                </div>
                <div className="text-lg text-purple-300">
                  Combo: {combo.toFixed(1)}x
                </div>
                {combo > 5 && (
                  <div className="text-yellow-400 font-bold animate-bounce">
                    🔥 COMBO INCRÍVEL!
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </GameLayout>
  );
}

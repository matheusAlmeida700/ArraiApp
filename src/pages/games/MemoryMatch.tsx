import { useState, useEffect } from "react";
import { GameLayout } from "@/components/GameLayout";
import { PreGameInstructions } from "@/components/PreGameInstructions";
import { Timer, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStats } from "@/hooks/useUserData";

interface Card {
  id: number;
  imageId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatch = () => {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const gameImages = [0, 1, 2, 3, 4, 5, 6, 7];

  const memoryImages = [
    "/images/memory/0.png",
    "/images/memory/1.png",
    "/images/memory/2.png",
    "/images/memory/3.png",
    "/images/memory/4.png",
    "/images/memory/5.png",
    "/images/memory/6.png",
    "/images/memory/7.png",
  ];

  const initializeGame = () => {
    const gameCards = [...gameImages, ...gameImages]
      .map((imageId, index) => ({
        id: index,
        imageId,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(gameCards);
    setSelectedCards([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(60);
    setGameStarted(true);
    setGameCompleted(false);
    setXpEarned(0);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      setGameCompleted(true);
      const finalXP = Math.max(0, score * 5 - moves);
      setXpEarned(finalXP);
      updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });
    }
  }, [timeLeft, gameStarted, gameCompleted, score, moves]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setGameCompleted(true);
      const timeBonus = timeLeft * 10;
      const finalXP = score + timeBonus - moves * 2;
      setXpEarned(Math.max(100, finalXP));
      updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });
    }
  }, [cards, timeLeft, score, moves]);

  useEffect(() => {
    if (selectedCards.length === 2 && !isProcessing) {
      setIsProcessing(true);
      const [first, second] = selectedCards;
      const firstCard = cards.find((card) => card.id === first);
      const secondCard = cards.find((card) => card.id === second);

      setMoves((prev) => prev + 1);

      if (firstCard && secondCard && firstCard.imageId === secondCard.imageId) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setScore((prev) => prev + 10);
          setSelectedCards([]);
          setIsProcessing(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setSelectedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  }, [selectedCards, cards, isProcessing]);

  const handleCardClick = (cardId: number) => {
    if (isProcessing || selectedCards.length === 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );
    setSelectedCards((prev) => [...prev, cardId]);
  };

  const instructions = [
    {
      icon: "🧠",
      title: "Objetivo",
      description:
        "Encontre todos os pares de imagens idênticas virando as cartas",
    },
    {
      icon: "⏰",
      title: "Tempo Limite",
      description: "Você tem 60 segundos para completar o desafio",
    },
    {
      icon: "🎯",
      title: "Estratégia",
      description:
        "Memorize as posições das cartas para fazer pares rapidamente",
    },
    {
      icon: "⚡",
      title: "Bônus",
      description: "Menos jogadas e tempo restante aumentam seu XP final",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600">
      <GameLayout
        title="Jogo da Memória"
        onRestart={initializeGame}
        gameCompleted={gameCompleted}
        xpEarned={xpEarned}
        score={score}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {!gameStarted && (
            <PreGameInstructions
              gameTitle="Jogo da Memória"
              gameDescription="Encontre todos os pares de imagens idênticas antes do tempo acabar! Memorize as posições e seja estratégico."
              gameEmoji="🧠"
              instructions={instructions}
              maxXP={800}
              onStartGame={initializeGame}
              buttonText="Iniciar Desafio"
            />
          )}

          {gameStarted && (
            <>
              <div className="flex items-center justify-center gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-white font-bold">{score}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">Jogadas:</span>
                  <span className="text-white font-bold">{moves}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-bold">{timeLeft}s</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="aspect-square rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                    style={{ perspective: "1000px" }}
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 ${
                        card.isFlipped || card.isMatched
                          ? "[transform:rotateY(180deg)]"
                          : ""
                      }`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Card Back */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
                      </div>

                      <div
                        className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg [transform:rotateY(180deg)]"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <img
                          src={memoryImages[card.imageId]}
                          alt="Memory card"
                          className="w-full h-full object-cover"
                        />
                        {card.isMatched && (
                          <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-lg font-bold">
                                ✓
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
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

export default MemoryMatch;

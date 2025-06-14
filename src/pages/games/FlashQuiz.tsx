import { useState, useEffect } from "react";
import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";
import { Timer, Zap, Brain, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUpdateUserStats } from "@/hooks/useUserData";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Qual é a capital do Brasil?",
    options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correctAnswer: 2,
    category: "Geografia",
  },
  {
    id: 2,
    question: "Quem escreveu 'Dom Casmurro'?",
    options: [
      "José de Alencar",
      "Machado de Assis",
      "Clarice Lispector",
      "Guimarães Rosa",
    ],
    correctAnswer: 1,
    category: "Literatura",
  },
  {
    id: 3,
    question: "Em que ano o Brasil foi descoberto?",
    options: ["1498", "1500", "1502", "1510"],
    correctAnswer: 1,
    category: "História",
  },
  {
    id: 4,
    question: "Qual é o maior estado brasileiro?",
    options: ["Minas Gerais", "Bahia", "Amazonas", "Pará"],
    correctAnswer: 2,
    category: "Geografia",
  },
  {
    id: 5,
    question: "Quantos estados tem o Brasil?",
    options: ["24", "25", "26", "27"],
    correctAnswer: 2,
    category: "Geografia",
  },
  {
    id: 6,
    question: "Qual é a moeda oficial do Brasil?",
    options: ["Peso", "Real", "Cruzeiro", "Dólar"],
    correctAnswer: 1,
    category: "Economia",
  },
  {
    id: 7,
    question: "Quem foi o primeiro presidente do Brasil?",
    options: [
      "Getúlio Vargas",
      "Deodoro da Fonseca",
      "Prudente de Morais",
      "Floriano Peixoto",
    ],
    correctAnswer: 1,
    category: "História",
  },
  {
    id: 8,
    question: "Qual é o maior rio do Brasil?",
    options: [
      "Rio São Francisco",
      "Rio Paraná",
      "Rio Amazonas",
      "Rio Tocantins",
    ],
    correctAnswer: 2,
    category: "Geografia",
  },
];

export default function FlashQuiz() {
  const { user } = useAuth();
  const { mutate: updateStats } = useUpdateUserStats();
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">(
    "ready"
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [questionsOrder, setQuestionsOrder] = useState<Question[]>([]);

  const resetGame = () => {
    setGameState("ready");
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShowResult(false);
    setStreak(0);
    setXpEarned(0);
  };

  const startGame = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestionsOrder(shuffled);
    setGameState("playing");
    setTimeLeft(15);
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect =
      answerIndex === questionsOrder[currentQuestion].correctAnswer;

    if (isCorrect) {
      const streakBonus = streak >= 3 ? 50 : 0;
      const timeBonus = Math.floor(timeLeft * 5);
      const points = 100 + streakBonus + timeBonus;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQuestion < questionsOrder.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        const finalXP = Math.max(50, Math.floor(score / 10));
        setXpEarned(finalXP);
        updateStats({ userId: user.id, xpToAdd: finalXP, coinsToAdd: finalXP });
        setGameState("finished");
      }
    }, 2000);
  };

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      handleAnswer(-1);
    }
  }, [timeLeft, gameState, showResult]);

  const currentQ = questionsOrder[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <GameLayout
        title="Quiz Relâmpago"
        onRestart={resetGame}
        gameCompleted={gameState === "finished"}
        xpEarned={xpEarned}
        score={score}
      >
        <div className="max-w-4xl mx-auto">
          {gameState === "ready" && (
            <div className="text-center space-y-6 animate-slide-up">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Quiz Relâmpago
              </h2>
              <p className="text-blue-100 text-xl mb-8">
                Teste seus conhecimentos sobre o Brasil em um quiz dinâmico!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <Brain className="h-8 w-8 text-blue-200 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Como Jogar</h3>
                  <p className="text-blue-100 text-sm">
                    Responda 8 perguntas sobre cultura brasileira
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <Timer className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
                  <h3 className="text-white font-bold mb-2">Tempo Limite</h3>
                  <p className="text-blue-100 text-sm">
                    15 segundos por pergunta
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-yellow-300" />
                  <span className="text-white font-bold">Recompensa XP</span>
                </div>
                <div className="text-3xl font-bold text-yellow-300">
                  Até +500 XP
                </div>
                <p className="text-purple-100 text-sm mt-2">
                  Sequências corretas dão bônus!
                </p>
              </div>

              <Button
                onClick={startGame}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-xl font-bold rounded-xl transform hover:scale-105 transition-all"
              >
                <Brain className="h-6 w-6 mr-2" />
                Começar Quiz
              </Button>
            </div>
          )}

          {gameState === "playing" && currentQ && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="text-blue-200">
                    Pergunta {currentQuestion + 1} de {questionsOrder.length}
                  </div>
                  <div className="bg-purple-600 px-3 py-1 rounded-full text-white text-sm">
                    {currentQ.category}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {streak > 0 && (
                    <div className="bg-yellow-600 px-3 py-1 rounded-full text-white text-sm">
                      🔥 {streak} seguidas
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-yellow-400" />
                    <span
                      className={`text-2xl font-bold ${
                        timeLeft <= 5 ? "text-red-400" : "text-white"
                      }`}
                    >
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="text-white font-bold">
                    {score.toLocaleString()} pts
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                  {currentQ.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`p-4 rounded-xl text-left transition-all transform hover:scale-105 disabled:cursor-not-allowed ${
                        showResult
                          ? index === currentQ.correctAnswer
                            ? "bg-green-500 text-white"
                            : selectedAnswer === index
                            ? "bg-red-500 text-white"
                            : "bg-gray-600 text-gray-300"
                          : selectedAnswer === index
                          ? "bg-blue-600 text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium">{option}</span>
                        {showResult && index === currentQ.correctAnswer && (
                          <CheckCircle className="h-5 w-5 ml-auto" />
                        )}
                        {showResult &&
                          selectedAnswer === index &&
                          index !== currentQ.correctAnswer && (
                            <XCircle className="h-5 w-5 ml-auto" />
                          )}
                      </div>
                    </button>
                  ))}
                </div>

                {showResult && (
                  <div className="mt-6 text-center">
                    <div
                      className={`text-lg font-bold ${
                        selectedAnswer === currentQ.correctAnswer
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedAnswer === currentQ.correctAnswer
                        ? "🎉 Correto!"
                        : "❌ Incorreto!"}
                    </div>
                    {selectedAnswer === currentQ.correctAnswer && (
                      <div className="text-blue-200 mt-2">
                        +
                        {100 +
                          (streak >= 3 ? 50 : 0) +
                          Math.floor(timeLeft * 5)}{" "}
                        pontos
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </GameLayout>
    </div>
  );
}

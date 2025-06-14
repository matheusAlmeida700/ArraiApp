import { useState, useEffect, useCallback } from "react";
import { GameLayout } from "@/components/GameLayout";
import { Button } from "@/components/ui/button";

interface MathQuestion {
  question: string;
  answer: number;
  options: number[];
}

export default function MathClash() {
  const [gameState, setGameState] = useState<"ready" | "playing" | "completed">(
    "ready"
  );
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(5);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const generateQuestion = useCallback((): MathQuestion => {
    const operations = ["+", "-", "×", "÷"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1: number, num2: number, answer: number, question: string;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        question = `${num1} - ${num2}`;
        break;
      case "×":
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      case "÷":
        num2 = Math.floor(Math.random() * 10) + 2;
        answer = Math.floor(Math.random() * 15) + 1;
        num1 = num2 * answer;
        question = `${num1} ÷ ${num2}`;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
        question = "1 + 1";
    }

    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + (Math.floor(Math.random() * 20) - 10);
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return { question, answer, options };
  }, []);

  const resetGame = useCallback(() => {
    setGameState("ready");
    setCurrentQuestion(null);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setQuestionTimeLeft(5);
    setQuestionsAnswered(0);
    setXpEarned(0);
    setShowResult(false);
    setSelectedAnswer(null);
  }, []);

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestion(generateQuestion());
    setQuestionTimeLeft(5);
  };

  const nextQuestion = useCallback(() => {
    setCurrentQuestion(generateQuestion());
    setQuestionTimeLeft(Math.max(3, 5 - Math.floor(questionsAnswered / 5)));
    setShowResult(false);
    setSelectedAnswer(null);
  }, [generateQuestion, questionsAnswered]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState("completed");
      setXpEarned(score + combo * 10);
    }
  }, [gameState, timeLeft, score, combo]);

  useEffect(() => {
    if (gameState === "playing" && !showResult && questionTimeLeft > 0) {
      const timer = setTimeout(() => {
        setQuestionTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeLeft === 0 && !showResult) {
      handleAnswer(-1);
    }
  }, [gameState, questionTimeLeft, showResult]);

  const handleAnswer = (selectedValue: number) => {
    if (showResult || !currentQuestion) return;

    setSelectedAnswer(selectedValue);
    setShowResult(true);
    setQuestionsAnswered((prev) => prev + 1);

    const isCorrect = selectedValue === currentQuestion.answer;

    if (isCorrect) {
      const timeBonus = questionTimeLeft * 10;
      const comboBonus = combo * 20;
      const points = 100 + timeBonus + comboBonus;

      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
    } else {
      setCombo(0);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  return (
    <GameLayout
      title="Desafio de Contas"
      onRestart={resetGame}
      gameCompleted={gameState === "completed"}
      xpEarned={xpEarned}
      score={score}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-6 mb-6">
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Tempo</div>
            <div className="text-white text-xl font-bold">{timeLeft}s</div>
          </div>
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Pontos</div>
            <div className="text-white text-xl font-bold">{score}</div>
          </div>
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Combo</div>
            <div className="text-white text-xl font-bold">{combo}x</div>
          </div>
          <div className="glass-effect rounded-lg p-3">
            <div className="text-purple-300 text-sm">Questões</div>
            <div className="text-white text-xl font-bold">
              {questionsAnswered}
            </div>
          </div>
        </div>

        {gameState === "ready" && (
          <div className="text-center">
            <h2 className="text-3xl font-bold gradient-text mb-6">
              Desafio de Matemática
            </h2>
            <p className="text-gray-300 mb-6">
              Resolva o máximo de contas possível em 60 segundos!
            </p>
            <p className="text-purple-300 text-sm mb-8">
              • Combo multiplica seus pontos
              <br />
              • Velocidade aumenta a cada 5 acertos
              <br />• Bônus de tempo para respostas rápidas
            </p>
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
            >
              Começar Desafio
            </Button>
          </div>
        )}

        {/* Game Screen */}
        {gameState === "playing" && currentQuestion && (
          <div className="text-center">
            {/* Question Timer */}
            <div className="mb-6">
              <div
                className={`text-4xl font-bold mb-2 ${
                  questionTimeLeft <= 2
                    ? "text-red-400 animate-pulse"
                    : "text-green-400"
                }`}
              >
                {questionTimeLeft}
              </div>
              <div className="w-32 mx-auto bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(questionTimeLeft / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="glass-effect rounded-xl p-8 mb-8">
              <div className="text-5xl font-bold text-white mb-8 font-mono">
                {currentQuestion.question} = ?
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  let buttonClass =
                    "text-2xl font-bold p-6 rounded-lg transition-all duration-200 transform hover:scale-105 ";

                  if (showResult) {
                    if (option === currentQuestion.answer) {
                      buttonClass +=
                        "bg-green-500/30 border-green-400 text-green-300 border-2";
                    } else if (option === selectedAnswer) {
                      buttonClass +=
                        "bg-red-500/30 border-red-400 text-red-300 border-2";
                    } else {
                      buttonClass +=
                        "bg-gray-600/30 border-gray-500 text-gray-400 border";
                    }
                  } else {
                    buttonClass +=
                      "bg-purple-500/20 border-purple-500/30 text-white hover:bg-purple-500/30 border";
                  }

                  return (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      className={buttonClass}
                      disabled={showResult}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>

              {/* Result Feedback */}
              {showResult && (
                <div className="mt-6">
                  {selectedAnswer === currentQuestion.answer ? (
                    <div className="text-green-400 text-xl font-bold animate-bounce">
                      ✓ Correto! +{100 + questionTimeLeft * 10 + combo * 20}{" "}
                      pontos
                    </div>
                  ) : (
                    <div className="text-red-400 text-xl font-bold">
                      ✗ Incorreto. Resposta: {currentQuestion.answer}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
}

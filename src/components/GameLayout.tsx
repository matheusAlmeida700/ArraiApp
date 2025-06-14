import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameLayoutProps {
  title: string;
  children: React.ReactNode;
  onRestart: () => void;
  gameCompleted?: boolean;
  xpEarned?: number;
  score?: number;
}

export const GameLayout = ({
  title,
  children,
  onRestart,
  gameCompleted = false,
  xpEarned = 0,
  score = 0,
}: GameLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link to="/games">
            <Button
              variant="ghost"
              className="text-purple-300 hover:text-white hover:bg-purple-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Jogos
            </Button>
          </Link>

          <h1 className="text-2xl font-bold gradient-text">{title}</h1>

          <Button
            onClick={onRestart}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 p-4">{children}</div>

      {/* Results Modal */}
      {gameCompleted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-effect rounded-xl p-8 max-w-md w-full text-center space-y-6 border border-purple-500/30">
            <div className="text-6xl mb-4">🎉</div>

            <h2 className="text-2xl font-bold gradient-text">
              Jogo Concluído!
            </h2>

            <div className="space-y-4">
              {score > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Pontuação:</span>
                  <Badge className="bg-yellow-600 text-white">
                    {score.toLocaleString()}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-300">XP Ganho:</span>
                <Badge className="bg-purple-600 text-white">
                  <Trophy className="h-3 w-3 mr-1" />+{xpEarned} XP
                </Badge>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onRestart}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Jogar Novamente
              </Button>
              <Link to="/games" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

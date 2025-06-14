
import { Button } from '@/components/ui/button';
import { Zap, Play } from 'lucide-react';

interface Instruction {
  icon: string;
  title: string;
  description: string;
}

interface PreGameInstructionsProps {
  gameTitle: string;
  gameDescription: string;
  gameEmoji: string;
  instructions: Instruction[];
  maxXP: number;
  onStartGame: () => void;
  buttonText?: string;
}

export const PreGameInstructions = ({
  gameTitle,
  gameDescription,
  gameEmoji,
  instructions,
  maxXP,
  onStartGame,
  buttonText = "Iniciar Jogo"
}: PreGameInstructionsProps) => {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <div className="text-8xl mb-6">{gameEmoji}</div>
        <h2 className="text-4xl font-bold gradient-text">{gameTitle}</h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {gameDescription}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {instructions.map((instruction, index) => (
          <div 
            key={index}
            className="glass-effect rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
          >
            <div className="text-4xl mb-3">{instruction.icon}</div>
            <h3 className="text-white font-bold text-lg mb-2">{instruction.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{instruction.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-white/20 max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-yellow-300" />
          <span className="text-white font-bold">Recompensa XP</span>
        </div>
        <div className="text-3xl font-bold text-yellow-300">Até +{maxXP} XP</div>
      </div>
      
      <Button 
        onClick={onStartGame}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-xl font-bold rounded-xl transform hover:scale-105 transition-all duration-200"
      >
        <Play className="h-6 w-6 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
};

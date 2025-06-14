import { Progress } from "@/components/ui/progress";

interface XPBarProps {
  currentXP: number;
  levelXP: number;
  nextLevelXP: number;
  level: number;
  showAnimation?: boolean;
}

export const XPBar = ({
  currentXP,
  levelXP,
  nextLevelXP,
  level,
  showAnimation = false,
}: XPBarProps) => {
  const progress = ((currentXP - levelXP) / (nextLevelXP - levelXP)) * 100;
  const xpNeeded = nextLevelXP - currentXP;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-purple-300">
          Nível {level}
        </span>
        <span className="text-xs text-gray-400">
          {xpNeeded} XP para próximo nível
        </span>
      </div>

      <div className="relative">
        <Progress
          value={progress}
          className="h-3 bg-gray-800 border border-purple-500/30"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-75 rounded-full"
          style={{ width: `${progress}%` }}
        />

        {showAnimation && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{currentXP.toLocaleString()} XP</span>
        <span>{nextLevelXP.toLocaleString()} XP</span>
      </div>
    </div>
  );
};

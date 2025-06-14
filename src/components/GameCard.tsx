import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users, Zap } from "lucide-react";

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  xpReward: number;
  difficulty: "Fácil" | "Médio" | "Difícil";
  category: string;
  playTime: string;
  players: number;
  available: boolean;
  rating: number;
  bgGradient?: string;
}

export const GameCard = ({
  id,
  title,
  description,
  image,
  xpReward,
  difficulty,
  category,
  playTime,
  players,
  available,
  rating,
  bgGradient,
}: GameCardProps) => {
  const difficultyColor = {
    Fácil: "bg-green-600",
    Médio: "bg-yellow-600",
    Difícil: "bg-red-600",
  };

  return (
    <Card className="game-card group relative h-full">
      <div className="relative h-64 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        <div className="absolute top-11 right-4">
          <Badge className="bg-purple-600/90 text-white border-none backdrop-blur-sm">
            <Zap className="h-7 w-4 mr-2" />+{xpReward} XP
          </Badge>
        </div>

        <div className="absolute top-2 right-4">
          <Badge
            className={`${difficultyColor[difficulty]} text-white border-none`}
          >
            {difficulty}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-200 text-sm line-clamp-2">{description}</p>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-4 text-sm text-gray-50">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{playTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{players.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-600 dark:bg-purple-900 dark:text-purple-200"
          >
            {category}
          </Badge>

          <Link to={`/games/${id}`}>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
              disabled={!available}
            >
              {available ? "Jogar Agora" : "Em Breve"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

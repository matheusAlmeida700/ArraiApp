import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Play,
  Star,
  Clock,
  Target,
  Gamepad2,
  Award,
} from "lucide-react";
import { games } from "@/data/games";

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = games.find((g) => g.id === id);

  const handlePlayClick = () => {
    if (game.available) {
      navigate(`/game/${game.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navbar />

      <div className="pt-32 pb-16 px-4 relative z-10">
        <div className="container mx-auto">
          <Link
            to="/games"
            className="inline-flex items-center text-purple-300 hover:text-purple-200 mb-8 transition-all duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Voltar ao Arcade</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="relative h-[500px] rounded-3xl overflow-hidden group">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/30" />

                <div className="absolute top-6 left-6 flex gap-3">
                  <Badge className="bg-gradient-to-r from-red-600/80 to-red-600/80 text-white border-none backdrop-blur-md font-bold text-lg px-4 py-2">
                    {game.difficulty}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white border-none backdrop-blur-md font-bold text-lg px-4 py-2">
                    {game.category}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                    {game.title}
                  </h1>
                  <p className="text-gray-200 text-xl leading-relaxed mb-6 max-w-3xl">
                    {game.description}
                  </p>

                  <div className="flex items-center gap-8 text-lg">
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-xl px-4 py-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">
                        {game.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-xl px-4 py-2">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-medium">
                        {game.playTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-3xl border border-purple-500/20 group-hover:border-purple-400/40 transition-colors duration-500"></div>
              </div>

              <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-md border-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    <Gamepad2 className="h-6 w-6 text-purple-400" />
                    Descrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {game.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-md border-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-2xl flex items-center gap-3">
                    <Target className="h-6 w-6 text-green-400" />
                    Como Dominar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {game.howToPlay.map((step, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-4 text-gray-300 text-lg"
                      >
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="mb-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Pronto para a Ação?
                    </h3>
                    <p className="text-purple-200">Entrar no jogo</p>
                  </div>

                  <Button
                    onClick={handlePlayClick}
                    size="lg"
                    className="w-full text-xl py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25"
                    disabled={!game.available}
                  >
                    <Play className="h-6 w-6 mr-3" />
                    {game.available ? "INICIAR MISSÃO" : "EM BREVE"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-md border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-400" />
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                      <div className="text-lg font-bold text-purple-300">
                        {game.category}
                      </div>
                      <div className="text-sm text-gray-400">Categoria</div>
                    </div>
                    <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                      <div className="text-lg font-bold text-yellow-300">
                        {game.difficulty}
                      </div>
                      <div className="text-sm text-gray-400">Nível</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <span className="text-gray-400">Tempo Médio</span>
                      <span className="text-white font-semibold">
                        {game.playTime}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-400">
                        Avaliação da Comunidade
                      </span>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-white font-bold text-lg">
                          {game.rating}
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={game.rating * 20}
                      className="h-3 bg-gray-800"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;

import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Crown,
  Trophy,
  Medal,
  TrendingUp,
  Calendar,
  Users,
} from "lucide-react";
import { useUser } from "@/hooks/useUserData";
import { useAuth } from "@/contexts/AuthContext";

const Ranking = () => {
  const { data: users } = useUser();
  const { user } = useAuth();
  const { data: userData } = useUser(user?.id);

  const sortedUsers = [...(users || [])]
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      id: user.id,
      name: user.username,
      avatar: "photo-1527576539890-dfa815648363",
      xp: user.xp,
      level: user.level,
      badges: [],
      winRate: 0,
      position: index + 1,
    }));

  const topPlayers = sortedUsers.slice(0, 3);
  const regularPlayers = sortedUsers.slice(3);

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Trophy className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Medal className="h-6 w-6 text-orange-400" />;
      default:
        return (
          <span className="text-lg font-bold text-purple-300">#{position}</span>
        );
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  const stats = [
    {
      icon: Users,
      label: "Total de Jogadores",
      value: "12,450",
      color: "text-blue-400",
    },
    {
      icon: TrendingUp,
      label: "XP Médio por Jogador",
      value: "3,280",
      color: "text-green-400",
    },
    {
      icon: Trophy,
      label: "Partidas Hoje",
      value: "8,920",
      color: "text-purple-400",
    },
    {
      icon: Calendar,
      label: "Recordes Quebrados",
      value: "156",
      color: "text-pink-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />

      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Ranking</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Veja os melhores jogadores da plataforma e compare seu desempenho
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-8">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Crown className="h-6 w-6 text-yellow-400" />
                    Top 3 Jogadores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPlayers.map((player) => (
                      <Card
                        key={player.id}
                        className={`${getPositionBg(
                          player.position
                        )} backdrop-blur-md transition-all duration-300 hover:scale-95`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12">
                              {getPositionIcon(player.position)}
                            </div>

                            <Avatar className="h-16 w-16 border-2 border-purple-500/30">
                              <AvatarImage src="/blank-picture.png" />
                            </Avatar>

                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white">
                                {player.name}
                              </h3>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge className="bg-purple-600 text-white">
                                  Nível {player.level}
                                </Badge>
                                <span className="text-green-400 font-semibold">
                                  {player.xp.toLocaleString()} XP
                                </span>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {player.badges.map((badge, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs border-yellow-500/30 text-yellow-300"
                                  >
                                    {badge}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-400">
                                {player.xp} XP
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-xl">
                    Ranking Completo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regularPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center justify-center w-8 h-8">
                          <span className="text-lg font-bold text-purple-300">
                            #{player.position}
                          </span>
                        </div>

                        <Avatar className="h-12 w-12 border border-purple-500/30">
                          <AvatarImage src="/blank-picture.png" />
                        </Avatar>

                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            {player.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm">
                            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                              Nível {player.level}
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            {player?.xp}XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Sua Posição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <Avatar className="h-20 w-20 mx-auto border-2 border-purple-500/30">
                      <AvatarImage src="/blank-picture.png" />
                    </Avatar>

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {userData?.username}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Badge className="bg-purple-600 text-white">
                          Nível {userData?.level}
                        </Badge>
                        <span className="text-green-400 font-semibold">
                          {userData?.xp} XP
                        </span>
                      </div>
                    </div>
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

export default Ranking;

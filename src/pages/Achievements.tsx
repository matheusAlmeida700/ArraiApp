
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Zap, Lock, CheckCircle, Award } from 'lucide-react';

const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const achievements = [
    {
      id: 1,
      name: 'Primeira Partida',
      description: 'Complete seu primeiro jogo na plataforma',
      category: 'Iniciante',
      xpReward: 50,
      progress: 100,
      unlocked: true,
      rarity: 'Comum',
      icon: Trophy,
      unlockedAt: '2024-05-15'
    },
    {
      id: 2,
      name: 'Sequência Vitoriosa',
      description: 'Vença 5 jogos consecutivos',
      category: 'Vitórias',
      xpReward: 200,
      progress: 60,
      unlocked: false,
      rarity: 'Raro',
      icon: Star,
      requirement: '3/5 vitórias consecutivas'
    },
    {
      id: 3,
      name: 'Mestre do Quiz',
      description: 'Acerte 100% das perguntas em um quiz',
      category: 'Perfeição',
      xpReward: 300,
      progress: 100,
      unlocked: true,
      rarity: 'Épico',
      icon: Target,
      unlockedAt: '2024-05-20'
    },
    {
      id: 4,
      name: 'Velocista',
      description: 'Complete um jogo em menos de 2 minutos',
      category: 'Tempo',
      xpReward: 150,
      progress: 80,
      unlocked: false,
      rarity: 'Incomum',
      icon: Zap,
      requirement: 'Melhor tempo: 2:15'
    },
    {
      id: 5,
      name: 'Colecionador',
      description: 'Desbloqueie 10 conquistas diferentes',
      category: 'Coleção',
      xpReward: 500,
      progress: 20,
      unlocked: false,
      rarity: 'Lendário',
      icon: Award,
      requirement: '2/10 conquistas'
    },
    {
      id: 6,
      name: 'Veterano',
      description: 'Jogue por 30 dias consecutivos',
      category: 'Dedicação',
      xpReward: 400,
      progress: 45,
      unlocked: false,
      rarity: 'Épico',
      icon: Trophy,
      requirement: '14/30 dias'
    }
  ];

  const categories = ['todas', 'Iniciante', 'Vitórias', 'Perfeição', 'Tempo', 'Coleção', 'Dedicação'];

  const rarityColors = {
    'Comum': 'border-gray-500/30 bg-gray-500/10 text-gray-300',
    'Incomum': 'border-green-500/30 bg-green-500/10 text-green-300',
    'Raro': 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    'Épico': 'border-purple-500/30 bg-purple-500/10 text-purple-300',
    'Lendário': 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
  };

  const filteredAchievements = selectedCategory === 'todas' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXPEarned = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-text mb-4">Conquistas</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Desbloqueie conquistas especiais e ganhe XP extra completando desafios únicos
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 text-center">
              <CardContent className="pt-6">
                <Trophy className="h-8 w-8 mx-auto mb-3 text-yellow-400" />
                <div className="text-2xl font-bold text-white mb-1">{unlockedCount}</div>
                <div className="text-sm text-gray-400">Desbloqueadas</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10 text-center">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 mx-auto mb-3 text-purple-400" />
                <div className="text-2xl font-bold text-white mb-1">{achievements.length}</div>
                <div className="text-sm text-gray-400">Total</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10 text-center">
              <CardContent className="pt-6">
                <Star className="h-8 w-8 mx-auto mb-3 text-green-400" />
                <div className="text-2xl font-bold text-white mb-1">{totalXPEarned}</div>
                <div className="text-sm text-gray-400">XP Ganho</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/5 backdrop-blur-md border-white/10 text-center">
              <CardContent className="pt-6">
                <Zap className="h-8 w-8 mx-auto mb-3 text-pink-400" />
                <div className="text-2xl font-bold text-white mb-1">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
                <div className="text-sm text-gray-400">Progresso</div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">Progresso Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Conquistas Desbloqueadas</span>
                  <span className="text-white">{unlockedCount}/{achievements.length}</span>
                </div>
                <Progress value={(unlockedCount / achievements.length) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'todas' ? 'Todas' : category}
              </Badge>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => (
              <Card 
                key={achievement.id} 
                className={`relative transition-all duration-300 hover:scale-105 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/30' 
                    : 'bg-white/5 border-white/10'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rarity Corner */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}>
                  {achievement.rarity}
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-yellow-500 to-orange-500' 
                        : 'bg-gray-600'
                    }`}>
                      {achievement.unlocked ? (
                        <CheckCircle className="h-8 w-8 text-white" />
                      ) : (
                        <Lock className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-1 ${
                        achievement.unlocked ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress or Completion Info */}
                  {achievement.unlocked ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-green-600 text-white">
                          Desbloqueada
                        </Badge>
                        <Badge className="bg-purple-600 text-white">
                          +{achievement.xpReward} XP
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400">
                        Desbloqueada em {new Date(achievement.unlockedAt!).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Progresso</span>
                        <span className="text-sm text-purple-300">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">{achievement.requirement}</p>
                        <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                          +{achievement.xpReward} XP
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-2xl font-semibold text-white mb-2">Nenhuma conquista encontrada</h3>
              <p className="text-gray-400 mb-6">Tente selecionar uma categoria diferente</p>
            </div>
          )}

          {/* Achievement Tips */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">Dicas para Conquistar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div className="space-y-2">
                  <h4 className="text-purple-300 font-semibold">Conquistas de Vitória:</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Pratique nos jogos mais fáceis primeiro</li>
                    <li>• Estude as estratégias dos top players</li>
                    <li>• Mantenha consistency para sequências</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-purple-300 font-semibold">Conquistas de Tempo:</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Conheça bem as mecânicas do jogo</li>
                    <li>• Use atalhos quando possível</li>
                    <li>• Pratique movimentos rápidos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;

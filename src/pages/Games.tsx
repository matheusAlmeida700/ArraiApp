import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Gamepad2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { games } from "@/data/games";
import PromotionalSlider from "@/components/ui/PromotionalSlider";
import { promotionalSlides } from "@/data/promotionalSlides";

const Games = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const categories = [
    "all",
    "Habilidade",
    "Arcade",
    "Conhecimento",
    "Reflexo",
    "Lógica",
    "Memória",
    "Velocidade",
  ];
  const difficulties = ["all", "Fácil", "Médio", "Difícil"];

  const featuredGames = games.filter((game) => game.featured);
  const comingSoonGames = games.filter((game) => !game.available);

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || game.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || game.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Navbar />

      <div className="pt-24 pb-16 px-4 relative z-10">
        <div className="container mx-auto">
          <section className="container mx-auto mt-14 px-4 pb-12 sm:px-6 lg:px-8">
            <PromotionalSlider
              slides={promotionalSlides}
              interval={6000}
              className="border border-border/30 shadow-xl"
            />
          </section>
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border border-purple-500/30 rounded-full px-6 py-3 mb-6">
              <Gamepad2 className="h-5 w-5 text-purple-300" />
              <span className="text-purple-200 font-medium">
                Catálogo de Jogos
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent leading-tight">
              ARRAI
              <span className="text-white">APP</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Mergulhe no universo de jogos mais avançado do Brasil. Cada
              partida é uma experiência única, repleta de adrenalina, desafios e
              recompensas épicas.
            </p>
          </div>

          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl pb-2 font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                🔥 Jogos em Destaque
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm font-medium">
                  MAIS JOGADOS
                </span>
              </div>
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {featuredGames.map((game, index) => (
                  <CarouselItem
                    key={game.id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div style={{ animationDelay: `${index * 0.1}s` }}>
                      <GameCard {...game} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-purple-900/50 border-purple-500/30 text-purple-300 hover:bg-purple-800/50" />
              <CarouselNext className="bg-purple-900/50 border-purple-500/30 text-purple-300 hover:bg-purple-800/50" />
            </Carousel>
          </section>

          <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-md rounded-3xl p-6 mb-6 border border-purple-500/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              Centro de Comando
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 group-hover:text-purple-300 transition-colors" />
                <Input
                  placeholder="Buscar jogos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-black/30 border-purple-500/30 text-white placeholder:text-gray-400 h-14 rounded-xl text-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-14 rounded-xl font-bold focus:border-purple-400">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-md border-purple-500/30">
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20"
                    >
                      {category === "all" ? "Todas as Categorias" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="bg-black/30 border-purple-500/30 text-white h-14 rounded-xl font-bold focus:border-purple-400">
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900/95 backdrop-blur-md border-purple-500/30">
                  {difficulties.map((difficulty) => (
                    <SelectItem
                      key={difficulty}
                      value={difficulty}
                      className="text-white hover:bg-purple-500/20 focus:bg-purple-500/20"
                    >
                      {difficulty === "all"
                        ? "Todas as Dificuldades"
                        : difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 rounded-xl text-lg font-semibold group"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
              >
                <Filter className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Resetar
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-300 px-4 py-2 text-sm font-medium rounded-xl ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none shadow-lg shadow-purple-500/25"
                    : "border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 hover:scale-105"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "🎯 Todos" : category}
              </Badge>
            ))}
          </div>

          <div className="mb-8">
            <p className="text-gray-400 text-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              Exibindo {filteredGames.length} de {games.length} jogos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredGames.map((game, index) => (
              <div
                key={game.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <GameCard {...game} />
              </div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center">
              <div className="text-8xl mb-6">🎮</div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
                Nenhum jogo encontrado
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Ajuste seus filtros ou explore outras categorias para descobrir
                jogos incríveis
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedDifficulty("all");
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-3 rounded-xl font-semibold"
              >
                🔄 Descobrir Tudo
              </Button>
            </div>
          )}

          {comingSoonGames.length > 0 && (
            <section className="mt-20">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-300 to-red-300 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                ⚡ Em Breve
                <div className="text-sm bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-500/30">
                  {comingSoonGames.length} jogos
                </div>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {comingSoonGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <GameCard {...game} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;

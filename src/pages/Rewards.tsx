import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Zap, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { userDataService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import PromotionalSlider from "@/components/ui/PromotionalSlider";
import { rewardsSlides } from "@/data/promotionalSlides";
import { useUser } from "@/hooks/useUserData";
import { rewards } from "@/data/rewards";
import { categories } from "@/data/rewards";

const Rewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: userData } = useUser(user?.id);

  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [isLoading, setIsLoading] = useState(false);

  const rarityColors = {
    BRONZE: "bg-amber-700/90",
    SILVER: "bg-gray-400/90",
    GOLD: "bg-yellow-500/90",
  };

  const filteredRewards =
    selectedCategory === "todas"
      ? rewards
      : rewards.filter((reward) => reward.category === selectedCategory);

  const canAfford = (cost: number) => {
    return userData && userData.coins >= cost;
  };

  const handleRedeem = async (reward: any) => {
    if (canAfford(reward.xpCost) && reward.available) {
      try {
        setIsLoading(true);
        await userDataService.generateVoucher(
          userData.cpf,
          userData.email,
          reward.rarity
        );

        alert(
          `Seu voucher ${reward.rarity} foi gerado com sucesso! Verifique seu e-mail para receber o código.`
        );
      } catch (error: any) {
        alert("Erro ao gerar voucher! Tente novamente mais tarde. " + error);
        console.error("Erro ao resgatar voucher:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Não é possível resgatar",
        description:
          "Você não tem moedas suficiente ou a recompensa está indisponível.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />

      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Loja de Recompensas</h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Troque seu XP por recompensas reais e experiências exclusivas na
              festa
            </p>
          </div>

          <section className="container mx-auto mt-14 px-4 pb-12 sm:px-6 lg:px-8">
            <PromotionalSlider
              slides={rewardsSlides}
              interval={6000}
              className="border border-border/30 shadow-xl"
            />
          </section>

          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border-purple-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Seu Saldo</h2>
                    <p className="text-purple-300">
                      Use seus pontos para resgatar recompensas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">
                    {userData?.coins ?? 0}
                  </div>
                  <div className="text-purple-300">Moedas Disponíveis</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white border-purple-500"
                    : "border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === "todas" ? "Todas" : category}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRewards.map((reward, index) => (
              <Card
                key={reward.id}
                className={`relative transition-all duration-300 hover:scale-105 ${
                  reward.available
                    ? "bg-white/5 border-white/10"
                    : "bg-gray-800/50 border-gray-700/30"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium z-10 ${
                    rarityColors[reward.rarity as keyof typeof rarityColors]
                  }`}
                >
                  {reward.rarity}
                </div>

                {reward.stock <= 10 && reward.available && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white rounded-full text-xs font-medium z-10">
                    Apenas {reward.stock} restantes
                  </div>
                )}

                {!reward.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center">
                      <X className="h-12 w-12 text-red-400 mx-auto mb-2" />
                      <span className="text-red-300 font-semibold">
                        Esgotado
                      </span>
                    </div>
                  </div>
                )}

                <div className="h-72 overflow-hidden rounded-t-lg">
                  <img
                    src={reward.image}
                    alt={reward.name}
                    className={`w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110 ${
                      !reward.available ? "grayscale" : ""
                    }`}
                  />
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3
                      className={`text-lg font-bold mb-2 ${
                        reward.available ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {reward.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        reward.available ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {reward.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-600 text-white">
                          {reward.xpCost} XP
                        </Badge>
                        <span className="text-sm text-gray-400">
                          Valor: {reward.value}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Em estoque</span>
                      <span
                        className={`font-medium ${
                          reward.stock > 10
                            ? "text-green-400"
                            : reward.stock > 0
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {reward.available
                          ? `${reward.stock} unidades`
                          : "Esgotado"}
                      </span>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className={`w-full ${
                            canAfford(reward.xpCost) && reward.available
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                              : "bg-gray-600 text-gray-300 cursor-not-allowed"
                          }`}
                          disabled={
                            !canAfford(reward.xpCost) || !reward.available
                          }
                        >
                          {!reward.available
                            ? "Esgotado"
                            : !canAfford(reward.xpCost)
                            ? "XP Insuficiente"
                            : "Resgatar"}
                        </Button>
                      </DialogTrigger>

                      {canAfford(reward.xpCost) && reward.available && (
                        <DialogContent className="bg-gray-900 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Confirmar Resgate
                            </DialogTitle>
                            <DialogDescription className="text-gray-400">
                              Tem certeza que deseja resgatar este item?
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                              <img
                                src={reward.image}
                                alt={reward.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <h3 className="text-white font-semibold">
                                  {reward.name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {reward.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                              <span className="text-white">Custo:</span>
                              <span className="text-purple-300 font-bold">
                                {reward.xpCost} Moedas
                              </span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                              <span className="text-white">
                                Saldo após resgate:
                              </span>
                              <span className="text-green-400 font-bold">
                                {userData?.coins - reward.xpCost} Moedas
                              </span>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                Cancelar
                              </Button>
                              <Button
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-2"
                                onClick={() => handleRedeem(reward)}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Gerando...
                                  </>
                                ) : (
                                  "Confirmar Resgate"
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                Como Funciona
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div className="space-y-2">
                  <h4 className="text-purple-300 font-semibold">
                    Resgatando Recompensas:
                  </h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Tenha XP suficiente para o item desejado</li>
                    <li>• Verifique se o item está em estoque</li>
                    <li>• Confirme o resgate e aguarde a liberação</li>
                    <li>
                      • Apresente o código que será enviado ao seu e-mail no
                      evento para receber
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-purple-300 font-semibold">
                    Dicas Importantes:
                  </h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Itens lendários têm estoque limitado</li>
                    <li>• Novos itens são adicionados semanalmente</li>
                    <li>• XP não tem data de expiração</li>
                    <li>• Resgates são processados instantaneamente</li>
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

export default Rewards;

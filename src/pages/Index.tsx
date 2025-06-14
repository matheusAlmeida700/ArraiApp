import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Gamepad, User } from "lucide-react";
import Milhito3 from "@/assets/home/milhito-3.png";
import FeatureSection from "@/components/FeatureSection";
import ParticleBackground from "@/components/ParticleBackground.jsx";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleBackground />
      <Header />

      <main className="flex-1">
        <section className="relative pt-20 md:pt-24 flex items-center min-h-screen">
          <div className="w-full mx-auto text-center">
            <img src="/ArraiApp.png" alt="ArraiApp" className="mx-auto" />
            <img
              src="/ArraiAppDec.png"
              alt="ArraiApp"
              className="absolute top-24 animate-float"
            />
            <div className="flex flex-col-reverse md:flex-col">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:-mt-8 md:mb-16">
                <Link to="/auth">
                  <Button className="relative group px-8 py-6 text-md bg-default-yellow text-white rounded-xl flex items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,100,0.9)]">
                    <div className="absolute inset-0 z-0 blur-md opacity-20 bg-gradient-to-r from-default-yellow via-yellow-500 to-default-yellow transition-all duration-700 group-hover:opacity-50" />
                    <Gamepad className="relative z-10 transform transition-transform duration-500 group-hover:rotate-[20deg]" />
                    <span className="relative z-10">CADASTRE-SE</span>
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button
                    variant="outline"
                    className="text-md text-white px-8 py-6 border-white/20 hover:bg-white/5 hover:scale-105 hover:shadow-lg border-2 transition-all"
                  >
                    <User />
                    JÁ TENHO UMA CONTA
                  </Button>
                </Link>
              </div>
              <h1 className="text-lg md:text-2xl px-6 text-white/90 max-w-3xl mx-auto mb-14 font-bold poppins">
                Bem-vindo ao arraiá mais moderno que já viu! Enquanto a fila
                anda, jogue, junte pontos e troque por prêmios. Diversão
                garantida no ritmo da tradição.
              </h1>
            </div>

            <img
              src="/rewards-bg.png"
              alt="ArraiApp"
              className="mx-auto pt-1 md:pt-0 shadow-2xl"
            />
          </div>
        </section>

        <section className="max-w-7xl mx-auto">
          <FeatureSection
            title="Ganhe pontos enquanto espera!"
            text="Nada de tédio na fila! Aqui você joga mini-games divertidos e acumula pontos que viram prêmios na festa — como comidas, brindes e experiências exclusivas. É só entrar, jogar e trocar!"
            image={Milhito3}
            reverse
          />
          <FeatureSection
            title="Ganhe pontos enquanto espera!"
            text="Nada de tédio na fila! Aqui você joga mini-games divertidos e acumula pontos que viram prêmios na festa — como comidas, brindes e experiências exclusivas. É só entrar, jogar e trocar!"
            image="/ballons.png"
          />
        </section>

        <section className="relative flex flex-col items-end justify-start min-h-screen pt-12">
          <div className="max-w-3xl z-10 pr-32">
            <h1 className="text-2xl md:text-4xl font-bold mb-4 text-right">
              Tudo gamificado, tudo animado
            </h1>
            <p className="text-lg md:text-xl text-right">
              Você ganha XP, desbloqueia conquistas e compete com outros
              jogadores enquanto se diverte. Cada clique, ponto e vitória conta
              — e o sistema reconhece tudo em tempo real!
            </p>
          </div>

          <img
            src="/footer.png"
            alt="ArraiApp"
            className="mx-auto absolute bottom-0"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

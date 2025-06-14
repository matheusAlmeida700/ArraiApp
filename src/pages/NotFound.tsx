import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground.jsx";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-main-dark flex items-center justify-center p-4">
      <ParticleBackground />

      <div className="relative z-10 text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-main-blue to-main-blue/80 rounded-full flex items-center justify-center">
            <span className="text-6xl"></span>
          </div>

          <div className="text-8xl font-bold text-red-500 mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Página não encontrada, caipira!
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Parece que você se perdeu na festa digital. Esta página não existe
            ou foi movida para outro lugar.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/" className="block">
            <Button
              size="lg"
              className="w-full bg-main-yellow hover:bg-main-yellow/90 text-white"
            >
              <Home className="h-5 w-5 mr-2" />
              Voltar ao Início
            </Button>
          </Link>

          <Link to="/games" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full hover:bg-primary"
            >
              <Search className="h-5 w-5 mr-2" />
              Explorar Jogos
            </Button>
          </Link>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar à Página Anterior
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

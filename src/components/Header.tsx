import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

const Header = () => {
  return (
    <nav className="fixed poppins top-0 left-0 right-0 z-50 bg-default-dark/90 shadow-lg shadow-black border-white/10 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center hover:scale-110 transition-transform"
        >
          <img
            src="/images/milhito/milhito-normal.png"
            alt="Logo"
            className="w-16 h-16 rotate-6 mr-2"
          />
          <span className="text-2xl hidden md:block font-bold text-white text-glow ">
            ArraiApp
          </span>
        </Link>

        <Link to="/auth">
          <Button className="relative group px-6 py-2 bg-default-yellow text-white rounded-xl flex items-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,100,0.9)]">
            <div className="absolute inset-0 z-0 blur-md opacity-20 bg-gradient-to-r from-default-yellow via-yellow-500 to-default-yellow transition-all duration-700 group-hover:opacity-50" />
            <ArrowUpRight className="relative z-10 transform transition-transform duration-500 group-hover:rotate-[45deg]" />
            <span className="relative z-10">COMEÇAR AGORA</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Header;

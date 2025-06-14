import { Link, Navigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/hooks/useUserData";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();

  const { data: userData, error, refetch } = useUserData();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar dados do usuário",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  }, [error]);

  const navigationItems = [
    { name: "JOGOS", path: "/games" },
    { name: "RANKING", path: "/ranking" },
    { name: "RECOMPENSAS", path: "/rewards" },
  ];

  const handleLogout = () => {
    logout();
    return <Navigate to="/auth" />;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-default-dark/90 shadow-lg shadow-black border-white/10 px-6 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center hover:scale-110 transition-transform"
          >
            <img
              src="/images/milhito/milhito-normal.png"
              alt="Logo"
              className="w-16 h-16 rotate-6 mr-2"
            />
            <span className="text-2xl hidden sm:block font-bold text-white text-glow">
              ArraiApp
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg font-bold transition-all duration-200 ${
                  location.pathname === item.path
                    ? "text-purple-300 border border-purple-500/30"
                    : "text-gray-300 hover:text-purple-300 hover:bg-purple-500/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-700/20 border border-purple-500/30 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-purple-200 text-sm font-semibold">
                  {userData?.xp ?? 0} XP
                </span>
                <Badge className="bg-purple-600 text-white px-2 py-0.5 text-xs rounded-full">
                  🧠 Nível {userData?.level ?? 0}
                </Badge>
              </div>

              <div className="w-px h-5 bg-purple-400/30 mx-1" />

              <div className="flex items-center gap-2">
                <Coins />
                <span className="text-purple-200 text-sm font-semibold">
                  {userData?.coins ?? 0}
                </span>
              </div>
            </div>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer hover:scale-110 hover:ring-space-purple transition-all">
                    <AvatarImage src="/blank-picture.png" />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card/95 border-white/10 backdrop-blur-md">
                  <DropdownMenuItem className="items-center gap-2 font-bold focus:bg-trasparent">
                    {userData?.username ?? ""}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 flex items-center gap-2 font-bold"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Avatar className="w-10 h-10 cursor-pointer hover:scale-110 hover:ring-space-purple transition-all">
                  <AvatarImage src="/blank-picture.png" />
                </Avatar>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

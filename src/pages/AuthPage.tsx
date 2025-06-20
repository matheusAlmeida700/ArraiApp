import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  EyeOff,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    cpf: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isValidCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    if (parseInt(cpf[9]) !== firstDigit) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
    if (parseInt(cpf[10]) !== secondDigit) return false;

    return true;
  };

  if (isAuthenticated) {
    return <Navigate to="/games" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "signup" && !isValidCPF(formData.cpf)) {
      alert("CPF inválido!");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      if (activeTab === "login") {
        await login(formData.email, formData.password);
        navigate("/games");
      } else {
        if (!formData.username || formData.username.trim() === "") {
          throw new Error("Nome é obrigatório");
        }
        await signup(
          formData.username,
          formData.email,
          formData.cpf,
          formData.password
        );
        toast({
          title: "Conta criada",
          description: "Sua conta foi criada com sucesso!",
        });
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao entrar. Por favor, tente novamente.";
      setError(errorMessage);
      toast({
        title: "Erro ao entrar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    setError(null);
    setFormData({
      username: "",
      email: "",
      cpf: "",
      password: "",
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[url(/login-bg.png)] bg-cover bg-center flex flex-col poppins">
        <header className="w-full pl-12 pt-6 flex justify-between items-center z-10">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:scale-110 transition-transform"
          >
            <img
              src="/images/milhito/milhito-normal.png"
              alt="Logo"
              className="w-14 h-14 rotate-6"
            />
            <span className="text-xl font-bold text-white text-glow">
              ArraiApp
            </span>
          </Link>
        </header>
        <img
          className="w-36 hidden md:block fixed md:top-32 md:left-28 animate-float"
          src="/images/milhito/milhito-happy.png"
          alt="Milhito"
        />
        <img
          className="w-36 hidden md:block fixed md:top-36 md:right-20 animate-float"
          src="/images/couple.png"
          alt="Couple"
        />
        <img
          className="w-36 hidden md:block fixed md:bottom-20 md:left-56 animate-float"
          src="/images/couple-2.png"
          alt="Couple 2"
        />
        <img
          className="w-36 hidden md:block fixed md:bottom-20 md:right-36 animate-float"
          src="/images/milhito/milhito-winner.png"
          alt="Milhito"
        />
        <div className="absolute top-72 left-28 w-40 h-40 rounded-full bg-space-blue opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-60 right-20 w-60 h-60 rounded-full bg-space-purple opacity-20 blur-3xl animate-pulse"></div>

        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <Card className="shadow-xl border-opacity-30 dark:bg-slate-900/90 backdrop-blur-lg">
              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={switchTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastre-se</TabsTrigger>
                </TabsList>

                <CardContent className="p-6 pt-8">
                  <motion.div
                    key={activeTab}
                    initial={{
                      opacity: 0,
                      x: activeTab === "login" ? -20 : 20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 max-h-96 overflow-y-auto px-2"
                  >
                    <CardTitle className="text-2xl font-bold">
                      {activeTab === "login"
                        ? "Bem-vindo de volta"
                        : "Criar conta"}
                    </CardTitle>

                    <CardDescription>
                      {activeTab === "login"
                        ? "Digite suas credenciais para acessar sua conta"
                        : "Preencha seus dados para criar uma nova conta"}
                    </CardDescription>

                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-md">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {activeTab === "signup" && (
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-md font-medium">
                            Nome de Usuário
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="username"
                              name="username"
                              type="text"
                              required
                              value={formData.username}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="john_doe"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-md font-medium">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      {activeTab === "signup" && (
                        <div className="space-y-2">
                          <label htmlFor="cpf" className="text-md font-medium">
                            CPF
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="cpf"
                              name="cpf"
                              type="cpf"
                              required
                              value={formData.cpf}
                              onChange={handleChange}
                              className="pl-10"
                              placeholder="000.000.000-00"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label
                          htmlFor="password"
                          className="text-md font-medium"
                        >
                          Senha
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-10 pr-10"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <>
                            {activeTab === "login" ? "Login" : "Criar Conta"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </motion.div>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AuthPage;

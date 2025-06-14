import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { AuthProvider } from "./contexts/AuthContext";

const Index = lazy(() => import("./pages/Index"));
const Games = lazy(() => import("./pages/Games"));
const GameDetail = lazy(() => import("./pages/GameDetail"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Rewards = lazy(() => import("./pages/Rewards"));
const NotFound = lazy(() => import("./pages/NotFound"));

const TargetStrike = lazy(() => import("./pages/games/TargetStrike"));
const SnakeRush = lazy(() => import("./pages/games/SnakeRush"));
const FlashQuiz = lazy(() => import("./pages/games/FlashQuiz"));
const TapFrenzy = lazy(() => import("./pages/games/TapFrenzy"));
const MathClash = lazy(() => import("./pages/games/MathClash"));
const MemoryPulse = lazy(() => import("./pages/games/MemoryPulse"));
const TapXPRush = lazy(() => import("./pages/games/TapXPRush"));
const MemoryMatch = lazy(() => import("./pages/games/MemoryMatch"));
const ExplodingBalloons = lazy(() => import("./pages/games/ExplodingBalloons"));
const ReflexTest = lazy(() => import("./pages/games/ReflexTest"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense
                fallback={
                  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-purple-300 text-lg font-medium">
                        Carregando experiência...
                      </p>
                    </div>
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/games/:id" element={<GameDetail />} />
                  <Route path="/ranking" element={<Ranking />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/game/tiro-alvo" element={<TargetStrike />} />
                  <Route path="/game/snake-rush" element={<SnakeRush />} />
                  <Route path="/game/quiz-relampago" element={<FlashQuiz />} />
                  <Route path="/game/estoura-botoes" element={<TapFrenzy />} />
                  <Route path="/game/desafio-contas" element={<MathClash />} />
                  <Route
                    path="/game/sequencia-explosiva"
                    element={<MemoryPulse />}
                  />
                  <Route path="/game/tap-rush" element={<TapXPRush />} />
                  <Route path="/game/memory-match" element={<MemoryMatch />} />
                  <Route
                    path="/game/exploding-balloons"
                    element={<ExplodingBalloons />}
                  />
                  <Route path="/game/reflex-test" element={<ReflexTest />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>

            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

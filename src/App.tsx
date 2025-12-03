import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your pages
import Index from "./pages/Index";
import HomeScreen from "./components/HomePage";
import ProfileSummary from "./components/ProfileSummary";
import FaceScanner from "./components/FaceScanner";
import SweatAnalysis from "./components/SweatAnalysis";
import NotFound from "./pages/NotFound";

// Import the global score provider
import { ScoreProvider } from "./context/ScoreContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap everything inside the ScoreProvider */}
      <ScoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/profile" element={<ProfileSummary />} />
            <Route path="/facescanner" element={<FaceScanner />} />
            <Route path="/sweat" element={<SweatAnalysis />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ScoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

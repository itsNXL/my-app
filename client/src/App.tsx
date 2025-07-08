import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Home from "@/pages/home";
import Generation from "@/pages/generation";
import BabyTransform from "@/pages/baby-transform";
import Admin from "@/pages/admin";
import Gallery from "@/pages/gallery";
import Navigation from "@/components/navigation";
import BottomNav from "@/components/bottom-nav";
import NotFound from "@/pages/not-found";

export type Screen = "home" | "generation" | "baby-transform" | "admin" | "gallery";

function Router() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [selectedTheme, setSelectedTheme] = useState<any>(null);

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleThemeSelect = (theme: any) => {
    setSelectedTheme(theme);
    setCurrentScreen("generation");
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative overflow-hidden">
      <Navigation />
      
      <div className="relative">
        {currentScreen === "home" && (
          <Home onThemeSelect={handleThemeSelect} />
        )}
        {currentScreen === "generation" && (
          <Generation 
            theme={selectedTheme} 
            onBack={() => setCurrentScreen("home")} 
          />
        )}
        {currentScreen === "baby-transform" && (
          <BabyTransform onBack={() => setCurrentScreen("home")} />
        )}
        {currentScreen === "admin" && (
          <Admin onBack={() => setCurrentScreen("home")} />
        )}
        {currentScreen === "gallery" && (
          <Gallery onBack={() => setCurrentScreen("home")} />
        )}
      </div>
      
      <BottomNav 
        currentScreen={currentScreen} 
        onScreenChange={handleScreenChange} 
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

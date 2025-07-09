import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Splash from "@/pages/splash";
import Upload from "@/pages/upload";
import Filters from "@/pages/filters";
import Result from "@/pages/result";
import Admin from "@/pages/admin";
import { Theme } from "@shared/schema";

export type Screen = "splash" | "upload" | "filters" | "result" | "admin";

function Router() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  const handleStart = () => {
    setCurrentScreen("upload");
  };

  const handlePhotoSelected = (file: File) => {
    setSelectedFile(file);
    setCurrentScreen("filters");
  };

  const handleFilterSelected = (theme: Theme) => {
    setSelectedTheme(theme);
    setCurrentScreen("result");
  };

  const handleBackToHome = () => {
    setCurrentScreen("splash");
    setSelectedFile(null);
    setSelectedTheme(null);
  };

  const handleBackToUpload = () => {
    setCurrentScreen("upload");
    setSelectedTheme(null);
  };

  const handleBackToFilters = () => {
    setCurrentScreen("filters");
    setSelectedTheme(null);
  };

  // Admin access (hidden button on splash screen)
  const handleAdminAccess = () => {
    setCurrentScreen("admin");
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative overflow-hidden">
      <div className="relative">
        {currentScreen === "splash" && (
          <div className="relative">
            <Splash onStart={handleStart} />
            {/* Hidden admin access button */}
            <button
              onClick={handleAdminAccess}
              className="absolute bottom-4 left-4 w-8 h-8 opacity-0 hover:opacity-100 transition-opacity"
              aria-label="Admin access"
            >
              ⚙️
            </button>
          </div>
        )}
        {currentScreen === "upload" && (
          <Upload onBack={handleBackToHome} onPhotoSelected={handlePhotoSelected} />
        )}
        {currentScreen === "filters" && selectedFile && (
          <Filters 
            onBack={handleBackToUpload} 
            selectedFile={selectedFile}
            onFilterSelected={handleFilterSelected}
          />
        )}
        {currentScreen === "result" && selectedFile && selectedTheme && (
          <Result 
            onBack={handleBackToFilters}
            onHome={handleBackToHome}
            selectedFile={selectedFile}
            selectedTheme={selectedTheme}
          />
        )}
        {currentScreen === "admin" && (
          <Admin onBack={handleBackToHome} />
        )}
      </div>
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

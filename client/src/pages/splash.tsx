import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SplashProps {
  onStart: () => void;
}

export default function Splash({ onStart }: SplashProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary p-8">
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="hsl(247, 84%, 67%)"/>
            <path d="M2 17L12 22L22 17" stroke="hsl(247, 84%, 67%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="hsl(247, 84%, 67%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">AI Creator</h1>
        <p className="text-white/90 text-lg mb-2">Transform Your Photos</p>
        <p className="text-white/80 text-sm">Upload a photo and apply amazing AI filters</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/90 text-sm">Loading AI models...</p>
        </div>
      ) : (
        <div className="w-full max-w-xs">
          <Button 
            onClick={onStart}
            className="w-full bg-white text-primary hover:bg-gray-100 font-semibold py-3 rounded-xl"
          >
            Get Started
          </Button>
          <p className="text-white/70 text-xs text-center mt-4">
            Upload your photo to begin the transformation
          </p>
        </div>
      )}
    </div>
  );
}
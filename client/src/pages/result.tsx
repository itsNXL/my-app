import { useState, useEffect } from "react";
import { ArrowLeft, Download, Share, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Theme } from "@shared/schema";
import { useGenerateImage, useBabyTransform } from "@/hooks/use-generation";

interface ResultProps {
  onBack: () => void;
  onHome: () => void;
  selectedFile: File;
  selectedTheme: Theme;
}

export default function Result({ onBack, onHome, selectedFile, selectedTheme }: ResultProps) {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Initializing AI model...");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const generateImage = useGenerateImage();
  const babyTransform = useBabyTransform();
  const { toast } = useToast();

  const progressSteps = [
    { progress: 20, text: "Analyzing your photo..." },
    { progress: 40, text: "Preparing AI transformation..." },
    { progress: 60, text: "Applying selected filter..." },
    { progress: 80, text: "Enhancing image quality..." },
    { progress: 100, text: "Finalizing your creation..." }
  ];

  useEffect(() => {
    startGeneration();
  }, [selectedFile, selectedTheme]);

  const startGeneration = async () => {
    setProgress(0);
    setProgressText("Initializing AI model...");
    setShowResult(false);
    setGeneratedImage(null);

    // Simulate progress
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        const step = progressSteps[currentStep];
        setProgress(step.progress);
        setProgressText(step.text);
        currentStep++;
      } else {
        clearInterval(progressInterval);
      }
    }, 1500);

    try {
      let result;
      
      if (selectedTheme.category === "baby") {
        // Use baby transform for baby filter
        result = await babyTransform.mutateAsync({
          file: selectedFile,
          userId: 1,
        });
      } else {
        // Use regular theme generation
        result = await generateImage.mutateAsync({
          themeId: selectedTheme.id,
          userId: 1,
        });
      }

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("Transformation complete!");
      
      setTimeout(() => {
        setGeneratedImage(result.transformedImageUrl || result.imageUrl);
        setShowResult(true);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: "Generation Failed",
        description: "Failed to transform your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTheme.name}-transformed.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Image Downloaded",
        description: "Your transformed image has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Transformed with ${selectedTheme.name}`,
          text: `Check out my AI-transformed photo using ${selectedTheme.name} filter!`,
          url: generatedImage,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(generatedImage);
        toast({
          title: "Link Copied",
          description: "Image link has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Failed to share image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const isLoading = generateImage.isPending || babyTransform.isPending;

  return (
    <div className="p-6 pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-6 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-0 top-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {showResult ? "Your Transformation" : "Creating Magic"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {showResult 
            ? `Transformed with ${selectedTheme.name}` 
            : "Please wait while we transform your photo"
          }
        </p>
      </div>

      {/* Progress Bar */}
      {!showResult && (
        <div className="mb-8">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">{progressText}</p>
        </div>
      )}

      {/* Image Comparison */}
      <div className="mb-8">
        {showResult ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h3>
                <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transformed</h3>
                <div className="aspect-square rounded-xl overflow-hidden shadow-md">
                  <img
                    src={generatedImage || ""}
                    alt="Transformed"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Full Size Result */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <img
                src={generatedImage || ""}
                alt="Full size result"
                className="w-full rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center pulse-slow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">Transforming your photo...</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">This may take 15-30 seconds</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showResult && (
        <div className="space-y-3">
          <Button
            onClick={handleDownload}
            className="w-full gradient-primary text-white hover:opacity-90 py-3 text-lg font-semibold"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Image
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleShare}
              variant="secondary"
              className="py-3"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={startGeneration}
              variant="outline"
              className="py-3"
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
          
          <Button
            onClick={onHome}
            variant="outline"
            className="w-full py-3 mt-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Transform Another Photo
          </Button>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { ArrowLeft, Download, Share, RotateCcw } from "lucide-react";
import { useGenerateImage } from "@/hooks/use-generation";
import { Theme } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface GenerationProps {
  theme: Theme | null;
  onBack: () => void;
}

export default function Generation({ theme, onBack }: GenerationProps) {
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Initializing AI model...");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const generateImage = useGenerateImage();
  const { toast } = useToast();

  const progressSteps = [
    { progress: 20, text: "Analyzing theme parameters..." },
    { progress: 40, text: "Generating AI prompt..." },
    { progress: 60, text: "Creating image with OpenAI..." },
    { progress: 80, text: "Applying theme filters..." },
    { progress: 100, text: "Finalizing image..." }
  ];

  useEffect(() => {
    if (theme) {
      startGeneration();
    }
  }, [theme]);

  const startGeneration = async () => {
    if (!theme) return;
    
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
      const result = await generateImage.mutateAsync({
        themeId: theme.id,
        userId: 1, // TODO: Get from auth context
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText("Image generated successfully!");
      
      setTimeout(() => {
        setGeneratedImage(result.imageUrl);
        setShowResult(true);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: "Generation Failed",
        description: "Failed to generate image. Please try again.",
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
      a.download = `${theme?.name}-generated.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Image Downloaded",
        description: "Image has been saved to your device.",
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
          title: `AI Generated ${theme?.name} Image`,
          text: `Check out this amazing AI-generated image in ${theme?.name} style!`,
          url: generatedImage,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
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

  if (!theme) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">No theme selected</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="text-center mb-6 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-0 top-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Generate Image</h1>
        <p className="text-gray-600">
          Creating your <span className="font-medium">{theme.name}</span> style image
        </p>
      </div>

      <div className="mb-8">
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600">{progressText}</p>
      </div>

      <div className="bg-gray-100 rounded-xl p-8 mb-6 min-h-64 flex items-center justify-center">
        {!showResult ? (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center pulse-slow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Creating your image...</p>
            <p className="text-sm text-gray-500 mt-1">This may take 10-30 seconds</p>
          </div>
        ) : (
          <div className="w-full">
            <img
              src={generatedImage || ""}
              alt="Generated image"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>

      {showResult && (
        <div className="space-y-3">
          <Button
            onClick={handleDownload}
            className="w-full gradient-primary text-white hover:opacity-90"
          >
            <Download className="w-4 h-4 mr-2" />
            Save to Gallery
          </Button>
          <Button
            onClick={handleShare}
            variant="secondary"
            className="w-full"
          >
            <Share className="w-4 h-4 mr-2" />
            Share Image
          </Button>
          <Button
            onClick={startGeneration}
            variant="outline"
            className="w-full"
            disabled={generateImage.isPending}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Generate Again
          </Button>
        </div>
      )}
    </div>
  );
}

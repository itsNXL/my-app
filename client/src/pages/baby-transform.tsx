import { useState, useRef } from "react";
import { ArrowLeft, CloudUpload, Upload } from "lucide-react";
import { useBabyTransform } from "@/hooks/use-generation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BabyTransformProps {
  onBack: () => void;
}

export default function BabyTransform({ onBack }: BabyTransformProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const babyTransform = useBabyTransform();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setTransformedImage(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleTransform = async () => {
    if (!selectedFile) return;

    try {
      const result = await babyTransform.mutateAsync({
        file: selectedFile,
        userId: 1, // TODO: Get from auth context
      });

      setTransformedImage(result.transformedImageUrl);
      toast({
        title: "Transform Complete",
        description: "Your baby transformation is ready!",
      });
    } catch (error) {
      toast({
        title: "Transform Failed",
        description: "Failed to transform image. Please try again.",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-xl font-bold text-gray-900 mb-2">Baby Transform</h1>
        <p className="text-gray-600">Upload a photo to create a baby version</p>
      </div>

      <div className="mb-6">
        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
        >
          <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
            <CloudUpload className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-700 font-medium mb-2">Upload Your Photo</p>
          <p className="text-sm text-gray-500">JPG, PNG or WebP • Max 10MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-100 rounded-xl p-4 min-h-32">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Original</h3>
          <div className="bg-white rounded-lg h-24 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Original"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-xl p-4 min-h-32">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Baby Version</h3>
          <div className="bg-white rounded-lg h-24 flex items-center justify-center overflow-hidden">
            {transformedImage ? (
              <img
                src={transformedImage}
                alt="Baby version"
                className="w-full h-full object-cover"
              />
            ) : babyTransform.isPending ? (
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center pulse-slow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                </svg>
              </div>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V18C3 19.1 3.89 20 5 20H11V18H5V8H12V3H13.5L19 8.5V9H21Z" fill="currentColor"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      <Button
        onClick={handleTransform}
        disabled={!selectedFile || babyTransform.isPending}
        className="w-full gradient-primary text-white hover:opacity-90"
      >
        {babyTransform.isPending ? (
          <>
            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Transforming...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Transform to Baby
          </>
        )}
      </Button>
    </div>
  );
}

import { useState, useRef } from "react";
import { ArrowLeft, CloudUpload, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UploadProps {
  onBack: () => void;
  onPhotoSelected: (file: File) => void;
}

export default function Upload({ onBack, onPhotoSelected }: UploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = () => {
    if (selectedFile) {
      onPhotoSelected(selectedFile);
    }
  };

  return (
    <div className="p-6 pb-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-8 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-0 top-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upload Your Photo</h1>
        <p className="text-gray-600 dark:text-gray-300">Choose a photo to transform with AI filters</p>
      </div>

      <div className="mb-8">
        {previewUrl ? (
          <div className="relative mb-6">
            <img
              src={previewUrl}
              alt="Selected photo"
              className="w-full h-80 object-cover rounded-xl shadow-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleUploadClick}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            >
              Change Photo
            </Button>
          </div>
        ) : (
          <div
            onClick={handleUploadClick}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer bg-white dark:bg-gray-800"
          >
            <div className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center">
              <CloudUpload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Your Photo</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Choose a photo from your device
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JPG, PNG or WebP • Max 10MB
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleUploadClick}
          variant="outline"
          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary"
        >
          <ImageIcon className="w-5 h-5 mr-2" />
          Choose from Gallery
        </Button>

        <Button
          onClick={handleUploadClick}
          variant="outline"
          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary"
        >
          <Camera className="w-5 h-5 mr-2" />
          Take Photo
        </Button>
      </div>

      {selectedFile && (
        <div className="mt-8">
          <Button
            onClick={handleContinue}
            className="w-full gradient-primary text-white hover:opacity-90 py-3 text-lg font-semibold"
          >
            Continue to Filters
          </Button>
        </div>
      )}
    </div>
  );
}
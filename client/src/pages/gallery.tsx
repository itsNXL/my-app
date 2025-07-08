import { useState } from "react";
import { ArrowLeft, Download, Share } from "lucide-react";
import { useRecentImages } from "@/hooks/use-themes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface GalleryProps {
  onBack: () => void;
}

export default function Gallery({ onBack }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { data: images, isLoading } = useRecentImages(50);
  const { toast } = useToast();

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageName}-generated.png`;
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

  const handleShare = async (imageUrl: string, imageName: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Generated ${imageName} Image`,
          text: `Check out this amazing AI-generated image!`,
          url: imageUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(imageUrl);
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

  if (selectedImage) {
    return (
      <div className="p-4 pb-20">
        <div className="text-center mb-6 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedImage(null)}
            className="absolute left-0 top-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Image Details</h1>
          <p className="text-gray-600">Generated on {new Date(selectedImage.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="mb-6">
          <img
            src={selectedImage.imageUrl}
            alt="Generated image"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Generation Details</h3>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Prompt:</span> {selectedImage.originalPrompt}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Generation Time:</span> {selectedImage.generationTime}s
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Created:</span> {new Date(selectedImage.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handleDownload(selectedImage.imageUrl, `image-${selectedImage.id}`)}
            className="w-full gradient-primary text-white hover:opacity-90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
          <Button
            onClick={() => handleShare(selectedImage.imageUrl, `image-${selectedImage.id}`)}
            variant="secondary"
            className="w-full"
          >
            <Share className="w-4 h-4 mr-2" />
            Share Image
          </Button>
        </div>
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
        <h1 className="text-xl font-bold text-gray-900 mb-2">Image Gallery</h1>
        <p className="text-gray-600">Browse all generated images</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {images.map((image: any) => (
            <div
              key={image.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.imageUrl}
                alt="Generated image"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 gradient-primary rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-2">No Images Yet</p>
          <p className="text-sm text-gray-500">Generate your first image to see it here!</p>
        </div>
      )}
    </div>
  );
}
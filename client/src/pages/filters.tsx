import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Theme } from "@shared/schema";

interface FiltersProps {
  onBack: () => void;
  selectedFile: File;
  onFilterSelected: (theme: Theme) => void;
}

export default function Filters({ onBack, selectedFile, onFilterSelected }: FiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const { data: themes, isLoading } = useThemes();

  const categories = [
    { id: "all", label: "All Filters", count: themes?.length || 0 },
    { id: "games", label: "Games", count: themes?.filter(t => t.category === "games").length || 0 },
    { id: "movies", label: "Movies", count: themes?.filter(t => t.category === "movies").length || 0 },
    { id: "tv", label: "TV Shows", count: themes?.filter(t => t.category === "tv").length || 0 },
    { id: "baby", label: "Baby Transform", count: 1 },
  ];

  const filteredThemes = selectedCategory === "all" 
    ? themes || []
    : themes?.filter(theme => theme.category === selectedCategory) || [];

  const getFilterIcon = (category: string) => {
    switch (category) {
      case "games":
        return "🎮";
      case "movies":
        return "🎬";
      case "tv":
        return "📺";
      case "baby":
        return "👶";
      default:
        return "✨";
    }
  };

  const getGradientClass = (category: string) => {
    switch (category) {
      case "games":
        return "bg-gradient-to-br from-green-400 to-green-600";
      case "movies":
        return "bg-gradient-to-br from-purple-500 to-pink-600";
      case "tv":
        return "bg-gradient-to-br from-blue-400 to-purple-500";
      case "baby":
        return "bg-gradient-to-br from-pink-400 to-rose-500";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  };

  // Special baby transformation theme
  const babyTheme: Theme = {
    id: -1,
    name: "Baby Transform",
    description: "Transform into a cute baby version",
    category: "baby",
    prompt: "Transform this person into a cute baby version while maintaining their key facial features and characteristics",
    previewImage: null,
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const displayThemes = selectedCategory === "baby" ? [babyTheme] : filteredThemes;

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Filter</h1>
        <p className="text-gray-600 dark:text-gray-300">Select an AI filter to transform your photo</p>
      </div>

      {/* Selected Photo Preview */}
      <div className="mb-6">
        <div className="relative w-24 h-24 mx-auto rounded-xl overflow-hidden shadow-md">
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Selected photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <span className="mr-2">{getFilterIcon(category.id)}</span>
            {category.label}
            <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700">
              {category.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Filters Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : displayThemes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {displayThemes.map((theme) => (
            <Card
              key={theme.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onFilterSelected(theme)}
            >
              <div className={`h-32 ${getGradientClass(theme.category)} relative overflow-hidden`}>
                {theme.previewImage ? (
                  <img
                    src={theme.previewImage}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">
                      {getFilterIcon(theme.category)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {theme.category.charAt(0).toUpperCase() + theme.category.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{theme.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{theme.description}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">No filters available</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
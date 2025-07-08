import { useState } from "react";
import { useThemes, useRecentImages } from "@/hooks/use-themes";
import { Theme } from "@shared/schema";
import CategoryTabs from "@/components/category-tabs";
import ThemeGrid from "@/components/theme-grid";
import { Skeleton } from "@/components/ui/skeleton";

interface HomeProps {
  onThemeSelect: (theme: Theme) => void;
}

export default function Home({ onThemeSelect }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState("games");
  const { data: themes, isLoading: themesLoading } = useThemes(selectedCategory);
  const { data: recentImages, isLoading: recentLoading } = useRecentImages();

  return (
    <div className="p-4 pb-20">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Amazing Images</h1>
        <p className="text-gray-600">Choose a theme and let AI bring your ideas to life</p>
      </div>

      <CategoryTabs 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {themesLoading ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ThemeGrid themes={themes || []} onThemeSelect={onThemeSelect} />
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Generations</h2>
        {recentLoading ? (
          <div className="flex space-x-3 overflow-x-auto">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="flex-shrink-0 w-20 h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="flex space-x-3 overflow-x-auto">
            {recentImages?.map((image: any) => (
              <div
                key={image.id}
                className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={image.imageUrl}
                  alt="Recent generation"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Gamepad2, Film, Tv, Baby } from "lucide-react";

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const categories = [
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "movies", label: "Movies", icon: Film },
    { id: "tv", label: "TV Shows", icon: Tv },
    { id: "baby", label: "Baby Transform", icon: Baby },
  ];

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

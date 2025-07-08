import { Theme } from "@shared/schema";
import { Card } from "@/components/ui/card";

interface ThemeGridProps {
  themes: Theme[];
  onThemeSelect: (theme: Theme) => void;
}

export default function ThemeGrid({ themes, onThemeSelect }: ThemeGridProps) {
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

  if (themes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No themes available for this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {themes.map((theme) => (
        <Card
          key={theme.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onThemeSelect(theme)}
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
                <span className="text-white text-lg font-medium">
                  {theme.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 mb-1">{theme.name}</h3>
            <p className="text-sm text-gray-600">{theme.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

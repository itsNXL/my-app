import { Home, Images, Baby, Settings } from "lucide-react";
import { Screen } from "@/App";

interface BottomNavProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export default function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const navItems = [
    { screen: "home" as Screen, icon: Home, label: "Home" },
    { screen: "gallery" as Screen, icon: Images, label: "Gallery" },
    { screen: "baby-transform" as Screen, icon: Baby, label: "Baby" },
    { screen: "admin" as Screen, icon: Settings, label: "Admin" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;
          
          return (
            <button
              key={item.screen}
              onClick={() => onScreenChange(item.screen)}
              className={`flex flex-col items-center py-2 transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

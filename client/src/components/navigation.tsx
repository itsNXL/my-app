import { History, UserCircle } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">AI Creator</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <History className="w-5 h-5" />
        </button>
        <button className="text-gray-600 hover:text-gray-900 transition-colors">
          <UserCircle className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

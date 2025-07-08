import { useState } from "react";
import { ArrowLeft, Plus, Edit2, Trash2, MoreVertical } from "lucide-react";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ThemeFormDialog from "@/components/theme-form-dialog";
import { useAnalytics } from "@/hooks/use-analytics";
import type { Theme } from "@shared/schema";

interface AdminProps {
  onBack: () => void;
}

export default function Admin({ onBack }: AdminProps) {
  const [activeTab, setActiveTab] = useState("themes");
  const { data: themes, isLoading } = useThemes();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteTheme = useMutation({
    mutationFn: async (themeId: number) => {
      const response = await apiRequest("DELETE", `/api/themes/${themeId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/themes"] });
      toast({
        title: "Theme Deleted",
        description: "Theme has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete theme. Please try again.",
        variant: "destructive",
      });
    },
  });

  const tabs = [
    { id: "themes", label: "Themes" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  const renderThemesList = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-full mb-3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-20" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {themes?.map((theme) => (
          <Card key={theme.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant={theme.isActive ? "default" : "secondary"}>
                    {theme.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Category: {theme.category.charAt(0).toUpperCase() + theme.category.slice(1)}
              </p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                Prompt: {theme.prompt}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  Used {theme.usageCount} times
                </span>
                <div className="flex space-x-2">
                  <ThemeFormDialog theme={theme}>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </ThemeFormDialog>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-red-600"
                    onClick={() => deleteTheme.mutate(theme.id)}
                    disabled={deleteTheme.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 pb-20">
      <div className="mb-6 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="absolute left-0 top-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage themes and AI prompts</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-primary border-primary"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "themes" && (
        <>
          <div className="mb-6">
            <ThemeFormDialog />
          </div>
          {renderThemesList()}
        </>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {analyticsLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : analytics ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary">{analytics.totalImages}</div>
                    <p className="text-sm text-gray-600">Total Images</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary">{analytics.totalThemes}</div>
                    <p className="text-sm text-gray-600">Active Themes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary">{analytics.totalGenerations}</div>
                    <p className="text-sm text-gray-600">Total Generations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary">{analytics.recentGenerations}</div>
                    <p className="text-sm text-gray-600">Recent (7 days)</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Category Usage</h3>
                  <div className="space-y-2">
                    {Object.entries(analytics.categoryUsage).map(([category, count]: [string, any]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{category}</span>
                        <Badge variant="secondary">{count} uses</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Most Popular Themes</h3>
                  <div className="space-y-2">
                    {analytics.popularThemes.map((theme: any, index: number) => (
                      <div key={theme.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{index + 1}. {theme.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({theme.category})</span>
                        </div>
                        <Badge variant="secondary">{theme.usageCount} uses</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No analytics data available</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && (
        <div className="text-center py-12">
          <p className="text-gray-500">Settings coming soon...</p>
        </div>
      )}
    </div>
  );
}

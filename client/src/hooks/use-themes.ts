import { useQuery } from "@tanstack/react-query";
import { Theme } from "@shared/schema";

export function useThemes(category?: string) {
  return useQuery<Theme[]>({
    queryKey: ["/api/themes", category],
    queryFn: async () => {
      const url = category ? `/api/themes?category=${category}` : "/api/themes";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch themes");
      }
      return response.json();
    },
  });
}

export function useRecentImages(limit = 6) {
  return useQuery({
    queryKey: ["/api/recent-images", limit],
    queryFn: async () => {
      const response = await fetch(`/api/recent-images?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recent images");
      }
      return response.json();
    },
  });
}

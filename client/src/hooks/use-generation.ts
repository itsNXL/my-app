import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useGenerateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ themeId, userId }: { themeId: number; userId?: number }) => {
      const response = await apiRequest(
        "POST",
        `/api/generate/${themeId}`,
        { userId }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recent-images"] });
    },
  });
}

export function useBabyTransform() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, userId }: { file: File; userId?: number }) => {
      const formData = new FormData();
      formData.append("photo", file);
      if (userId) {
        formData.append("userId", userId.toString());
      }

      const response = await fetch("/api/baby-transform", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process baby transformation");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/baby-transforms"] });
    },
  });
}

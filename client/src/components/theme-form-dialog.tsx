import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertThemeSchema, type Theme, type InsertTheme } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2 } from "lucide-react";

interface ThemeFormDialogProps {
  theme?: Theme;
  children?: React.ReactNode;
}

export default function ThemeFormDialog({ theme, children }: ThemeFormDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<InsertTheme>({
    resolver: zodResolver(insertThemeSchema),
    defaultValues: {
      name: theme?.name || "",
      description: theme?.description || "",
      category: theme?.category || "games",
      prompt: theme?.prompt || "",
      previewImage: theme?.previewImage || "",
      isActive: theme?.isActive ?? true,
    },
  });

  const createTheme = useMutation({
    mutationFn: async (data: InsertTheme) => {
      const response = await apiRequest("POST", "/api/themes", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/themes"] });
      toast({
        title: "Theme Created",
        description: "New theme has been added successfully.",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create theme. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTheme = useMutation({
    mutationFn: async (data: InsertTheme) => {
      const response = await apiRequest("PUT", `/api/themes/${theme!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/themes"] });
      toast({
        title: "Theme Updated",
        description: "Theme has been updated successfully.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update theme. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertTheme) => {
    if (theme) {
      updateTheme.mutate(data);
    } else {
      createTheme.mutate(data);
    }
  };

  const isLoading = createTheme.isPending || updateTheme.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full gradient-primary text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Theme
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {theme ? "Edit Theme" : "Create New Theme"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Theme Name</Label>
            <Input
              id="name"
              placeholder="Enter theme name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Brief description of the theme"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(value) => form.setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="games">Games</SelectItem>
                <SelectItem value="movies">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
                <SelectItem value="baby">Baby Transform</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.category && (
              <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">AI Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Detailed prompt for AI image generation"
              rows={4}
              {...form.register("prompt")}
            />
            {form.formState.errors.prompt && (
              <p className="text-sm text-red-600">{form.formState.errors.prompt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="previewImage">Preview Image URL (Optional)</Label>
            <Input
              id="previewImage"
              placeholder="https://example.com/preview.jpg"
              {...form.register("previewImage")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Active Theme</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gradient-primary text-white hover:opacity-90"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {theme ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {theme ? <Edit2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {theme ? "Update Theme" : "Create Theme"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
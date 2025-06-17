import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import type { Category } from "@/models/interfaces/area-Category";

export function useCrearPageViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const categorias = await axios.get<Category[]>(
        `${API_URL}/api/categorias`
      );
      setCategories(categorias.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (
    newCategory: Omit<Category, "id" | "areas">
  ) => {
    try {
      await axios.post<Category>(
        `${API_URL}/api/categorias`,
        newCategory
      );
      console.log("Categoría creada correctamente:", newCategory);
      fetchData();
      toast.success("La categoría se registro correctamente.");
      setIsCreateModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
      console.error("Error creating category:", error);
    }
  };

  const getGradeLabel = (grade: number) => {
    if (grade <= 6) return `${grade}° Primaria`;
    return `${grade - 6}° Secundaria`;
  };

  return {
    categories,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleCreateCategory,
    getGradeLabel,
  };
} 
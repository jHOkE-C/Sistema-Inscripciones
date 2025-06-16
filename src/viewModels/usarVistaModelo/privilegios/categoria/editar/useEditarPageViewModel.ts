import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import type { Category } from "@/models/interfaces/area-Category";

export function useEditarPageViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

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

  const handleEditCategory = async (
    categoria_id: number,
    updates: { minimo_grado: number; maximo_grado: number }
  ) => {
    try {
      await axios.put(
        `${API_URL}/api/categorias/${categoria_id}`,
        updates
      );
      fetchData();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      toast.success("Categoría editada correctamente.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
      console.error("Error editing category:", error);
    }
  };

  const getGradeLabel = (grade: number) => {
    if (grade <= 6) return `${grade}° Primaria`;
    return `${grade - 6}° Secundaria`;
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  return {
    categories,
    isEditModalOpen,
    selectedCategory,
    handleEditCategory,
    getGradeLabel,
    openEditModal,
    closeEditModal,
  };
} 
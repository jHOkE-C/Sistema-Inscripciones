import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import type { Category, Area } from "@/models/interfaces/area-Category";

export function useGestionadorViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [availableAreas, setAvailableAreas] = useState<Area[]>([]);

  const fetchData = async () => {
    try {
      const areas = await axios.get<Area[]>(`${API_URL}/api/areas`);
      setAvailableAreas(areas.data);
      const categorias = await axios.get<Category[]>(
        `${API_URL}/api/categorias/areas`
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
      await axios.post<Category>(`${API_URL}/api/categorias`, newCategory);
      console.log("Categoría creada correctamente:", newCategory);
      fetchData();
      toast.success("Categoría creada correctamente.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
      console.error("Error creating category:", error);
    }
    setIsCreateModalOpen(false);
  };

  const handleEditCategory = async (
    categoria_id: number,
    updates: { minimo_grado: number; maximo_grado: number }
  ) => {
    try {
      await axios.put(`${API_URL}/api/categorias/${categoria_id}`, updates);
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

  const handleDeleteCategory = async (categoria_id: number) => {
    try {
      await axios.delete(`${API_URL}/api/categorias/${categoria_id}`);
      fetchData();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      toast.success("Categoría eliminada correctamente.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
    }
  };

  const handleAddAreaToCategory = async (
    categoria_id: number,
    area_id: number
  ) => {
    try {
      await axios.post(`${API_URL}/api/categoria/area`, {
        area_id,
        categoria_id,
      });
      fetchData();
      setIsAddAreaModalOpen(false);
      setSelectedCategory(null);
      toast.success("Área añadida a la categoría correctamente.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
    }
  };

  const handleRemoveAreaFromCategory = async (
    categoria_id: number,
    area_id: number
  ) => {
    try {
      await axios.delete(`${API_URL}/api/categoria/area`, {
        data: { area_id, categoria_id },
      });
      fetchData();
      toast.success("Área eliminada de la categoría correctamente.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
    }
  };

  const openAddAreaModal = (category: Category) => {
    setSelectedCategory(category);
    setIsAddAreaModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const getGradeLabel = (grade: number) => {
    if (grade <= 6) return `${grade}° Primaria`;
    return `${grade - 6}° Secundaria`;
  };

  return {
    categories,
    isCreateModalOpen,
    isAddAreaModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedCategory,
    availableAreas,
    setIsCreateModalOpen,
    setIsAddAreaModalOpen,
    setIsEditModalOpen,
    setIsDeleteModalOpen,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddAreaToCategory,
    handleRemoveAreaFromCategory,
    openAddAreaModal,
    openEditModal,
    openDeleteModal,
    getGradeLabel
  };
} 
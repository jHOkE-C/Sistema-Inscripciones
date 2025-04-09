"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, X } from "lucide-react";

import type { Category, Area } from "./types";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
import CreateCategoryModal from "./create-category-modal";
import AddAreaModal from "./add-modal";
import EditCategoryModal from "./edit-modal";
import DeleteConfirmationModal from "./delete-modal";
import { toast } from "sonner";

export default function Gestionador() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddAreaModalOpen, setIsAddAreaModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-zinc-600 ">
          Crea, modifica, y añade areas a un categoria
        </h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Crear Categoría
        </Button>
      </div>

      <Table className="mb-10">
        <TableHeader>
          <TableRow>
            <TableHead>Categoria</TableHead>
            <TableHead>Grado Mínimo</TableHead>
            <TableHead>Grado Máximo</TableHead>
            <TableHead>Áreas</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.nombre}</TableCell>
              <TableCell>{getGradeLabel(category.minimo_grado)}</TableCell>
              <TableCell>{getGradeLabel(category.maximo_grado)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {category.areas.length > 0 ? (
                    category.areas.map((area) => (
                      <Badge
                        key={area.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {area.nombre}
                        <button
                          onClick={() =>
                            handleRemoveAreaFromCategory(category.id, area.id)
                          }
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={`Eliminar área ${area.nombre}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Sin áreas
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAddAreaModal(category)}
                  >
                    <Plus className="mr-1 h-3 w-3" /> Añadir Área
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(category)}
                  >
                    <Edit className="mr-1 h-3 w-3" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => openDeleteModal(category)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" /> Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCategory={handleCreateCategory}
      />

      {selectedCategory && (
        <>
          <AddAreaModal
            isOpen={isAddAreaModalOpen}
            onClose={() => {
              setIsAddAreaModalOpen(false);
              setSelectedCategory(null);
            }}
            category={selectedCategory}
            availableAreas={availableAreas.filter(
              (area) => !selectedCategory.areas.some((a) => a.id === area.id)
            )}
            onAddArea={(area_id) =>
              handleAddAreaToCategory(selectedCategory.id, area_id)
            }
          />

          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedCategory(null);
            }}
            category={selectedCategory}
            onEditCategory={(updates) =>
              handleEditCategory(selectedCategory.id, updates)
            }
          />

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedCategory(null);
            }}
            category={selectedCategory}
            onConfirmDelete={() => handleDeleteCategory(selectedCategory.id)}
          />
        </>
      )}
    </div>
  );
}

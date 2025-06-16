"use client";

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
import CreateCategoryModal from "./create-category-modal";
import AddAreaModal from "./add-modal";
import EditCategoryModal from "./edit-modal";
import DeleteConfirmationModal from "./delete-modal";
import { useGestionadorViewModel } from "@/viewModels/usarVistaModelo/privilegios/categoria/useGestionadorViewModel";

export default function Gestionador() {
  const {
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
  } = useGestionadorViewModel();

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
            onClose={() => setIsAddAreaModalOpen(false)}
            onAddArea={(areaId) => handleAddAreaToCategory(selectedCategory.id, areaId)}
            category={selectedCategory}
            availableAreas={availableAreas.filter(
              (area) => !selectedCategory.areas.some((a) => a.id === area.id)
            )}
          />

          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditCategory={(updates) => handleEditCategory(selectedCategory.id, updates)}
            category={selectedCategory}
          />

          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirmDelete={() => handleDeleteCategory(selectedCategory.id)}
            category={selectedCategory}
          />
        </>
      )}
    </div>
  );
}

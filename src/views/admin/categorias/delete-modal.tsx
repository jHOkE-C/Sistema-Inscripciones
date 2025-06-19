"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alertDialog";
import type { Category } from "@/models/interfaces/areas&categorias";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onConfirmDelete: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  category,
  onConfirmDelete,
}: DeleteConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la categoría{" "}
            <strong>{category.nombre}</strong> y no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-blue-500 text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

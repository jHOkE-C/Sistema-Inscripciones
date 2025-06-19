import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import type { Category } from "@/models/interfaces/areas&categorias";

export function useDarDeBajaPageViewModel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [disabledCategories, setDisabledCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [action, setAction] = useState<"deactivate" | "activate" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Carga inicial de todas las categorías
  const fetchData = async () => {
    try {
      const { data } = await axios.get<Category[]>(`${API_URL}/api/categorias`);
      // asumimos que 'vigente' indica activas
      setCategories(data.filter((c) => c.vigente ?? true));
      setDisabledCategories(data.filter((c) => !c.vigente));
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar categorías");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getGradeLabel = (grade: number) =>
    grade <= 6 ? `${grade}° Primaria` : `${grade - 6}° Secundaria`;

  // Abrir diálogo, pasando también la acción deseada
  const openDialog = (cat: Category, actionType: "deactivate" | "activate") => {
    setSelected(cat);
    setAction(actionType);
    setDialogOpen(true);
  };

  // Al confirmar en el diálogo, hacemos PUT al endpoint correcto
  const handleConfirm = async () => {
    if (!selected || !action) return;

    try {
      if (action === "deactivate") {
        await axios.put(`${API_URL}/api/categorias/${selected.id}/deactivate`);
        toast.success(`Se dio de baja la categoría "${selected.nombre}"`);
        // la quitamos de activas y la añadimos a deshabilitadas
        setCategories((prev) => prev.filter((c) => c.id !== selected.id));
        setDisabledCategories((prev) => [...prev, selected]);
      } else {
        await axios.put(`${API_URL}/api/categorias/${selected.id}/activate`);
        toast.success(`Se habilitó la categoría "${selected.nombre}"`);
        // la quitamos de deshabilitadas y la añadimos a activas
        setDisabledCategories((prev) =>
          prev.filter((c) => c.id !== selected.id)
        );
        setCategories((prev) => [...prev, selected]);
      }
    } catch (e) {
      console.error(e);
      toast.error(
        action === "deactivate"
          ? "Ocurrió un error al dar de baja la categoría"
          : "Ocurrió un error al habilitar la categoría"
      );
    } finally {
      setDialogOpen(false);
      setSelected(null);
      setAction(null);
    }
  };

  return {
    categories,
    disabledCategories,
    selected,
    action,
    dialogOpen,
    setDialogOpen,
    getGradeLabel,
    openDialog,
    handleConfirm,
  };
}

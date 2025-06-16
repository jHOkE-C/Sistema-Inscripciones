import { useState, useEffect } from "react";
import { request } from "@/models/api/request";
import { getOlimpiada } from "@/models/api/olimpiada";
import type { Area, Categoria } from "@/models/api/areas";
import type { Olimpiada } from "@/models/interfaces/versiones.type";
import { toast } from "sonner";

export const useAsociarCategoriasViewModel = (olimpiada_id: string) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [initialChecked, setInitialChecked] = useState<number[]>([]);
  const [searchArea, setSearchArea] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [olimpiada, setOlimpiada] = useState<Olimpiada>();

  useEffect(() => {
    loadData();
    fetchOlimpiada();
  }, []);

  const fetchOlimpiada = async () => {
    const olimpiada = await getOlimpiada(olimpiada_id);
    setOlimpiada(olimpiada);
  };

  const loadData = async () => {
    try {
      const [areasData, catsData] = await Promise.all([
        request<Area[]>(`/api/areas/categorias/olimpiada/${olimpiada_id}`),
        request<Categoria[]>("/api/categorias"),
      ]);

      setAreas(areasData);
      await setCategories(catsData);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al cargar datos");
    }
  };

  const openDialog = (area: Area) => {
    setSelectedArea(area);
    const ids = area.categorias?.filter((v) => v).map((c) => Number(c.id)) || [];
    setInitialChecked(ids);
    setChecked(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
    setSearchCategory("");
    setDialogOpen(true);
  };

  const toggleCategory = (id: number) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = async () => {
    if (!selectedArea) return;
    const selectedIds = Object.entries(checked)
      .filter(([, v]) => v)
      .map(([k]) => Number(k));
    const toAdd = selectedIds.filter((id) => !initialChecked.includes(id));
    const toRemove = initialChecked.filter((id) => !selectedIds.includes(id));
    try {
      await request("/api/categorias/area/olimpiada", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_area: Number(selectedArea.id),
          id_olimpiada: Number(olimpiada_id),
          agregar: toAdd,
          quitar: toRemove,
        }),
      });
      toast.success("Se asociaron las categorías exitosamente");
      setDialogOpen(false);
      loadData();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al guardar");
    }
  };

  const filteredAreas = areas.filter((a) =>
    a.nombre.toLowerCase().includes(searchArea.toLowerCase())
  );

  const selectedCount = Object.values(checked).filter(Boolean).length;

  return {
    areas,
    categories,
    selectedArea,
    checked,
    initialChecked,
    searchArea,
    searchCategory,
    dialogOpen,
    olimpiada,
    filteredAreas,
    selectedCount,
    setSearchArea,
    setSearchCategory,
    setDialogOpen,
    openDialog,
    toggleCategory,
    handleSave
  };
}; 
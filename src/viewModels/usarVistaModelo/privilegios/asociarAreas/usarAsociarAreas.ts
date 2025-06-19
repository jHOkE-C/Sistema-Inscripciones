import { useState, useEffect } from "react";
import { toast } from "sonner";
import { apiClient, request } from "@/models/api/solicitudes";
import type { Area } from "@/models/api/areas";
import type { Olimpiada } from "@/models/interfaces/versiones";
import { getOlimpiada } from "@/models/api/olimpiada";

export const useUsarAsociarAreas = (olimpiada_id: string) => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [associatedIds, setAssociatedIds] = useState<Set<string>>(new Set());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area>();
  const [associatedAreas, setAssociatedAreas] = useState<Area[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchAssociatedTerm, setSearchAssociatedTerm] = useState("");
  const [olimpiada, setOlimpiada] = useState<Olimpiada>();

  useEffect(() => {
    fetchAreas();
    fetchAssociated();
    fetchOlimpiada();
  }, []);

  const fetchAreas = async () => {
    try {
      const data = await request<Area[]>("/api/areas", { method: "GET" });
      setAreas(data.filter((a) => a.vigente));
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al cargar áreas");
    }
  };

  const fetchOlimpiada = async () => {
    const olimpiada = await getOlimpiada(olimpiada_id);
    setOlimpiada(olimpiada);
  };

  const fetchAssociated = async () => {
    try {
      const data = await request<Area[]>(
        `/api/areas/categorias/olimpiada/${olimpiada_id}`
      );
      setAssociatedAreas(data);
      setAssociatedIds(new Set(data.map((a) => a.id)));
    } catch (e: unknown) {
      toast.error(
        e instanceof Error ? e.message : "Error al cargar áreas asociadas"
      );
    }
  };

  const handleAssociate = async (area: Area) => {
    try {
      await apiClient.post("/api/olimpiada/area", {
        area_id: area.id,
        olimpiada_id,
      });
      setAssociatedIds((prev) => new Set(prev).add(area.id));
      setAssociatedAreas((prev) => [...prev, area]);
      toast.success("Área asociada correctamente");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al asociar área");
    }
  };

  const handleUnassociate = async () => {
    if (!selectedArea) return;
    const { id } = selectedArea;
    try {
      await request("/api/olimpiada/area", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area_id: id, olimpiada_id }),
      });
      setAssociatedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setAssociatedAreas((prev) => prev.filter((a) => a.id !== id));
      toast.success("Área desasociada correctamente");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al desasociar área");
    } finally {
      setOpenDialog(false);
    }
  };

  const availableAreas = areas
    .filter((a) => !associatedIds.has(a.id))
    .filter((a) => a.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredAssociatedAreas = associatedAreas.filter((a) =>
    a.nombre.toLowerCase().includes(searchAssociatedTerm.toLowerCase())
  );

  return {
    areas,
    associatedIds,
    openDialog,
    setOpenDialog,
    selectedArea,
    setSelectedArea,
    associatedAreas,
    searchTerm,
    setSearchTerm,
    searchAssociatedTerm,
    setSearchAssociatedTerm,
    olimpiada,
    availableAreas,
    filteredAssociatedAreas,
    handleAssociate,
    handleUnassociate,
  };
};

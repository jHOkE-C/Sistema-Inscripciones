import { useState, useEffect } from "react";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { SortingState, ColumnFiltersState, VisibilityState, FilterFn } from "@tanstack/react-table";

export interface Postulante {
  id: string;
  nombre: string;
  apellidos: string;
  ci: string;
  fechaNac: string;
  area: string;
  categoria: string;
  departamento: string;
  provincia: string;
  colegio: string;
  grado: string;
  responsable: string;
  responsableCi: string;
  estado: "Preinscrito" | "Pago Pendiente" | "Inscripcion Completa";
}

interface OlimpiadaResponse {
  nombre: string;
}

export const useReportesViewModel = (olimpiada_id: string) => {
  const [nombreOlimpiada, setNombreOlimpiada] = useState<string>("");
  const [postulantes, setPostulantes] = useState<Postulante[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [yearsFilter, setYearsFilter] = useState<string[]>([]);
  const [areasFilter, setAreasFilter] = useState<string[]>([]);
  const [categoriasFilter, setCategoriasFilter] = useState<string[]>([]);
  const [departamentosFilter, setDepartamentosFilter] = useState<string[]>([]);
  const [provinciasFilter, setProvinciasFilter] = useState<string[]>([]);
  const [colegiosFilter, setColegiosFilter] = useState<string[]>([]);
  const [gradosFilter, setGradosFilter] = useState<string[]>([]);
  const [estadosFilter] = useState<string[]>(["Preinscrito", "Pago Pendiente", "Inscripcion Completa"]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [datosOlimpiada, datosPostulantes] = await Promise.all([
          fetch(`${API_URL}/api/olimpiadas/${olimpiada_id}`).then(res => res.json() as Promise<OlimpiadaResponse>),
          fetch(`${API_URL}/api/olimpiadas/${olimpiada_id}/reporteDeInscripciones`).then(res => res.json() as Promise<Postulante[]>)
        ]);
        
        setNombreOlimpiada(datosOlimpiada.nombre || "Olimpiada");
        setPostulantes(datosPostulantes);
        
        const years = [...new Set(datosPostulantes
          .map((p: Postulante) => {
            try {
              if (!p.fechaNac) return null;
              return new Date(p.fechaNac).getFullYear().toString();
            } catch {
              return null;
            }
          })
          .filter((year): year is string => year !== null))];
        
        years.sort((a, b) => parseInt(b) - parseInt(a));
        setYearsFilter(years);

        // Set other filters with proper type assertions
        setAreasFilter([...new Set(datosPostulantes.map(p => p.area))].filter((area): area is string => area !== undefined));
        setCategoriasFilter([...new Set(datosPostulantes.map(p => p.categoria))].filter((cat): cat is string => cat !== undefined));
        setDepartamentosFilter([...new Set(datosPostulantes.map(p => p.departamento))].filter((dep): dep is string => dep !== undefined));
        setProvinciasFilter([...new Set(datosPostulantes.map(p => p.provincia))].filter((prov): prov is string => prov !== undefined));
        setColegiosFilter([...new Set(datosPostulantes.map(p => p.colegio))].filter((col): col is string => col !== undefined));
        setGradosFilter([...new Set(datosPostulantes.map(p => p.grado))].filter((grado): grado is string => grado !== undefined));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [olimpiada_id]);

  const handleGenerarPdf = () => {
    setIsModalOpen(true);
  };

  return {
    nombreOlimpiada,
    postulantes,
    isLoading,
    isModalOpen,
    selectedYear,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    globalFilter,
    yearsFilter,
    areasFilter,
    categoriasFilter,
    departamentosFilter,
    provinciasFilter,
    colegiosFilter,
    gradosFilter,
    estadosFilter,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    setGlobalFilter,
    setSelectedYear,
    setIsModalOpen,
    handleGenerarPdf
  };
};

export const yearFilterFn: FilterFn<Postulante> = (row, columnId, filterValue) => {
  if (!filterValue || filterValue === "all") return true;
  
  const fechaNac = row.getValue(columnId) as string;
  if (!fechaNac) return false;
  
  try {
    const year = new Date(fechaNac).getFullYear().toString();
    return year === filterValue;
  } catch (error) {
    console.error("Error al filtrar por año:", error);
    return false;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString || "N/A";
  }
};

export const getGradoNumerico = (grado: string): number => {
  const numero = parseInt(grado.replace(/\D/g, ''));
  return isNaN(numero) ? 0 : numero;
};

export const formatGrado = (grado: string): string => {
  const gradoNum = parseInt(grado.replace(/\D/g, ''));
  if (isNaN(gradoNum)) return grado;
  
  if (gradoNum <= 6) {
    return `${gradoNum}° P`;
  } else {
    return `${gradoNum - 6}° S`;
  }
};

export const sortGrados = (grados: string[]): string[] => {
  const gradosOrdenados = [...grados];
  return gradosOrdenados.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''));
    const numB = parseInt(b.replace(/\D/g, ''));
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });
}; 
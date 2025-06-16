import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { API_URL } from "@/viewModels/hooks/useApiRequest";

interface Postulante {
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

const sortGrados = (grados: string[]): string[] => {
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

const yearFilterFn: FilterFn<Postulante> = (row, columnId, filterValue) => {
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

const formatDate = (dateString: string): string => {
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

const getGradoNumerico = (grado: string): number => {
  const numero = parseInt(grado.replace(/\D/g, ''));
  return isNaN(numero) ? 0 : numero;
};

const formatGrado = (grado: string): string => {
  const gradoNum = parseInt(grado.replace(/\D/g, ''));
  if (isNaN(gradoNum)) return grado;
  if (gradoNum <= 6) {
    return `${gradoNum}° P`;
  } else {
    return `${gradoNum - 6}° S`;
  }
};

export function useReportesOlimpiada() {
  const params = useParams();
  const olimpiada_id = params?.olimpiada_id as string;
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
          fetch(`${API_URL}/api/olimpiadas/${olimpiada_id}`).then(res => res.json()),
          fetch(`${API_URL}/api/olimpiadas/${olimpiada_id}/reporteDeInscripciones`).then(res => res.json())
        ]);
        
        setNombreOlimpiada(datosOlimpiada.nombre || "Olimpiada");
        setPostulantes(datosPostulantes as Postulante[]);
        
        const years = [...new Set(datosPostulantes
          .map((p: Postulante) => {
            try {
              if (!p.fechaNac) return null;
              return new Date(p.fechaNac).getFullYear().toString();
            } catch {
              return null;
            }
          })
          .filter(Boolean))] as string[];
        
        years.sort((a, b) => parseInt(b) - parseInt(a));
        setYearsFilter(years);
        
        const areas = [...new Set(datosPostulantes.map((p: Postulante) => p.area))].filter(Boolean) as string[];
        setAreasFilter(areas);
        
        const categorias = [...new Set(datosPostulantes.map((p: Postulante) => p.categoria))].filter(Boolean) as string[];
        setCategoriasFilter(categorias);
        
        const departamentos = [...new Set(datosPostulantes.map((p: Postulante) => p.departamento))].filter(Boolean) as string[];
        setDepartamentosFilter(departamentos);
        
        const provincias = [...new Set(datosPostulantes.map((p: Postulante) => p.provincia))].filter(Boolean) as string[];
        setProvinciasFilter(provincias);
        
        const colegios = [...new Set(datosPostulantes.map((p: Postulante) => p.colegio))].filter(Boolean) as string[];
        setColegiosFilter(colegios);
        
        const grados = [...new Set(datosPostulantes.map((p: Postulante) => p.grado))].filter(Boolean) as string[];
        setGradosFilter(sortGrados(grados));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [olimpiada_id]);

  const columns = useMemo<ColumnDef<Postulante>[]>(() => [
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "apellidos",
      header: "Apellidos",
    },
    {
      accessorKey: "ci",
      header: "CI",
    },
    {
      accessorKey: "fechaNac",
      header: "Fecha de Nacimiento",
      cell: ({ row }) => formatDate(row.getValue("fechaNac")),
      filterFn: yearFilterFn,
    },
    {
      accessorKey: "area",
      header: "Área",
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
    },
    {
      accessorKey: "departamento",
      header: "Departamento",
    },
    {
      accessorKey: "provincia",
      header: "Provincia",
    },
    {
      accessorKey: "colegio",
      header: "Colegio",
    },
    {
      accessorKey: "grado",
      header: "Grado",
      cell: ({ row }) => formatGrado(row.getValue("grado")),
      sortingFn: (rowA, rowB) => {
        const gradoA = getGradoNumerico(rowA.getValue("grado"));
        const gradoB = getGradoNumerico(rowB.getValue("grado"));
        return gradoA - gradoB;
      },
    },
    {
      accessorKey: "responsable",
      header: "Responsable",
    },
    {
      accessorKey: "responsableCi",
      header: "CI Responsable",
    },
    {
      accessorKey: "estado",
      header: "Estado",
    },
  ], []);

  const table = useReactTable({
    data: postulantes,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleGenerarPdf = () => {
    setIsModalOpen(true);
  };

  return {
    nombreOlimpiada,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    selectedYear,
    setSelectedYear,
    yearsFilter,
    areasFilter,
    categoriasFilter,
    departamentosFilter,
    provinciasFilter,
    colegiosFilter,
    gradosFilter,
    estadosFilter,
    table,
    handleGenerarPdf,
  };
} 
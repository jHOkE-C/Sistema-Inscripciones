"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUpDown, Download } from "lucide-react";
import { API_URL } from "@/hooks/useApiRequest";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";
import ModalPdf from "../modalPdf";


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

const PostulantesPage = () => {
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
          .filter(Boolean))] as string[];
        
  
        years.sort((a, b) => parseInt(b) - parseInt(a));
        
        const areas = [...new Set(datosPostulantes.map((p: Postulante) => p.area))] as string[];
        const categorias = [...new Set(datosPostulantes.map((p: Postulante) => p.categoria))] as string[];
        const departamentos = [...new Set(datosPostulantes.map((p: Postulante) => p.departamento))] as string[];
        const provincias = [...new Set(datosPostulantes.map((p: Postulante) => p.provincia))] as string[];
        const colegios = [...new Set(datosPostulantes.map((p: Postulante) => p.colegio))] as string[];
        const grados = [...new Set(datosPostulantes.map((p: Postulante) => p.grado))] as string[];
        
  
        setYearsFilter(years.filter(Boolean));
        setAreasFilter(areas.filter(Boolean).sort());
        setCategoriasFilter(categorias.filter(Boolean).sort());
        setDepartamentosFilter(departamentos.filter(Boolean).sort());
        setProvinciasFilter(provincias.filter(Boolean).sort());
        setColegiosFilter(colegios.filter(Boolean).sort());
        setGradosFilter(sortGrados(grados.filter(Boolean)));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (olimpiada_id) {
      fetchData();
    }
  }, [olimpiada_id]);

  // Definir columnas
  const columns: ColumnDef<Postulante>[] = useMemo(
    () => [
      {
        id: "nombre",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        accessorFn: (row) => `${row.nombre} ${row.apellidos}`,
        cell: ({ row }) => (
          <div>
            {row.original.nombre} {row.original.apellidos}
          </div>
        ),
      },
      {
        accessorKey: "ci",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            CI
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "fechaNac",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha Nac.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          try {
            const fecha = new Date(row.original.fechaNac);
            return <div>{fecha.toLocaleDateString()}</div>;
          } catch {
            return <div>{row.original.fechaNac || "N/A"}</div>;
          }
        },
        filterFn: yearFilterFn
      },
      {
        accessorKey: "area",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Área
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "categoria",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Categoría
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "departamento",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Departamento
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "provincia",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Provincia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "colegio",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Colegio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "grado",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Grado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        id: "responsable",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Responsable
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        accessorFn: (row) => `${row.responsable} (${row.responsableCi})`,
        cell: ({ row }) => (
          <div>
            {row.original.responsable} ({row.original.responsableCi})
          </div>
        ),
      },
      {
        accessorKey: "estado",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Estado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className={row.original.estado === "Inscripcion Completa" ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
            {row.original.estado}
          </div>
        ),
      },
    ],
    []
  );

  
  useEffect(() => {
    const column = table.getColumn("fechaNac");
    if (column) {
      column.setFilterValue(selectedYear);
    }
  }, [selectedYear]);

  
  const table = useReactTable({
    data: postulantes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    filterFns: {
      yearFilter: yearFilterFn,
    },
  });

  
  useEffect(() => {
    table.setPageSize(10);
  }, [table]);

  
  useEffect(() => {
    if (globalFilter) {
      table.setGlobalFilter(globalFilter);
    }
  }, [globalFilter, table]);

  
  const postulantesFiltrados = useMemo(() => {
    return table.getFilteredRowModel().rows.map(row => row.original);
  }, [table.getFilteredRowModel().rows]);

  const handleGenerarPdf = () => {
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  
  console.log("Total postulantes:", postulantes.length);
  console.log("Años disponibles:", yearsFilter);
  console.log("Año seleccionado:", selectedYear);
  console.log("Postulantes filtrados:", table.getFilteredRowModel().rows.length);

  return (
    <div className="container mx-auto py-6">
      <ReturnComponent />
      <h1 className="text-3xl font-bold mb-6 text-center">
        Postulantes: {nombreOlimpiada}
      </h1>

      
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Input
            placeholder="Buscar por nombre, apellido, CI o responsable..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          
          <Button 
            onClick={handleGenerarPdf} 
            className="flex items-center gap-2 ml-auto"
          >
            <Download className="h-4 w-4" />
            Generar PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div>
            <label className="text-sm font-medium">Año de nacimiento</label>
            <Select
              value={selectedYear}
              onValueChange={(value) => {
                setSelectedYear(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {yearsFilter.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
          <div>
            <label className="text-sm font-medium">Área</label>
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  table.getColumn("area")?.setFilterValue(value);
                } else {
                  table.getColumn("area")?.setFilterValue(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {areasFilter.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          
          <div>
            <label className="text-sm font-medium">Categoría</label>
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  table.getColumn("categoria")?.setFilterValue(value);
                } else {
                  table.getColumn("categoria")?.setFilterValue(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categoriasFilter.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      
          <div>
            <label className="text-sm font-medium">Departamento</label>
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  table.getColumn("departamento")?.setFilterValue(value);
                } else {
                  table.getColumn("departamento")?.setFilterValue(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departamentosFilter.map((depto) => (
                  <SelectItem key={depto} value={depto}>
                    {depto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      
          <div>
            <label className="text-sm font-medium">Provincia</label>
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  table.getColumn("provincia")?.setFilterValue(value);
                } else {
                  table.getColumn("provincia")?.setFilterValue(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {provinciasFilter.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      
          <div>
            <label className="text-sm font-medium">Colegio</label>
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  table.getColumn("colegio")?.setFilterValue(value);
                } else {
                  table.getColumn("colegio")?.setFilterValue(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {colegiosFilter.map((colegio) => (
                  <SelectItem key={colegio} value={colegio}>
                    {colegio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      
          <div>
            <label className="text-sm font-medium">Grado</label>
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  table.getColumn("grado")?.setFilterValue(value);
                } else {
                  table.getColumn("grado")?.setFilterValue(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {gradosFilter.map((grado) => (
                  <SelectItem key={grado} value={grado}>
                    {grado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

      
          <div>
            <label className="text-sm font-medium">Estado</label>
            <Select
              onValueChange={(value) => {
                if (value !== "all") {
                  table.getColumn("estado")?.setFilterValue(value);
                } else {
                  table.getColumn("estado")?.setFilterValue(undefined);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {estadosFilter.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length} de {postulantes.length} registros
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>


      {isModalOpen && (
        <ModalPdf
          gestion={olimpiada_id}
          nombreOlimpiada={nombreOlimpiada}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          postulantesFiltrados={postulantesFiltrados}
        />
      )}
    </div>
  );
};

export default PostulantesPage;

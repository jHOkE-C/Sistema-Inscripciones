"use client";

import { useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { ChevronLeft, ChevronRight, Download, SquareArrowDown, SquareArrowUp } from "lucide-react";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";
import ModalPdf from "../modalPdf";
import "@/views/admin/reportes/[olimpiada_id]/reportes.css";
import DownloadExcel from "@/components/DownloadExcel";
import { usePostulantesPageViewModel, Postulante, yearFilterFn, formatDate, formatGrado, getGradoNumerico } from "@/viewModels/usarVistaModelo/privilegios/reportes/useReportes";

const renderColumnHeader = (column: Column<Postulante, unknown>, label: string) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between w-full">
        <span className="font-medium">{label}</span>
        <div >
          <div>
          <button
            onClick={() => {
              if (column.getIsSorted() === "asc") {
                column.clearSorting();
              } else {
                column.toggleSorting(false, true); 
              }
            }}
            className={`h-6 w-6 flex items-center justify-center rounded-sm ${column.getIsSorted() === "asc" ? "bg-green-100 text-green-700 font-bold" : "text-gray-400 hover:text-gray-700"}`}
            title="Ordenar ascendente"
          >
            <SquareArrowUp />
          </button>
          </div>
          <div>
          <button
            onClick={() => {
              if (column.getIsSorted() === "desc") {
                column.clearSorting();
              } else {
                column.toggleSorting(true, true); 
              }
            }}
            className={`h-6 w-6 flex items-center justify-center rounded-sm ${column.getIsSorted() === "desc" ? "bg-red-100 text-red-700 font-bold" : "text-gray-400 hover:text-gray-700"}`}
            title="Ordenar descendente"
          >
            <SquareArrowDown/>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomTableHeader = ({
  children,
  column,
}: {
  children: React.ReactNode;
  column?: string;
}) => {
  return (
    <TableHead 
      className={`table-header ${column ? `col-${column}` : ''}`}
    >
      {children}
    </TableHead>
  );
};

const CustomTableCell = ({
  children,
  colSpan,
  className,
  column,
}: {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
  column?: string;
}) => {
  return (
    <TableCell 
      className={`table-cell ${column ? `col-${column}` : ''} ${className || ''}`}
      colSpan={colSpan}
    >
      {children}
    </TableCell>
  );
};

const PostulantesPage = () => {
  const {
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
    handleGenerarPdf,
    olimpiada_id
  } = usePostulantesPageViewModel();

  const columns: ColumnDef<Postulante>[] = useMemo(
    () => [
      {
        id: "nombre",
        header: ({ column }) => renderColumnHeader(column, "Nombre"),
        accessorFn: (row) => `${row.nombre} ${row.apellidos}`,
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={`${row.original.nombre} ${row.original.apellidos}`}>
              {row.original.nombre} {row.original.apellidos}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "ci",
        header: ({ column }) => renderColumnHeader(column, "CI"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={row.original.ci}>
              {row.original.ci}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "fechaNac",
        header: ({ column }) => renderColumnHeader(column, "Fecha Nac."),
        cell: ({ row }) => {
          try {
            const fechaFormateada = formatDate(row.original.fechaNac);
            return (
              <div className="w-full overflow-hidden">
                <span className="block truncate" title={fechaFormateada}>
                  {fechaFormateada}
                </span>
              </div>
            );
          } catch {
            return (
              <div className="w-full overflow-hidden">
                <span className="block truncate" title={row.original.fechaNac || "N/A"}>
                  {row.original.fechaNac || "N/A"}
                </span>
              </div>
            );
          }
        },
        filterFn: yearFilterFn
      },
      {
        accessorKey: "area",
        header: ({ column }) => renderColumnHeader(column, "Área"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={row.original.area}>
              {row.original.area}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "categoria",
        header: ({ column }) => renderColumnHeader(column, "Categoría"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={row.original.categoria}>
              {row.original.categoria}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "departamento",
        header: ({ column }) => renderColumnHeader(column, "Departamento"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={row.original.departamento}>
              {row.original.departamento}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "provincia",
        header: ({ column }) => renderColumnHeader(column, "Provincia"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={row.original.provincia}>
              {row.original.provincia}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "colegio",
        header: ({ column }) => renderColumnHeader(column, "Colegio"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={row.original.colegio}>
              {row.original.colegio}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "grado",
        header: ({ column }) => renderColumnHeader(column, "Grado"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={row.original.grado}>
              {formatGrado(row.original.grado)}
            </span>
          </div>
        ),
        sortingFn: (rowA, rowB) => {
          const gradoA = getGradoNumerico(rowA.original.grado);
          const gradoB = getGradoNumerico(rowB.original.grado);
          return gradoA - gradoB;
        }
      },
      {
        id: "responsable",
        header: ({ column }) => renderColumnHeader(column, "Responsable"),
        accessorFn: (row) => `${row.responsable} (${row.responsableCi})`,
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className="block truncate" title={`${row.original.responsable} (${row.original.responsableCi})`}>
              {row.original.responsable} ({row.original.responsableCi})
            </span>
          </div>
        ),
      },
      {
        accessorKey: "estado",
        header: ({ column }) => renderColumnHeader(column, "Estado"),
        cell: ({ row }) => (
          <div className="w-full overflow-hidden">
            <span className={`block truncate ${row.original.estado === "Inscripcion Completa" ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}`} title={row.original.estado}>
              {row.original.estado}
            </span>
          </div>
        ),
      },
    ],
    []
  );

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
    enableMultiSort: true,
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
    const sortedData = [...table.getFilteredRowModel().rows];
    
    if (sorting.length > 0) {
      sortedData.sort((rowA, rowB) => {
        for (let i = 0; i < sorting.length; i++) {
          const { id, desc } = sorting[i];
          
          if (id === 'grado') {
            const gradoA = getGradoNumerico(rowA.original.grado);
            const gradoB = getGradoNumerico(rowB.original.grado);
            const direction = desc ? -1 : 1;
            const result = gradoA - gradoB;
            if (result !== 0) return direction * result;
            continue;
          }
          
          const valueA = rowA.getValue(id) as string | number;
          const valueB = rowB.getValue(id) as string | number;
          
          if (valueA === valueB) continue;
          
          const direction = desc ? -1 : 1;
          
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return direction * valueA.localeCompare(valueB);
          }
          
          return direction * (valueA > valueB ? 1 : -1);
        }
        return 0; 
      });
    }
    
    return sortedData.map(row => row.original);
  }, [table.getFilteredRowModel().rows, sorting]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
    <ReturnComponent />
    
    <div className="container  w-5/6 mx-auto py-6 md:w-5/6 lg:w-11/12 xl:w-11/12">
      
      <h2 className="text-3xl font-bold mb-2 text-center">
        Postulantes: {nombreOlimpiada}
      </h2>

      <div className="mb-2 text-center text-sm text-gray-600">
        Presiona en ▲ o ▼ para ordenar. Puedes ordenar por múltiples columnas a la vez.
        <br/>
        Para deseleccionar una columna, Presiona nuevamente en la flecha activa.
      </div>
      
      <div className="space-y-4 mb-3">
        <div className="grid ms:grid-cols-1 md:grid-cols-2 gap-2">
          <Input
            placeholder="Buscar por nombre, apellido, CI o responsable..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-full"
          />
          
          <div className="flex gap-2 xl:ml-auto md:ml-auto items-center justify-center">
            <DownloadExcel 
              data={postulantesFiltrados} 
              fileName={`postulantes_${nombreOlimpiada}`}
            />
            <Button 
              onClick={handleGenerarPdf} 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Generar PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-1">
          
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
                    {formatGrado(grado)}
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

      <div className="h-12">
      {sorting.length > 0 && (
        <Button 
          variant="outline"
          onClick={() => setSorting([])} 
          className="flex items-center gap-2"
        >
          Resetear ordenamiento
        </Button>
      )}
      </div>
      <div className="rounded-md border">
        <Table className="reportes-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <CustomTableHeader key={header.id} column={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </CustomTableHeader>
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
                    <CustomTableCell key={cell.id} column={cell.column.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </CustomTableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <CustomTableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron resultados.
                </CustomTableCell>
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
    </>
  );
};

export default PostulantesPage;
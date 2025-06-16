"use client";

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
import "@/styles/reportes.css";
import DownloadExcel from "@/components/DownloadExcel";
import { useReportesViewModel, yearFilterFn, formatDate, formatGrado, type Postulante } from "@/viewModels/usarVistaModelo/privilegios/reportes/useReportesViewModel";

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
  const params = useParams();
  const olimpiada_id = params?.olimpiada_id as string;
  
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
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    setGlobalFilter,
    setSelectedYear,
    setIsModalOpen,
    handleGenerarPdf
  } = useReportesViewModel(olimpiada_id);

  const columns: ColumnDef<Postulante>[] = [
    {
      accessorKey: "nombre",
      header: ({ column }) => renderColumnHeader(column, "Nombre"),
    },
    {
      accessorKey: "apellidos",
      header: ({ column }) => renderColumnHeader(column, "Apellidos"),
    },
    {
      accessorKey: "ci",
      header: ({ column }) => renderColumnHeader(column, "CI"),
    },
    {
      accessorKey: "fechaNac",
      header: ({ column }) => renderColumnHeader(column, "Fecha de Nacimiento"),
      cell: ({ row }) => formatDate(row.getValue("fechaNac")),
      filterFn: yearFilterFn,
    },
    {
      accessorKey: "area",
      header: ({ column }) => renderColumnHeader(column, "Área"),
    },
    {
      accessorKey: "categoria",
      header: ({ column }) => renderColumnHeader(column, "Categoría"),
    },
    {
      accessorKey: "departamento",
      header: ({ column }) => renderColumnHeader(column, "Departamento"),
    },
    {
      accessorKey: "provincia",
      header: ({ column }) => renderColumnHeader(column, "Provincia"),
    },
    {
      accessorKey: "colegio",
      header: ({ column }) => renderColumnHeader(column, "Colegio"),
    },
    {
      accessorKey: "grado",
      header: ({ column }) => renderColumnHeader(column, "Grado"),
      cell: ({ row }) => formatGrado(row.getValue("grado")),
    },
    {
      accessorKey: "responsable",
      header: ({ column }) => renderColumnHeader(column, "Responsable"),
    },
    {
      accessorKey: "responsableCi",
      header: ({ column }) => renderColumnHeader(column, "CI Responsable"),
    },
    {
      accessorKey: "estado",
      header: ({ column }) => renderColumnHeader(column, "Estado"),
    },
  ];

  const table = useReactTable({
    data: postulantes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-10">
      <ReturnComponent to="/admin/reportes" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reporte de Inscripciones - {nombreOlimpiada}</h1>
        <div className="flex gap-2">
          <Button onClick={handleGenerarPdf}>
            <Download className="mr-2 h-4 w-4" />
            Generar PDF
          </Button>
          <DownloadExcel
            data={postulantes}
            fileName={`Reporte_${nombreOlimpiada}`}
          />
        </div>
      </div>

      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Buscar en todos los campos..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por año" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los años</SelectItem>
            {yearsFilter.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <CustomTableHeader key={header.id}>
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
                    <CustomTableCell key={cell.id}>
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
                  No hay resultados.
                </CustomTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
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

      {isModalOpen && (
        <ModalPdf
          gestion={olimpiada_id}
          nombreOlimpiada={nombreOlimpiada}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          postulantesFiltrados={postulantes}
        />
      )}
    </div>
  );
};

export default PostulantesPage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  Row,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  goToCode?: boolean;
}

export function useTableListViewModel<TData, TValue>({
  columns,
  data,
  goToCode,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const handleRowClick = (row: Row<TData>) => {
    if (goToCode) {
      const codigo = row.getValue("codigo_lista");
      navigate(`${codigo}`);
    }
  };

  return {
    table,
    handleRowClick,
    goToCode,
  };
} 
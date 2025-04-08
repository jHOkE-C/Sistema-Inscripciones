import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface DateSelectorProps {
  /** Valor actual del selector */
  value?: Date;
  /** Callback cuando cambia la fecha */
  onChange: (value: Date) => void;
}

export const DateSelector = React.memo(function DateSelector({ value, onChange }: DateSelectorProps) {
  // Valor seguro: si no se pasa value, usar la fecha actual
  const safeValue = value ?? new Date();

  // Memorizar arrays para evitar recreación en cada render
  const days = React.useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const months = React.useMemo(
    () => [
      { value: 1, label: "Enero" },
      { value: 2, label: "Febrero" },
      { value: 3, label: "Marzo" },
      { value: 4, label: "Abril" },
      { value: 5, label: "Mayo" },
      { value: 6, label: "Junio" },
      { value: 7, label: "Julio" },
      { value: 8, label: "Agosto" },
      { value: 9, label: "Septiembre" },
      { value: 10, label: "Octubre" },
      { value: 11, label: "Noviembre" },
      { value: 12, label: "Diciembre" },
    ],
    []
  );
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  const handleDayChange = React.useCallback(
    (day: string) => {
      const newDate = new Date(safeValue);
      newDate.setDate(Number(day));
      onChange(newDate);
    },
    [safeValue, onChange]
  );

  const handleMonthChange = React.useCallback(
    (month: string) => {
      const newDate = new Date(safeValue);
      newDate.setMonth(Number(month) - 1);
      onChange(newDate);
    },
    [safeValue, onChange]
  );

  const handleYearChange = React.useCallback(
    (year: string) => {
      const newDate = new Date(safeValue);
      newDate.setFullYear(Number(year));
      onChange(newDate);
    },
    [safeValue, onChange]
  );

  return (
    <div className="flex gap-2">
      {/* Día */}
      <Select value={String(safeValue.getDate())} onValueChange={handleDayChange}>
        <SelectTrigger className="min-w-24 w-full">
          <SelectValue placeholder="Día" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={String(d)}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Mes */}
      <Select value={String(safeValue.getMonth() + 1)} onValueChange={handleMonthChange}>
        <SelectTrigger className="min-w-24 w-full">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={String(m.value)}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Año */}
      <Select value={String(safeValue.getFullYear())} onValueChange={handleYearChange}>
        <SelectTrigger className="min-w-24 w-full">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent className="h-48 overflow-y-auto">
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

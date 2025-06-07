import { format } from "date-fns";
import { es } from "date-fns/locale";

export const getDateUTC = (date: Date) => {
    return `${date.getUTCDate().toString().padStart(2, "0")}-${(
        date.getUTCMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${date.getUTCFullYear()}`;
};
export const formatDate = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
  return format(date, "dd MMMM yyyy", { locale: es });
};
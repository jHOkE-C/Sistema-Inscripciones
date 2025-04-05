import { CalendarDays, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Version } from "./page";



export function Versiones({versiones}: {versiones: Version[]}) {
  
  // Function to format dates in a more readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {versiones.map((event) => (
        <Card key={event.id} className="flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{event.nombre}</CardTitle>
              <Badge variant="outline" className="ml-2">
                {event.gestion}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fecha de inicio:</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.fecha_inicio)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fecha de fin:</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.fecha_fin)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Duración:{" "}
                {calculateDuration(event.fecha_inicio, event.fecha_fin)} días
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

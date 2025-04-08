"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

export interface OlympicsData {
  id?: number;
  nombre?: string;
  gestion?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  message?: string;
}

export default function Status({ data }: { data: OlympicsData }) {
  const isActive = !data.message;

  // Format dates if they exist
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Estado de Olimpiada</CardTitle>
        <Badge variant={isActive ? "default" : "destructive"}>
          {isActive ? "Vigente" : "No Vigente"}
        </Badge>
      </CardHeader>
      <CardContent>
        {isActive ? (
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">{data.nombre}</h3>
              <p className="text-sm text-muted-foreground">{data.gestion}</p>
            </div>
            
          </div>
        ) : (
          <p className="text-muted-foreground">{data.message}</p>
        )}
      </CardContent>
    </Card>
  );
}

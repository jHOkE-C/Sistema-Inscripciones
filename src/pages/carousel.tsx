"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, Clock, Trophy } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";

// Tipos para los datos de olimpiadas
interface Fase {
  id: number;
  tipo_plazo: string;
  fecha_inicio: string;
  fecha_fin: string;
  olimpiada_id: number;
}


interface Olimpiada {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  gestion: string;
  fase_actual?: Fase;
}

const formatDate = (dateString: string) => {
  const date = new Date(`${dateString}T12:00:00`);
  return format(date, "d 'de' MMMM, yyyy", { locale: es });
};

export function OlimpiadasCarousel() {
  const [isMounted, setIsMounted] = useState(false);
  const [olimpiadas, setOlimpiadas] = useState<Olimpiada[]>([]);

  useEffect(() => {
    const fetchOlimpiadas = async () => {
      const response = await axios.get<Olimpiada[]>(`${API_URL}/api/olimpiadas/hoy`);
      console.log(response.data);
      setOlimpiadas(response.data);
    };
    fetchOlimpiadas();
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto md:px-4 lg:px-0">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {olimpiadas.map((olimpiada) => (
            <CarouselItem
              key={olimpiada.id}
              className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3  "
            >
              <div className="p-6 md:p-1 h-[390px] ">
                <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full -py-1 gap-0">
                  <CardHeader className="p-4 pb-2 bg-blue-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        {olimpiada.gestion}
                      </Badge>
                      <Trophy className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl line-clamp-2">
                      {olimpiada.nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Fecha de finalización:
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(olimpiada.fecha_fin)}
                        </p>
                      </div>
                    </div>

                    {olimpiada.fase_actual ? (
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-amber-600" />
                          <h3 className="font-medium text-amber-800">
                            Fase actual:{" "}
                            <span className="font-semibold">
                              {olimpiada.fase_actual.tipo_plazo}
                            </span>
                          </h3>
                        </div>
                        <div className="space-y-1 pl-7">
                          <p className="text-sm text-amber-700">
                            <span className="font-medium">Inicio:</span>{" "}
                            {formatDate(olimpiada.fase_actual.fecha_inicio)}
                          </p>
                          <p className="text-sm text-amber-700">
                            <span className="font-medium">Fin:</span>{" "}
                            {formatDate(olimpiada.fase_actual.fecha_fin)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <p className="text-sm text-gray-600">
                            No hay fase activa actualmente
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 mt-auto">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={olimpiada.fase_actual?.tipo_plazo != 'Inscripcion'}>
                      Inscribite Ahora
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-2 -mt-4 md:mt-0">
          <CarouselPrevious className="static transform-none mx-2 mt-8" />
          <div className="flex gap-1">
            {olimpiadas.map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 rounded-full bg-gray-300 mx-1"
              />
            ))}
          </div>
          <CarouselNext className="static transform-none mx-2 mt-8" />
        </div>
      </Carousel>
    </div>
  );
}

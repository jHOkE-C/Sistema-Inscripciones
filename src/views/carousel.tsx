"use client";

import { lazy, Suspense } from "react";
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
import { Link } from "react-router-dom";
import { useOlimpiadasCarouselViewModel } from "@/viewModels/viewmodels/useOlimpiadasCarouselViewModel";

const DescargarPlantilla = lazy(
    () => import("@/components/DescargarPlantilla")
);

export function OlimpiadasCarousel() {
    const { isMounted, olimpiadas, formatDate } = useOlimpiadasCarouselViewModel();

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
                            <div className="p-6 md:p-1 h-full">
                                <Card className="overflow-hidden transition-all duration-300 shadow-foreground/20 hover:-translate-y-1 h-full -py-1 gap-0 ">
                                    <CardHeader className="p-4 pb-2 bg-primary text-white">
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
                                                <p className="text-sm font-medium text-background-700">
                                                    Fecha de finalización:
                                                </p>
                                                <p className="text-sm text-background-600">
                                                    {formatDate(
                                                        olimpiada.fecha_fin
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {olimpiada.fase ? (
                                            <div className=" p-3 rounded-lg border">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="h-5 w-5 text-gray-500" />
                                                    <h3 className="font-medium ">
                                                        Fase actual:{" "}
                                                        <span className="font-semibold">
                                                            {
                                                                olimpiada
                                                                    .fase
                                                                    .fase
                                                                    .nombre_fase
                                                            }
                                                        </span>
                                                    </h3>
                                                </div>
                                                <div className="space-y-1 pl-7">
                                                    <p className="text-sm ">
                                                        <span className="font-medium">
                                                            Inicio:
                                                        </span>{" "}
                                                        {formatDate(
                                                            olimpiada.fase
                                                                .fecha_inicio
                                                        )}
                                                    </p>
                                                    <p className="text-sm ">
                                                        <span className="font-medium">
                                                            Fin:
                                                        </span>{" "}
                                                        {formatDate(
                                                            olimpiada.fase
                                                                .fecha_fin
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className=" p-3 rounded-lg border ">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-gray-500" />
                                                    <p className="text-sm">
                                                        No hay ninguna fase
                                                        activa actualmente
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 mt-auto flex flex-col justify-center">
                                        {olimpiada.fase?.fase.nombre_fase.includes(
                                            "inscripción"
                                        ) ? (
                                            <>
                                                <Suspense
                                                    fallback={
                                                        <div>
                                                            Cargando...
                                                        </div>
                                                    }
                                                >
                                                    <DescargarPlantilla
                                                        olimpiada={
                                                            olimpiada
                                                        }
                                                    />
                                                </Suspense>
                                                <Button variant={"link"}>
                                                    <Link
                                                        to={`/inscribir/${(
                                                            olimpiada.id +
                                                                ""
                                                        )}`}
                                                    >
                                                        Inscribite Ahora
                                                    </Link>
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="text-center text-sm text-muted-foreground">
                                                <p>
                                                    Esta olimpiada no está
                                                    en proceso de
                                                    inscripción
                                                </p>
                                            </div>
                                        )}
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

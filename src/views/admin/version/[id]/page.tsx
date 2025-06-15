"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { formatDate } from "@/viewModels/utils/fechas";
import { OlimpiadaData } from "@/models/interfaces/versiones.type";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// Define types for our data

const editOlimpiadaSchema = z
  .object({
    fecha_inicio: z.date(),
    fecha_fin: z.date(),
  })
  .refine(
    (data) => {
      return data.fecha_fin > data.fecha_inicio;
    },
    {
      message:
        "La fecha de finalización debe ser posterior a la fecha de inicio",
      path: ["fecha_fin"], // This tells Zod to attach the error to the fecha_fin field
    }
  );

export default function OlimpiadaPage() {
  const params = useParams();
  const id = Number(params.id);
  const [data, setData] = useState<OlimpiadaData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get<OlimpiadaData>(
        `${API_URL}/api/olimpiadas/${id}/cronogramas`
      );
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching olimpiada data:", error);
    }
  };

  const editOlimpiadaForm = useForm<z.infer<typeof editOlimpiadaSchema>>({
    resolver: zodResolver(editOlimpiadaSchema),
    defaultValues: {
      fecha_inicio: undefined,
      fecha_fin: undefined,
    },
  });

  useEffect(() => {
    console.log(id);
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      editOlimpiadaForm.reset({
        fecha_inicio: new Date(data.olimpiada.fecha_inicio),
        fecha_fin: new Date(data.olimpiada.fecha_fin),
      });
    }
  }, [data, editOlimpiadaForm]);

  if (loading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">No se encontró información de la olimpiada.</p>
      </div>
    );
  }

  const { olimpiada } = data;

  return (
    <div className="flex flex-col min-h-screen items-center">
    <Header />
      <div className="pl-4 pt-4 3xl justify-start w-5xl">
        <Link to="/admin/version" className="">
          <Button variant="secondary" className="flex items-center gap-1 mb-4">
            <ChevronLeft className="h" />
            Volver
          </Button>
        </Link>
      </div>
      <div className="p-4 container mx-auto max-w-5xl">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>
              <h2 className="text-2xl font-bold ">Información de Olimpiada</h2>
            </CardTitle>
            <CardDescription>
              <h2 className="text-xl font-semibold ">
                {olimpiada.nombre} – {olimpiada.gestion}
              </h2>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de inicio:
                  </p>
                  <p className="font-medium">
                    {formatDate(olimpiada.fecha_inicio)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fecha de finalización:
                  </p>
                  <p className="font-medium">
                    {formatDate(olimpiada.fecha_fin)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

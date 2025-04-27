"use client";
//utilizen si quieren esto por que hay mucho codigo repetido tal cual a este tsx
import { Versiones } from "@/pages/admin/Versiones";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";
import Footer from "@/components/Footer";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import { Version } from "@/types/versiones.type";

interface VersionesPageProps {
  title: string;
  returnTo?: string;
}

export default function VersionesPage({ title, returnTo = "/admin" }: VersionesPageProps) {
  const [versiones, setVersiones] = useState<Version[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Version[]>(`${API_URL}/api/olimpiadas`);
      setVersiones(response.data);
    } catch (error) {
      console.error("Error fetching versiones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <ReturnComponent to={returnTo} />
      <div className="flex flex-col min-h-screen">
        <div className="w-full p-4 md:w-4/5 mx-auto">
          <h1 className="text-4xl font-bold text-center py-4">{title}</h1>
          {loading ? (
            <Loading />
          ) : versiones.length > 0 ? (
            <Versiones versiones={versiones} />
          ) : (
            <p className="text-center text-gray-500">No hay versiones disponibles aún.</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "@/hooks/useApiRequest";
import axios from "axios";
import { Departamento, Provincia, Colegio } from "@/interfaces/ubicacion.interface";

interface UbicacionContextType {
    departamentos: Departamento[];
    provincias: Provincia[];
    colegios: Colegio[];
    loading: boolean;
    error: string | null;
}

const UbicacionContext = createContext<UbicacionContextType | undefined>(undefined);

export const UbicacionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [colegios, setColegios] = useState<Colegio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUbicaciones = async () => {
            try {
                const cachedData = getCachedData();
                if (cachedData) {
                    setDepartamentos(cachedData.departamentos);
                    setProvincias(cachedData.provincias);
                    setColegios(cachedData.colegios);
                    setLoading(false);
                    return;
                }

                const [deptResponse, provResponse, colResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/departamentos`),
                    axios.get(`${API_URL}/api/provincias`),
                    axios.get(`${API_URL}/api/colegios`)
                ]);

                setDepartamentos(deptResponse.data);
                setProvincias(provResponse.data);
                setColegios(colResponse.data);

                const dataToCache = {
                    departamentos: deptResponse.data,
                    provincias: provResponse.data,
                    colegios: colResponse.data,
                    timestamp: new Date().getTime()
                };
                localStorage.setItem('ubicacionesCache', JSON.stringify(dataToCache));
            } catch (error) {
                console.error("Error al cargar datos de ubicación:", error);
                setError("Error al cargar datos de ubicación");
            } finally {
                setLoading(false);
            }
        };

        fetchUbicaciones();
    }, []);

    const getCachedData = () => {
        try {
            const cachedDataString = localStorage.getItem('ubicacionesCache');
            if (!cachedDataString) return null;
            
            const cachedData = JSON.parse(cachedDataString);
            const timestamp = cachedData.timestamp;
            const now = new Date().getTime();
            
            if (now - timestamp <= 24 * 60 * 60 * 1000) {
                return {
                    departamentos: cachedData.departamentos,
                    provincias: cachedData.provincias,
                    colegios: cachedData.colegios
                };
            }
            
            localStorage.removeItem('ubicacionesCache');
            return null;
        } catch (error) {
            console.error("Error al leer cache:", error);
            localStorage.removeItem('ubicacionesCache');
            return null;
        }
    };

    const value = {
        departamentos,
        provincias,
        colegios,
        loading,
        error
    };

    return (
        <UbicacionContext.Provider value={value}>
            {children}
        </UbicacionContext.Provider>
    );
};

export const useUbicacion = () => {
    const context = useContext(UbicacionContext);
    if (context === undefined) {
        throw new Error("useUbicacion debe usarse dentro de un UbicacionProvider");
    }
    return context;
}; 
import React, { createContext, useContext, useState, useCallback } from "react";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import axios from "axios";
import { Departamento, Provincia, Colegio } from "@/models/interfaces/ubicacion.interface";
import { toast } from "sonner";
interface UbicacionContextType {
    departamentos: Departamento[];
    provincias: Provincia[];
    colegios: Colegio[];
    loading: boolean;
    error: string | null;
    fetchUbicaciones: () => Promise<void>; 
}

const UbicacionContext = createContext<UbicacionContextType | undefined>(undefined);

export const UbicacionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [colegios, setColegios] = useState<Colegio[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            toast.error("Error al leer cache");
            localStorage.removeItem('ubicacionesCache');
            return null;
        }
    };

    const fetchUbicaciones = useCallback(async () => {
        setLoading(true);
        setError(null);
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
            toast.error("Error al cargar datos de ubicación");
            setError("Error al cargar datos de ubicación");
        } finally {
            setLoading(false);
        }
        //puede causar bug tal vez por que esto hace que se llame 3 veces, 2 entran al cache(si ya se hizo la peticion 3veces) y 1 hace la peticion(solo la primera ves)
    }, [setDepartamentos, setProvincias, setColegios, setLoading, setError]);

    const value = {
        departamentos,
        provincias,
        colegios,
        loading,
        error,
        fetchUbicaciones
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

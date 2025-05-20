import React from "react";
import { UbicacionProvider } from "@/context/UbicacionContext";
import { CategoriasProvider } from "@/context/CategoriasContext";

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <UbicacionProvider>
            <CategoriasProvider>
                {children}
            </CategoriasProvider>
        </UbicacionProvider>
    );
}; 
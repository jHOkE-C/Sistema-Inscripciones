import React from "react";
import { UbicacionProvider } from "@/context/UbicacionContext";
import { CategoriasProvider } from "@/context/CategoriasContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface AppProvidersProps {
    children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <UbicacionProvider>
                <CategoriasProvider>
                    {children}
                </CategoriasProvider>
            </UbicacionProvider>
        </QueryClientProvider>
    );
};

import React from "react";
import { UbicacionProvider } from "@/viewModels/context/UbicacionContext";
import { CategoriasProvider } from "@/viewModels/context/CategoriasContext";
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

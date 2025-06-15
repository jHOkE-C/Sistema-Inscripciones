"use client";

import { Clock } from "lucide-react";
import { useInactivityModalViewModel } from "@/viewModels/viewmodels/useInactivityModalViewModel";

export default function InactivityModal({ clean }: { clean: () => void }) {
  const { timeLeft } = useInactivityModalViewModel(clean);

  return (
    <div>
      {/* Contenido principal de la página */}
      <div className="md:w-4xl ">
        {/* Barra de tiempo restante */}
        <div className="border rounded-lg p-4 mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span>Tiempo hasta inactividad: {timeLeft} segundos</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 90) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-muted-foreground text-center text-sm">
          Por su seguridad, la sesión se cerrará automáticamente si no hay
          actividad en 90 segundos.
        </p>
      </div>
    </div>
  );
}

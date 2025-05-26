"use client";

import { useState, useEffect, useCallback } from "react";
import {  Clock } from "lucide-react";

export default function InactivityModal({ clean }: { clean: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(90);

  // Tiempo de inactividad en milisegundos (30 segundos)
  const INACTIVITY_TIME = 90 * 1000;

  // Función que se ejecuta cuando hay inactividad
  const handleInactivity = useCallback(() => {
    console.log("Usuario inactivo por 30 segundos");
    localStorage.setItem("lastActivity", new Date().toISOString());
    setIsModalOpen(true);
    clean();

  }, []);

  // Resetear el timer de inactividad
  const resetInactivityTimer = useCallback(() => {
    setLastActivity(Date.now());
    setTimeLeft(90);
  }, []);

  // Eventos que consideramos como "actividad del usuario"
  const activityEvents = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ];

  useEffect(() => {
    // Agregar event listeners para detectar actividad
    const handleActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Timer principal para verificar inactividad
    const inactivityTimer = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const remaining = Math.max(
        0,
        Math.ceil((INACTIVITY_TIME - timeSinceLastActivity) / 1000)
      );

      setTimeLeft(remaining);

      if (timeSinceLastActivity >= INACTIVITY_TIME && !isModalOpen) {
        handleInactivity();
      }
    }, 1000);

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(inactivityTimer);
    };
  }, [lastActivity, isModalOpen, handleInactivity, resetInactivityTimer]);

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

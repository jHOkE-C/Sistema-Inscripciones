import { useState, useEffect, useCallback } from "react";

export const useInactivityModalViewModel = (clean: () => void) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const [timeLeft, setTimeLeft] = useState(90);

    // Tiempo de inactividad en milisegundos (90 segundos)
    const INACTIVITY_TIME = 90 * 1000;

    // Función que se ejecuta cuando hay inactividad
    const handleInactivity = useCallback(() => {
        console.log("Usuario inactivo por 90 segundos");
        localStorage.setItem("lastActivity", new Date().toISOString());
        setIsModalOpen(true);
        clean();
    }, [clean]);

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

    return {
        timeLeft
    };
}; 
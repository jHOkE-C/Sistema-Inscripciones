import { useState } from "react";
import { ClipboardList, FileText, Upload } from "lucide-react";
import type React from "react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const usePasosViewModel = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      title: "Inscribir Postulante/s",
      description:
        "Complete el formulario de inscripción con sus datos personales",
      icon: ClipboardList,
    },
    {
      id: 2,
      title: "Generar Orden de Pago",
      description: "Genere la orden de pago para proceder con su inscripción",
      icon: FileText,
    },
    {
      id: 3,
      title: "Subir Comprobante",
      description: "Suba el comprobante de pago para finalizar su inscripción",
      icon: Upload,
    },
  ];

  return {
    activeStep,
    setActiveStep,
    steps
  };
}; 
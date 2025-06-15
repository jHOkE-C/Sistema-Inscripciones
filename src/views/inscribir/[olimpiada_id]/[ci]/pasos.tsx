"use client";

import type React from "react";

import { useState } from "react";
import { ClipboardList, FileText, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Pasos() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps: Step[] = [
    {
      id: 1,
      title: "Inscribir Postulante/s",
      description:
        "Complete el formulario de inscripción con sus datos personales",
      icon: <ClipboardList className="h-6 w-6" />,
    },
    {
      id: 2,
      title: "Generar Orden de Pago",
      description: "Genere la orden de pago para proceder con su inscripción",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: 3,
      title: "Subir Comprobante",
      description: "Suba el comprobante de pago para finalizar su inscripción",
      icon: <Upload className="h-6 w-6" />,
    },
  ];

  return (
    <div className="container mx-auto p-4 max-w-5xl h-full ">
      

      {/* Versión móvil (vertical) */}
      <div className="md:hidden">
        <div className="relative">
          {steps.map((step) => (
            <div key={step.id} className="flex mb-4 last:mb-0">
              {/* Línea conectora vertical */}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="flex items-center"
                      onMouseEnter={() => setActiveStep(step.id)}
                      onMouseLeave={() => setActiveStep(null)}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary border-2 border-primary">
                        {step.icon}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">Paso {step.id}</p>
                        <p>{step.title}</p>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{step.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </div>

      {/* Versión desktop (horizontal) */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center relative">
      
          {/* Pasos */}

          {steps.map((step) => (
            <TooltipProvider key={step.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex flex-col items-center"
                    onMouseEnter={() => setActiveStep(step.id)}
                    onMouseLeave={() => setActiveStep(null)}
                  >
                    <div
                      className={`
                        flex items-center justify-center w-12 h-12 rounded-full 
                        bg-primary/10 text-primary border-2 border-primary
                        ${
                          activeStep === step.id
                            ? "bg-primary text-primary-foreground"
                            : ""
                        }
                        transition-all duration-200 cursor-pointer
                      `}
                    >
                      {step.icon}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">Paso {step.id}</p>
                      <p className="text-sm">{step.title}</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{step.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

    </div>
  );
}

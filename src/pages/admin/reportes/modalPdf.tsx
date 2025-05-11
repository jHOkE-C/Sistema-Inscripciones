import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from '@/hooks/useApiRequest';

interface Postulante {
  nombre: string;
  apellidos: string;
  ci: string;
  fechaNac: string;
  area: string;
  categoria: string;
  departamento: string;
  provincia: string;
  colegio: string;
  grado: string;
  responsable: string;
  responsableCi: string;
  estado: "Pagado" | "Pendiente";
}

interface ModalPdfProps {
  gestion: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ordenarPostulantes = (data: Postulante[]): Postulante[] => {
  return [...data].sort((a, b) => {
    if (a.estado === "Pagado" && b.estado === "Pendiente") return -1;
    if (a.estado === "Pendiente" && b.estado === "Pagado") return 1;

    const responsableComp = a.responsable.localeCompare(b.responsable);
    if (responsableComp !== 0) return responsableComp;

    return a.apellidos.localeCompare(b.apellidos);
  });
};

const crearPdfDocumento = (
  postulantesData: Postulante[],
  gestionValor: string
): { doc: jsPDF; dataUrl: string } | null => {
  if (!postulantesData.length) return null;

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const margin = 15;

  doc.setFontSize(16);
  doc.text(
    `Postulantes — Gestión ${gestionValor}`,
    doc.internal.pageSize.getWidth() / 2,
    margin,
    { align: 'center' }
  );

  const tableColumn = [
    "Nombre", "Apellidos", "CI", "Fecha Nac.", "Área", "Categoría",
    "Dpto.", "Provincia", "Colegio", "Grado", "Responsable", "Resp. CI", "Estado"
  ];
  const tableRows: (string | null)[][] = [];

  postulantesData.forEach(p => {
    const postulanteFila = [
      p.nombre, p.apellidos, p.ci, p.fechaNac, p.area, p.categoria,
      p.departamento, p.provincia, p.colegio, p.grado,
      p.responsable, p.responsableCi, p.estado,
    ];
    tableRows.push(postulanteFila);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: margin + 10,
    margin: { left: margin, right: margin },
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    tableWidth: 'auto',
  });
  
  const finalY = (doc as any).lastAutoTable?.finalY || (margin + 10);
  if (finalY > doc.internal.pageSize.getHeight() - margin) {
  }

  const dataUrl = doc.output('datauristring');
  return { doc, dataUrl };
};

const ModalPdf: React.FC<ModalPdfProps> = ({ gestion, isOpen, onOpenChange }) => {
  const [postulantes, setPostulantes] = useState<Postulante[] | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setPostulantes(null);
      setPdfDataUrl('');
      setPdfDoc(null);
      setIsLoading(false);
    } else if (gestion) {
      setPostulantes(null);
      setPdfDataUrl('');
      setPdfDoc(null);
      setIsLoading(false);
    }
  }, [isOpen, gestion]);

  const handleGenerarReporte = useCallback(async () => {
    if (!gestion) {
      toast.error("Por favor, seleccione una gestión válida antes de generar el reporte.");
      return;
    }
    setIsLoading(true);
    setPdfDataUrl('');
    setPostulantes(null);
    setPdfDoc(null);

    try {
      const apiUrl = `${API_URL}/api/olimpiadas/${gestion}/inscripciones-detalladas`
      const response = await fetch(apiUrl);

      if (!response.ok) {
        let errorMsg = `Error HTTP: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (e: unknown) {
            if (e instanceof Error) {
                errorMsg = e.message;
            } else {
                errorMsg = "Ocurrió un error inesperado";
            }
        }
        throw new Error(errorMsg);
      }
      const data: Postulante[] = await response.json();
      console.log(data);
      if (data.length === 0) {
        setPostulantes([]);
      } else {
        const postulantesOrdenados = ordenarPostulantes(data);
        setPostulantes(postulantesOrdenados);
        const pdfOutput = crearPdfDocumento(postulantesOrdenados, gestion);
        if (pdfOutput) {
          setPdfDoc(pdfOutput.doc);
          setPdfDataUrl(pdfOutput.dataUrl);
        } else {
          setPostulantes([]);
          toast.error("No se pudo generar el documento PDF.");
        }
      }
    } catch (error) {
      console.error("Error al generar reporte:", error);
      toast.error((error as Error).message || "Ocurrió un error al obtener los datos para el reporte.");
      setPostulantes(null); 
    } finally {
      setIsLoading(false);
    }
  }, [gestion]);

  const handleExportarPdf = () => {
    if (pdfDoc && gestion) {
      pdfDoc.save(`postulantes_${gestion}.pdf`);
    } else {
      toast.error("No hay documento PDF para exportar o la gestión no está definida.");
    }
  };

  let modalContent;
  if (isLoading) {
    modalContent = (
      <div className="flex flex-col items-center justify-center h-72">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Generando reporte, por favor espere...</p>
      </div>
    );
  } else if (pdfDataUrl && postulantes && postulantes.length > 0) {
    modalContent = (
      <>
        <iframe
          src={pdfDataUrl}
          className="w-full h-[calc(75vh-100px)] border rounded-md bg-gray-100"
          title={`Reporte de Postulantes - Gestión ${gestion}`}
        />
        <DialogFooter className="mt-4 pt-4 border-t">
          <Button onClick={handleExportarPdf}>
            Exportar a PDF
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </>
    );
  } else if (postulantes !== null && postulantes.length === 0) {
    modalContent = (
      <div className="flex flex-col items-center justify-center h-72">
        <Alert  className="w-full max-w-md text-center">
          <AlertTitle className="text-lg font-semibold">Sin Registros</AlertTitle>
          <AlertDescription className="mt-2">
            No existen registros de postulantes para la gestión seleccionada.
          </AlertDescription>
        </Alert>
        <DialogFooter className="mt-6">
            <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
            </DialogClose>
        </DialogFooter>
      </div>
    );
  } else {
    modalContent = (
      <div className="flex flex-col items-center justify-center h-72">
        <p className="mb-6 text-center text-muted-foreground max-w-sm">
          {gestion ? `Presione el botón para generar el reporte de postulantes para la gestión ${gestion}.` : "Seleccione una gestión para continuar."}
        </p>
        <Button onClick={handleGenerarReporte} disabled={!gestion || isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generar Reporte
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-[95vw] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Reporte de Postulantes — Gestión {gestion || "N/A"}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto px-6 py-4">
          {modalContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPdf;
import React, { useState, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import './pdf-viewer.css';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import LoadingAlert from '@/components/loading-alert';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface Postulante {
  id?: string;
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
  estado: "Preinscrito" | "Pago Pendiente" | "Inscripcion Completa";
}

interface ModalPdfProps {
  gestion: string | null;
  nombreOlimpiada: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  postulantesFiltrados?: Postulante[];
}

const crearPdfDocumento = (
  postulantesData: Postulante[],
  gestionValor: string
): { doc: jsPDF; dataUrl: string; blob: Blob } | null => {
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


  const dataUrl = doc.output('datauristring');

  const arrayBuffer = doc.output('arraybuffer');
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

  return { doc, dataUrl, blob };
};

const ModalPdf: React.FC<ModalPdfProps> = ({ gestion, nombreOlimpiada, isOpen, onOpenChange, postulantesFiltrados = [] }) => {
  const [postulantes, setPostulantes] = useState<Postulante[] | null>(null);
  const [pdfDataUrl, setPdfDataUrl] = useState<string>('');
  const [pdfDoc, setPdfDoc] = useState<jsPDF | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isGeneratingFromApi, setIsGeneratingFromApi] = useState<boolean>(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setScale(window.innerWidth < 768 ? 1.1 : 1.0);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);


  useEffect(() => {
    if (isOpen && postulantesFiltrados.length > 0) {
      const postulantesOrdenados = postulantesFiltrados;
      setPostulantes(postulantesOrdenados);

      const pdfOutput = crearPdfDocumento(postulantesOrdenados, nombreOlimpiada);
      if (pdfOutput) {
        setPdfDoc(pdfOutput.doc);
        setPdfDataUrl(pdfOutput.dataUrl);
        setPdfBlob(new Blob([pdfOutput.blob], { type: 'application/pdf' }));
      } else {
        setPostulantes([]);
        toast.error("No se pudo generar el documento PDF.");
      }
    } else if (isOpen && postulantesFiltrados.length === 0 && !isGeneratingFromApi) {
      setPostulantes([]);
    }
  }, [isOpen, postulantesFiltrados, nombreOlimpiada]);

  const generarReporte = useCallback(async () => {
    if (!gestion) {
      toast.error("Por favor, seleccione una gestión válida antes de generar el reporte.");
      return;
    }

    // Solo generamos desde la API si no tenemos datos filtrados
    if (postulantesFiltrados.length === 0) {
      setIsGeneratingFromApi(true);
      setPdfDataUrl('');
      setPostulantes(null);
      setPdfDoc(null);
      setPdfBlob(null);
      setNumPages(null);
      setPageNumber(1);

      try {
        if (postulantesFiltrados.length === 0) {

          setPostulantes([]);
        } else {
          const postulantesOrdenados = postulantesFiltrados;
          setPostulantes(postulantesOrdenados);
          const pdfOutput = crearPdfDocumento(postulantesOrdenados, nombreOlimpiada);
          if (pdfOutput) {
            setPdfDoc(pdfOutput.doc);
            setPdfDataUrl(pdfOutput.dataUrl);
            setPdfBlob(new Blob([pdfOutput.blob], { type: 'application/pdf' }));
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
        setIsGeneratingFromApi(false);
      }
    }
  }, [gestion, nombreOlimpiada, postulantesFiltrados]);

  useEffect(() => {
    if (isOpen && gestion && postulantesFiltrados.length === 0) {
      generarReporte();
    }
  }, [isOpen, gestion, generarReporte, postulantesFiltrados.length]);

  const handleExportarPdf = () => {
    if (pdfDoc && gestion) {
      pdfDoc.save(`postulantes_${gestion}.pdf`);
    } else {
      toast.error("No hay documento PDF para exportar o la gestión no está definida.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    setPageNumber(page => Math.max(page - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(page => Math.min(page + 1, numPages || 1));
  };

  const zoomIn = () => {
    setScale(prevScale => {
      const maxScale = isMobile ? 2.0 : 3.0;
      return Math.min(prevScale + 0.2, maxScale);
    });
  };

  const zoomOut = () => {
    setScale(prevScale => {
      const minScale = isMobile ? 1.0 : 1.1;
      return Math.max(prevScale - 0.2, minScale);
    });
  };

  const escogerHeader = () => {
    if (pdfDataUrl && postulantes && postulantes.length > 0) {
      return <div className="absolute z-1 bg-background m-2 rounded-[4px]">
        <Button onClick={handleExportarPdf} variant="outline"
        className='flex items-center justify-center bg-background'>
          <Download className="h-4 w-4" />
          <span>Descargar</span>
        </Button>
      </div>
    }
    if (postulantes !== null && postulantes.length === 0) {
      return <DialogTitle className="text-lg font-semibold">Sin Registros</DialogTitle>
    }
    return <DialogTitle className="text-lg font-semibold">Espere por favor</DialogTitle>

  }



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          `${pdfDataUrl && postulantes && postulantes.length > 0 ?
            'bg-transparent p-0 border-none xl:max-w-screen w-full h-full sm:max-w-screen md:max-w-screen lg:max-w-screen '
            :
            'bg-background '
          } 
           flex flex-col  rounded-l`}
      >

        <DialogHeader className="w-full max-w-md text-center">
          {escogerHeader()}
        </DialogHeader>
        {pdfDataUrl && postulantes && postulantes.length > 0 ? (

          <div className="flex flex-col flex-grow overflow-hidden p-0 h-full w-full">
            <div className="pdf-controls flex items-center justify-between gap-2 bg-background/40">
              <Button onClick={goToPrevPage} disabled={pageNumber <= 1} variant="outline" size="icon" title="Página anterior">
                <ChevronLeft className="h-3 w-3" />
              </Button>

              <span className="text-xl whitespace-nowrap">{pageNumber || '-'}</span>
              <span className="text-xl whitespace-nowrap">/ {numPages || '-'}</span>

              <Button onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)} variant="outline" size="icon" title="Página siguiente">
                <ChevronRight className="h-3 w-3" />
              </Button>

              <Button onClick={zoomOut} variant="outline" size="icon" title="Reducir">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xl w-10 text-center whitespace-nowrap">{Math.round(scale * 100)}%</span>
              <Button onClick={zoomIn} variant="outline" size="icon" title="Ampliar" className="ml-2">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex justify-center flex-grow overflow-auto bg-transparent h-full w-full relative touch-pan-x">
              <Document
                file={pdfBlob}
                onLoadSuccess={onDocumentLoadSuccess}
                className="pdf-document h-full bg"
                loading={
                  <LoadingAlert />
                }
                error={
                  <div className="error-message p-4 text-center bg-red-50 rounded-md border border-red-200">
                    <p className="text-red-500 font-medium">Error al cargar el PDF</p>
                    <p className="text-sm text-gray-500 mt-1">Intente generar el reporte nuevamente</p>
                  </div>
                }
                noData={
                  <div className="no-data p-4 text-center bg-yellow-50 rounded-md border border-yellow-200">
                    <p className="text-yellow-500 font-medium">No hay datos disponibles</p>
                  </div>
                }
              >
                <div className="overflow-x-auto">
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="shadow-lg bg-white mx-auto"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div className="loading-indicator flex flex-col items-center justify-center p-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    }
                    width={isMobile ? undefined : undefined}
                  />
                </div>
              </Document>
            </div>
          </div>

        ) : postulantes !== null && postulantes.length === 0 ? (
          <>
            <DialogDescription className="mt-2">
              No existen registros de postulantes para la gestión seleccionada.
            </DialogDescription>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <LoadingAlert />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalPdf;
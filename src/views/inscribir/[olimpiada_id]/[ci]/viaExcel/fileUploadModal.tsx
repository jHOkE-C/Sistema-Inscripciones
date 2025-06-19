"use client";

import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from "@/components/fileUpload";
import LoadingAlert from "@/components/loading-alert";
import { Olimpiada } from "@/models/interfaces/versiones";
import { useFileUploadModalViewModel } from "@/viewModels/usarVistaModelo/inscribir/olimpiada/viaExcel/useFileUploadModalViewModel";

interface FileUploadModalProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  onFilesChange?: (files: File[]) => void;
  triggerText?: string;
  title?: string;
  description?: string;
  olimpiada: Olimpiada;
  onSubmit?: () => void;
}

export default function FileUploadModal({
  maxFiles = 1,
  maxSize = 10,
  accept = ".xlsx,.xls",
  onFilesChange,
  triggerText = "Subir archivos",
  title = "Añadir archivo excel",
  description = "Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí.",
  olimpiada,
  onSubmit = () => {},
}: FileUploadModalProps) {
  const {
    files,
    open,
    setOpen,
    loading,
    errores,
    erroresDeFormatoExcel,
    cargandoCategorias,
    handleFilesChange,
    handleProcesar,
  } = useFileUploadModalViewModel({ olimpiada, onSubmit });

  const handleFilesChangeWrapper = (newFiles: File[]) => {
    handleFilesChange(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <FileUpload
            maxFiles={maxFiles}
            maxSize={maxSize}
            accept={accept}
            onFilesChange={handleFilesChangeWrapper}
          />
          {errores.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Errores encontrados:</h4>
              {errores.map((error, index) => (
                <div key={index} className="text-sm text-red-500">
                  {error.mensaje}
                </div>
              ))}
            </div>
          )}
          {erroresDeFormatoExcel.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Errores de formato:</h4>
              {erroresDeFormatoExcel.map((error, index) => (
                <div key={index} className="text-sm text-red-500">
                  {error.mensaje}
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleProcesar}
            disabled={files.length === 0 || loading || cargandoCategorias}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Procesar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      {loading && <LoadingAlert />}
    </Dialog>
  );
}

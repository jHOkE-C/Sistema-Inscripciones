"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Upload, X, FileText, ImageIcon, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FileUploadModalProps {
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string;
  onFilesChange?: (files: File[]) => void;
  triggerText?: string;
  title?: string;
  description?: string;
}

export function FileUploadModal({
  maxSize = 10, // 10MB default
  accept = ".xlsx,.xls",
  onFilesChange,
  triggerText = "Subir archivos",
  title = "Añadir archivo excel",
  description = "Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí.",
}: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setError(null);

    // Check if adding these files would exceed the max number of files
    if (files.length > 0 || selectedFiles.length > 1) {
      setError(`Solo puedes subir un archivo.`);
      return;
    }

    // Only take the first file if multiple are selected
    const file = selectedFiles[0];

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(
        `El archivo "${file.name}" excede el tamaño máximo de ${maxSize}MB.`
      );
      return;
    }

    // Replace any existing file
    const newFiles = [file];
    setFiles(newFiles);

    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (file.type.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleConfirm = () => {
    // Here you would typically handle the final submission of files
    // For example, uploading them to a server
    setOpen(false);
  };

  const handleCancel = () => {
    setFiles([]);
    setError(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              "cursor-pointer hover:border-primary/50 hover:bg-muted/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">
                Arrastra y suelta archivos aquí
              </h3>
              <p className="text-sm text-muted-foreground">
                o haz clic para seleccionar archivos
              </p>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="mt-2"
              >
                Explorar
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Solo un archivo. Tamaño máximo {maxSize}MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={accept}
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
            />
          </div>

          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

          {files.length > 0 && (
            <div className="mt-4 max-h-[200px] overflow-y-auto">
              <h4 className="text-sm font-medium mb-2">
                Archivos seleccionados:
              </h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getFileIcon(file)}
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Eliminar archivo</span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={files.length === 0}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

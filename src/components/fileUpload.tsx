import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileText, ImageIcon, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { API_URL } from '@/viewModels/hooks/useApiRequest';


type UploadFile = File & { url_plantilla?: string };

interface FileUploadProps {
    maxFiles?: number;
    maxSize?: number;
    accept?: string;
    onFilesChange?: (files: UploadFile[]) => void;
    oldFiles?: UploadFile[];
    filesRefresh?: UploadFile[];
}

export default function FileUpload({
    maxFiles = 1,
    maxSize = 10,
    accept = ".xlsx,.xls",
    onFilesChange,
    filesRefresh,
    oldFiles,
}: FileUploadProps) {
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (filesRefresh) {
            setFiles(filesRefresh);
        }
    }, [filesRefresh]);

    
    const handleDownload = (e: React.MouseEvent<HTMLButtonElement>, file: UploadFile) => {
        e.stopPropagation();
        e.preventDefault();
        if (file.url_plantilla) {
            const url = `${API_URL}/storage/${file.url_plantilla}`;
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            link.click();
        } else {
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleFileChange = (selectedFiles: FileList | null) => {
        console.log('selectedFiles', selectedFiles);
        if (!selectedFiles || selectedFiles.length === 0) {
            return;
        };

        setError(null);

        const currentSelectedFiles = Array.from(selectedFiles); 
        const validNewFiles: UploadFile[] = [];
        let cumulativeError: string | null = null;

        for (const file of currentSelectedFiles) {
            if (file.size > maxSize * 1024 * 1024) {
                cumulativeError = `El archivo "${file.name}" excede el tamaño máximo de ${maxSize}MB.`;
                break;
            }

            const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
            const acceptedTypes = accept.split(',').map(t => t.trim().toLowerCase());
            if (!acceptedTypes.includes(fileExtension) && !acceptedTypes.includes(file.type)) {
                 cumulativeError = `El archivo "${file.name}" (${fileExtension}) no tiene un formato válido (${accept}).`;
                 break;
            }
            validNewFiles.push(file as UploadFile);
        }

        if (cumulativeError) {
            setError(cumulativeError);
             if (onFilesChange) {
                onFilesChange(files);
            }
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        let updatedFiles: UploadFile[];

        if (maxFiles === 1) {
            updatedFiles = validNewFiles.length > 0 ? [validNewFiles[0]] : [];
        } else {
            const totalPotentialFiles = files.length + validNewFiles.length;
            if (totalPotentialFiles > maxFiles) {
                setError(`Puedes subir un máximo de ${maxFiles} archivos. Has intentado añadir ${validNewFiles.length} a los ${files.length} existentes.`);
                 if (fileInputRef.current) fileInputRef.current.value = "";
                 if (onFilesChange) {
                    onFilesChange(files);
                 }
                return;
            }
            updatedFiles = [...files, ...validNewFiles];
        }

        setFiles(updatedFiles);
        if (onFilesChange) {
            onFilesChange(updatedFiles);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
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

    const handleRemoveFile = (indexToRemove: number) => {
        setError(null);
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
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

    const getFileIcon = (file: UploadFile) => {
         const extension = file.name.split('.').pop()?.toLowerCase();
         if (file.type.startsWith("image/")) {
            return <ImageIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />;
        } else if (file.type.includes("pdf")) {
            return <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />;
        } else if (extension === 'xlsx' || extension === 'xls') {
             return <FileIcon className="h-5 w-5 text-green-600 flex-shrink-0" />;
        }
        else {
            return <FileIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />;
        }
    };

    return (
        <>
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-all duration-300 mt-4",
                    isDragging ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2" : "border-muted-foreground/25 hover:border-primary/50",
                    error ? "border-destructive bg-destructive/5" : "",
                     "cursor-pointer hover:bg-muted/50"
                )}
                onDragOver={(e) => { handleDragOver(e);  }}
                onDragLeave={(e) => { handleDragLeave(e)}}
                onDrop={(e) => { handleDrop(e) }}
                onClick={() => openFileDialog()}
            >
                <div className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
                    <Upload className={cn("h-10 w-10", error ? "text-destructive" : "text-muted-foreground")} />
                    <h3 className="text-lg font-medium">
                        {isDragging ? "Suelta archivo(s) aquí" : "Arrastra y suelta o haz click"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                         {maxFiles === 1 ? "para seleccionar tu archivo" : `para seleccionar hasta ${maxFiles} archivo(s)`}
                    </p>
                     {(files.length < maxFiles) && (
                         <Button
                         
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                openFileDialog();
                            }}
                            className="mt-2 pointer-events-auto"
                        >
                            Explorar Archivos
                        </Button>
                     )}
                    <p className="text-xs text-muted-foreground mt-2">
                         {maxFiles === 1 ? `Archivo único (${accept}), Máx ${maxSize}MB.` : `${maxFiles} archivos máx (${accept}), ${maxSize}MB por archivo.`}
                    </p>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={maxFiles > 1}
                    accept={accept}
                    onChange={(e) => handleFileChange(e.target.files)}
                    className="hidden"
                />
            </div>  

            <div className="mt-2 min-h-[1.25rem] text-sm text-destructive">
                 {error && <span>{error}</span>}
            </div>
            {oldFiles && oldFiles.length > 0 && (
            <div
                className={cn(
                   "overflow-hidden transition-all duration-500 ease-in-out mt-2 mb-6",
                   oldFiles.length > 0
                        ? 'max-h-[300px] opacity-100'
                        : 'max-h-0 opacity-0'
               )}
                style={{ maxHeight: oldFiles.length > 0 ? '300px' : '0px' }}
           >
                <div className="">
                    <h4 className="text-sm font-medium mb-2">
                        {maxFiles === 1 ? "Archivo subido anteriormente:" : `Archivos subidos anteriormente: (${oldFiles.length}/${maxFiles})`}
                    </h4>
                    <ul className="space-y-2">
                       {oldFiles.map((file, index) => (
                           <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between rounded-md border p-2">
                               <div className="flex items-center gap-2 truncate min-w-0">
                                   {getFileIcon(file)}
                                   <button type="button" className="text-sm truncate flex-1 text-blue-600 underline text-left" onClick={(e)=> handleDownload(e, file)}>
                                       {file.name}
                                   </button>
                                   <span className="text-xs text-muted-foreground whitespace-nowrap">
                                       ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                                   </span>
                               </div>
                           </li>
                       ))}
                   </ul>
                </div>
            </div>
            )}
            <div
                 className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out mt-2 mb-6",
                    files.length > 0
                         ? 'max-h-[300px] opacity-100'
                         : 'max-h-0 opacity-0'
                )}
                 style={{ maxHeight: files.length > 0 ? '300px' : '0px' }}
            >
                 {files.length > 0 && (
                    <div className="">
                         <h4 className="text-sm font-medium mb-2">
                              {maxFiles === 1 ? "Archivo seleccionado:" : `Archivos seleccionados: (${files.length}/${maxFiles})`}
                         </h4>
                         <ul className="space-y-2">
                            {files.map((file, index) => (
                                <li
                                    key={`${file.name}-${file.lastModified}-${index}`}
                                    className="flex items-center justify-between rounded-md border p-2"

                                >
                                    <div className="flex items-center gap-2 truncate min-w-0">
                                        {getFileIcon(file)}
                                        <button
                                            type="button"
                                            className="text-sm truncate flex-1 text-blue-600 underline text-left"
                                            onClick={(e) => handleDownload(e, file)}
                                        >
                                            {file.name}
                                        </button>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
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
                                        className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0 ml-2"
                                        aria-label={`Eliminar archivo ${file.name}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                            
                        </ul>
                    </div>
                 )}
             </div>

        </>
    );
}

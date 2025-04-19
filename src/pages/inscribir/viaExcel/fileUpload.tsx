import { useState, useRef } from "react";
import { Upload, X, FileText, ImageIcon, FileIcon} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
    maxFiles?: number;
    maxSize?: number; // in MB
    accept?: string;
    onFilesChange?: (files: File[]) => void;
}

export default function FileUpload({
    maxFiles = 1, // Default to 1 file maximum
    maxSize = 10, // 10MB default
    accept = ".xlsx,.xls",
    onFilesChange
}: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (selectedFiles: FileList | null) => {
        console.log('selectedFiles', selectedFiles);
        if (!selectedFiles) return;
        setError(null);

        // Check if adding these files would exceed the max number of files
        if (files.length > 0 || selectedFiles.length > 1) {
            setError(`Solo puedes subir un archivo.`);
            return;
        }

        // Only take the first file if multiple are selected
        const selectedFile = selectedFiles[0];

        // Check file size
        if (selectedFile.size > maxSize * 1024 * 1024) {
            setError(
                `El archivo "${selectedFile.name}" excede el tamaño máximo de ${maxSize}MB.`
            );
            return;
        }

        // Check file type
        if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
            setError("Por favor, suba un archivo Excel (.xlsx o .xls)");
            return;
        }

        // Replace any existing file
        const newFiles = [selectedFile, ...files];
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

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            droppedFile.type === 'application/vnd.ms-excel')) {
            handleFileChange(e.dataTransfer.files);
        }
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

    const isTooManyFiles = files.length > maxFiles;

    return (
        <>
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
                        Solo un archivo excel (.xlsx o .xls).
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
            
            {isTooManyFiles && (
                <div className="mt-2 text-sm text-red-500">
                    Has sobrepasado el límite de {maxFiles} archivos. Por favor, elimina algunos.
                </div>
            )}
            
            <div className="mt-4 max-h-[200px] overflow-y-auto">
                {files.length > 0 && (
                    <h4 className="text-sm font-medium mb-2">
                        Archivos seleccionados:
                    </h4>
                )}

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
        </>
    );
}

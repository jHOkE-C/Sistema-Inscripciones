"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { createWorker, Worker } from 'tesseract.js';
import cv from '@techstark/opencv-js';
import FileUpload from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import LoadingAlert from '@/components/loading-alert';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { cambiarEstadoLista } from "@/api/listas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

//opencv no tiene soporte en ts brous
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CvMat = any;

interface ProcessedImageData {
  id: string;
  name: string;
  dataUrl: string | null;
}

interface ExtractedData {
  nro: string | null;
  fecha: string | null;
  nroControl: string | null;
  documento: string | null;
  fullText: string | null;
}

interface OcrResult {
  id: string;
  name: string;
  extractedData: ExtractedData | null;
  processingTime?: number;
}

const SubirComprobantePage = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImages, setProcessedImages] = useState<ProcessedImageData[]>([]);
  const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCvReady, setIsCvReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tesseractWorker, setTesseractWorker] = useState<Worker | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { ci, codigo, olimpiada_id } = useParams();

  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef1 = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef2 = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef3 = useRef<HTMLCanvasElement>(null);
  const outputCanvasRefs = [outputCanvasRef1, outputCanvasRef2, outputCanvasRef3];

  useEffect(() => {
    if (typeof cv !== 'undefined' && cv.onRuntimeInitialized) {
      cv.onRuntimeInitialized = () => {
        console.log('OpenCV Runtime inicializado');
        setIsCvReady(true);
      };
    } else {
      const intervalId = setInterval(() => {
        if (typeof cv !== 'undefined' && cv.Mat) {
          console.log('OpenCV detectado vía intervalo.');
          setIsCvReady(true);
          clearInterval(intervalId);
        }
      }, 500);
      return () => clearInterval(intervalId);
    }
  }, []);

  const terminarRegistro = async () => {
    console.log("terminando registro");
    if (!codigo) {
      toast.error("No se encontró el código de la lista");
      return;
    }
    if (!selectedResultId) {
      toast.error("Debe seleccionar uno de los resultados de OCR");
      return;
    }

    const selectedResult = ocrResults.find(result => result.id === selectedResultId);
    if (!selectedResult?.extractedData?.nro || !selectedResult?.extractedData?.fecha) {
      toast.error("El resultado seleccionado no contiene número o fecha. Por favor, suba una imagen con mejor calidad.");
      return;
    }

    try {
      //recordatorio por ahora esta asi ya que falta el endpoint
      console.log("cambiando estado a Pago Pendiente", cambiarEstadoLista);
      if (olimpiada_id && ci) {
        navigate(`/inscribir/${olimpiada_id}/${ci}/subirComprobanteDePago/${codigo}/subir`);
      } else {
        toast.error("Información de navegación incompleta");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ha ocurrido un error inesperado");
      }
    }
  };

  useEffect(() => {
    const initializeWorker = async () => {
      const worker = await createWorker('spa', 1);
      setTesseractWorker(worker);
      console.log('Worker de Tesseract inicializado');
    };
    initializeWorker();
    return () => {
      tesseractWorker?.terminate();
    };
  }, []);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        setError('Por favor, sube un archivo PNG, JPG o JPEG.');
        setOriginalFile(null);
        setProcessedImages([]);
        setOcrResults([]);
        return;
      }

      if (file.size < 1048576) {
        setError('La imagen debe pesar al menos 1MB para asegurar buena calidad.');
        setOriginalFile(null);
        setProcessedImages([]);
        setOcrResults([]);
        return;
      }

      setOriginalFile(file);
      setError(null);
      setProcessedImages([]);
      setOcrResults([]);
      setSelectedResultId(null);
    } else {
      setOriginalFile(null);
      setProcessedImages([]);
      setOcrResults([]);
      setError(null);
      setSelectedResultId(null);
    }
  };

  const adjustGamma = (src: CvMat, gamma: number): CvMat => {
    const invGamma = 1.0 / gamma;
    const table = new cv.Mat(1, 256, cv.CV_8U);
    for (let i = 0; i < 256; i++) {
      table.ucharPtr(0, i)[0] = Math.pow(i / 255.0, invGamma) * 255;
    }
    const dst = new cv.Mat();
    if (src.channels() === 1) {
      cv.LUT(src, table, dst);
    } else {
      const channels = new cv.MatVector();
      cv.split(src, channels);
      for (let i = 0; i < channels.size(); i++) {
        const ch = channels.get(i);
        const processed = new cv.Mat();
        cv.LUT(ch, table, processed);
        channels.set(i, processed);
        ch.delete();
      }
      cv.merge(channels, dst);
      channels.delete();
    }
    table.delete();
    return dst;
  };

  const analizarExposicion = (
    mat: CvMat
  ): { mediana: number; estado: string; gammaRecomendado: number } => {
    console.log('Analizando exposición...');
    const src = mat.clone();
    const gray = new cv.Mat();
    if (src.channels() > 1) {
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    } else {
      src.copyTo(gray);
    }

    const hist = new cv.Mat();
    const matVector = new cv.MatVector();
    matVector.push_back(gray);
    cv.calcHist(matVector, [0], new cv.Mat(), hist, [256], [0, 256]);

    const pixelTotal = gray.rows * gray.cols;
    let pixelAcumulado = 0;
    let mediana = 0;
    for (let i = 0; i < 256; i++) {
      pixelAcumulado += hist.data32F[i];
      if (pixelAcumulado >= pixelTotal / 2) {
        mediana = i;
        break;
      }
    }

    let estado = 'bien expuesta';
    let gammaRecomendado = 1;
    if (mediana < 100) {
      estado = 'subexpuesta';
      gammaRecomendado = 0.7 + (mediana / 100) * 0.3;
    } else if (mediana > 155) {
      estado = 'sobreexpuesta';
      gammaRecomendado = 1 + ((mediana - 155) / 100) * 0.5;
    }

    src.delete();
    gray.delete();
    hist.delete();
    matVector.delete();

    return { mediana, estado, gammaRecomendado };
  };

  const applyGrayscalePipeline = (src: CvMat): CvMat => {
    console.log('Pipeline gris → denoise → γ → CLAHE → Otsu');
    const gray = new cv.Mat();
    const denoised = new cv.Mat();
    const gammaAdjusted = new cv.Mat();
    const claheMat = new cv.Mat();
    const binary = new cv.Mat();

    try {
      if (src.channels() > 1) {
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      } else {
        src.copyTo(gray);
      }

      cv.medianBlur(gray, denoised, 3);

      const { estado, gammaRecomendado } = analizarExposicion(denoised);

      if (estado !== 'bien expuesta') {
        const tmp = adjustGamma(denoised, gammaRecomendado);
        tmp.copyTo(gammaAdjusted);
        tmp.delete();
      } else {
        denoised.copyTo(gammaAdjusted);
      }

      const clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      clahe.apply(gammaAdjusted, claheMat);
      clahe.delete();

      cv.threshold(claheMat, binary, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

      return binary.clone();
    } catch (e) {
      console.error('Error pipeline gris:', e);
      return src.clone();
    } finally {
      gray.delete();
      denoised.delete();
      gammaAdjusted.delete();
      claheMat.delete();
      binary.delete();
    }
  };

  const applyColorPipeline = (src: CvMat): CvMat => {
    console.log('Pipeline color → denoise → CLAHE(L) → γ');
    const rgb = new cv.Mat();
    const denoised = new cv.Mat();
    const lab = new cv.Mat();
    const channels = new cv.MatVector();
    const enhancedL = new cv.Mat();
    const mergedLab = new cv.Mat();
    let result: CvMat;

    try {
      if (src.channels() === 1) {
        cv.cvtColor(src, rgb, cv.COLOR_GRAY2RGB);
      } else {
        cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
      }

      cv.bilateralFilter(rgb, denoised, 9, 75, 75, cv.BORDER_DEFAULT);

      cv.cvtColor(denoised, lab, cv.COLOR_RGB2Lab);
      cv.split(lab, channels);
      const clahe = new cv.CLAHE(4.0, new cv.Size(8, 8));
      clahe.apply(channels.get(0), enhancedL);
      channels.set(0, enhancedL);
      cv.merge(channels, mergedLab);
      clahe.delete();

      const colorEnhanced = new cv.Mat();
      cv.cvtColor(mergedLab, colorEnhanced, cv.COLOR_Lab2RGB);

      const { estado, gammaRecomendado } = analizarExposicion(colorEnhanced);
      if (estado !== 'bien expuesta') {
        result = adjustGamma(colorEnhanced, gammaRecomendado);
        colorEnhanced.delete();
      } else {
        result = colorEnhanced;
      }

      return result.clone();
    } catch (e) {
      console.error('Error pipeline color:', e);
      return src.clone();
    } finally {
      rgb.delete();
      denoised.delete();
      lab.delete();
      enhancedL.delete();
      mergedLab.delete();
      for (let i = 0; i < channels.size(); i++) channels.get(i).delete();
      channels.delete();
    }
  };

  const runOCR = async (
    worker: Worker,
    imageDataUrl: string,
    id: string,
    name: string
  ): Promise<OcrResult> => {
    console.log(`Ejecutando OCR para: ${name}`);
    const start = performance.now();
    try {
      const {
        data: { text }
      } = await worker.recognize(imageDataUrl);
      const extracted = extractData(text);
      return {
        id,
        name,
        extractedData: extracted,
        processingTime: performance.now() - start
      };
    } catch (err) {
      console.error(`Error OCR (${name}):`, err);
      return {
        id,
        name,
        extractedData: {
          nro: null,
          fecha: null,
          nroControl: null,
          documento: null,
          fullText: `Error en OCR: ${err instanceof Error ? err.message : String(err)}`
        }
      };
    }
  };

  const extractData = (text: string): ExtractedData => {
    //datos importantes
    const nroMatch = text.match(/([Nn][Rr]?[Oo]?\.?\s*\d+(?:[\s.]+\d+)*)/i);
    const fechaMatch = text.match(/([Ff][Ee]?[Cc]?[Hh]?[Aa]?\s*:?\s*\d{2}[-/]\d{2}[-/]\d{2,4}(?:\s+\d{2}[-:]\d{2})?)/i);
    const nroControl = text.match(/([Nn][Rr]?[Oo]?\.?\s*(?:[Dd][Ee]\s*)?[Cc][Oo][Nn][Tt][Rr][Oo][Ll]\s*:?\s*\d+(?:[\s.-]+\d+)*)/i);
    const documento = text.match(/([Dd][Oo][Cc][Uu][Mm][Ee][Nn][Tt][Oo]\s*:?\s*\d+(?:[\s.-]+\d+)*)/i);
    return {
      nro: nroMatch ? nroMatch[1] : null,
      fecha: fechaMatch ? fechaMatch[1] : null,
      nroControl: nroControl ? nroControl[1] : null,
      documento: documento ? documento[1] : null,
      fullText: text || null
    };
  };

  const processImage = useCallback(async () => {
    if (!originalFile || !isCvReady || !tesseractWorker || isLoading) return;

    setIsLoading(true);
    setError(null);
    setProcessedImages([]);
    setOcrResults([]);

    const imageURL = URL.createObjectURL(originalFile);
    const imgElement = document.createElement('img');

    imgElement.onload = async () => {
      try {
        if (!inputCanvasRef.current) throw new Error('Input canvas ref missing');
        const ctx = inputCanvasRef.current.getContext('2d');
        if (!ctx) throw new Error('No 2D context');

        inputCanvasRef.current.width = imgElement.naturalWidth;
        inputCanvasRef.current.height = imgElement.naturalHeight;
        ctx.drawImage(imgElement, 0, 0);

        const src = cv.imread(inputCanvasRef.current);

        const pipelines = [
          { id: 'grayscale', name: 'Escala de Grises Optimizada', processFunc: applyGrayscalePipeline },
          { id: 'color', name: 'Color Optimizado', processFunc: applyColorPipeline }
        ];

        const processedDataUrls: ProcessedImageData[] = [];
        const ocrPromises: Promise<OcrResult>[] = [];

        for (let i = 0; i < pipelines.length; i++) {
          const { id, name, processFunc } = pipelines[i];
          const outputCanvas = outputCanvasRefs[i]?.current;
          if (!outputCanvas) throw new Error(`Output canvas ${i} no disponible`);

          console.log(`Procesando -> ${name}`);
          const processedMat = processFunc(src);

          cv.imshow(outputCanvas, processedMat);
          const dataUrl = outputCanvas.toDataURL(originalFile.type);
          processedDataUrls.push({ id, name, dataUrl });

          ocrPromises.push(runOCR(tesseractWorker, dataUrl, id, name));

          processedMat.delete();
        }

        setProcessedImages(processedDataUrls);
        setOcrResults(await Promise.all(ocrPromises));

        src.delete();
        URL.revokeObjectURL(imageURL);
      } catch (err) {
        console.error('Error procesando imagen:', err);
        setError(`Error procesando imagen: ${err instanceof Error ? err.message : String(err)}`);
        URL.revokeObjectURL(imageURL);
      } finally {
        setIsLoading(false);
      }
    };

    imgElement.onerror = () => {
      setError('No se pudo cargar la imagen.');
      setIsLoading(false);
      URL.revokeObjectURL(imageURL);
    };

    imgElement.src = imageURL;
  }, [originalFile, isCvReady, tesseractWorker, isLoading, applyGrayscalePipeline, applyColorPipeline, outputCanvasRefs, runOCR]);

  const checkOcrDataValidity = () => {
    if (ocrResults.length === 0) return false;
    
    const hasValidData = ocrResults.some(
      result => result.extractedData?.nro && result.extractedData?.fecha
    );
    
    if (!hasValidData && processedImages.length > 0) {
      toast.error("No se pudieron detectar el número y la fecha en la imagen. Por favor, suba una nueva imagen con mejor calidad.");
      return false;
    }
    
    return hasValidData;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subir Comprobante y Extraer Datos</h1>

      <canvas ref={inputCanvasRef} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef1} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef2} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef3} style={{ display: 'none' }} />

      {isLoading || !isCvReady || !tesseractWorker ? (
        <>
          {!isCvReady && <LoadingAlert message="Cargando OpenCV..." />}
          {!tesseractWorker && <LoadingAlert message="Cargando Tesseract..." />}
        </>
      ) : (
        <div className="mb-4 p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-lg font-semibold mb-2">1. Cargar Imagen del Recibo</h2>
          <FileUpload
            onFilesChange={(files) => handleFileChange(files[0] ?? null)}
            accept="image/png, image/jpeg, image/jpg"
            maxSize={10}
            maxFiles={1}
            oldFiles={[]}
            filesRefresh={originalFile ? [originalFile] : []}
          />
          {originalFile && <p className="text-sm mt-2">Archivo seleccionado: {originalFile.name}</p>}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {ocrResults.length === 0 && originalFile && isCvReady && tesseractWorker && (
        <Button onClick={processImage} disabled={isLoading} className="mb-4 w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Procesar Imagen y Extraer Texto'
          )}
        </Button>
      )}

      {processedImages.length > 0 && (
        <div className="mb-4 p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-lg font-semibold mb-2">2. Imágenes Procesadas</h2>
          {processedImages.map((imgData) => (
            <div key={imgData.id} className="border p-2 rounded">
              <h3 className="text-center font-medium mb-1">{imgData.name}</h3>
              {imgData.dataUrl ? (
                <img
                  src={imgData.dataUrl}
                  alt={`Procesado ${imgData.name}`}
                  className="w-full h-auto object-contain max-h-80"
                />
              ) : (
                <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500">
                  No disponible
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {ocrResults.length > 0 && (
        <div className="p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-lg font-semibold mb-2">3. Resultados del OCR</h2>
          <p className="text-sm mb-4 text-indigo-500">Seleccione el resultado que muestre la información más clara:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {ocrResults.map((result) => (
              <div 
                key={result.id} 
                className={`border p-3 rounded bg-background break-words cursor-pointer hover:border-primary transition-colors ${
                  selectedResultId === result.id ? "ring-8 ring-primary border-primary" : ""
                }`}
                onClick={() => setSelectedResultId(result.id)}
              >
                <h3 className="font-medium mb-1">{result.name}</h3>
                {result.processingTime && (
                  <p className="text-xs text-muted-foreground mb-1">
                    Tiempo: {(result.processingTime / 1000).toFixed(2)}s
                  </p>
                )}
                {result.extractedData ? (
                  <>
                    <p className="text-sm">
                      <strong className="font-semibold">Nro.:</strong>{' '}
                      {result.extractedData.nro || 'No encontrado'}
                    </p>
                    <p className="text-sm">
                      <strong className="font-semibold">Fecha:</strong>{' '}
                      {result.extractedData.fecha || 'No encontrado'}
                    </p>
                    <p className="text-sm">
                      <strong className="font-semibold">Nro. Control:</strong>{' '}
                      {result.extractedData.nroControl || 'No encontrado'}
                    </p>
                    <p className="text-sm">
                      <strong className="font-semibold">Documento:</strong>{' '}
                      {result.extractedData.documento || 'No encontrado'}
                    </p>
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                        Texto completo
                      </summary>
                      <p className="text-xs mt-1 p-2 bg-muted rounded max-h-60 overflow-y-auto whitespace-pre-wrap">
                        {result.extractedData.fullText || 'No disponible'}
                      </p>
                    </details>
                  </>
                ) : (
                  <p className="text-sm text-red-500">Error en OCR.</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="w-full" 
                  disabled={!selectedResultId || !checkOcrDataValidity()}
                >
                  Finalizar y Enviar Comprobante
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    ¿Está seguro que desea finalizar el registro?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción impedirá el registro de nuevos postulantes a la lista
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={terminarRegistro}>
                    Continuar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubirComprobantePage;

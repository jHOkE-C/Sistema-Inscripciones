"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useOpenCv, type CvModule } from '@/hooks/useOpencv';
import ReturnComponent from '@/components/ReturnComponent';
import FileUpload from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown } from 'lucide-react';
import LoadingAlert from '@/components/loading-alert';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { pagarLista } from "@/api/listas";
import {
  createWorker,
  PSM,
  Worker
} from 'tesseract.js';//opencv no tiene soporte en ts brous
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
  ordenPago: string | null;
  fullText: string | null;
}

interface OcrResult {
  id: string;
  name: string;
  extractedData: ExtractedData | null;
}

const SubirComprobantePage = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImages, setProcessedImages] = useState<ProcessedImageData[]>([]);
  const [ocrResults, setOcrResults] = useState<OcrResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cv, setCv] = useState<CvModule | null>(null);
  const [isCvReady, setIsCvReady] = useState<boolean>(false);
  const [isOpenCvLoading, setIsOpenCvLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tesseractWorker, setTesseractWorker] =
  useState<Worker | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { codigo } = useParams();

  const inputCanvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef1 = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef2 = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef3 = useRef<HTMLCanvasElement>(null);
  const outputCanvasRefs = useMemo(() => [outputCanvasRef1, outputCanvasRef2, outputCanvasRef3], 
    [outputCanvasRef1, outputCanvasRef2, outputCanvasRef3]);
  
  
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const loadCv = useOpenCv();

  useEffect(() => {
    setIsOpenCvLoading(true);
    loadCv()
      .then((cvModule) => {
        setCv(cvModule);
        setIsCvReady(true);
        console.log('OpenCV Runtime inicializado via hook');
      })
      .catch(err => {
        console.error("Error cargando OpenCV via hook:", err);
        setError("No se pudo cargar OpenCV. Intente recargar la página.");
        setIsCvReady(false);
      })
      .finally(() => {
        setIsOpenCvLoading(false);
      });
  }, [loadCv]);

  const terminarRegistro = async () => {
    if (!codigo) {
      toast.error("No se encontró el código de la lista");
      return;
    }
    const selectedResult:OcrResult | undefined = ocrResults.find(result => result.id === selectedResultId);
    if (!selectedResult?.extractedData?.ordenPago || !selectedResult?.extractedData?.fecha) {
      toast.error("El resultado seleccionado no contiene Orden de Pago o fecha. Por favor, suba una imagen con mejor calidad o revise los datos extraídos.");
      return;
  }
    try {
      console.log(
        codigo,
        selectedResult.extractedData.ordenPago, 
        selectedResult.extractedData.fecha,
      );
      await pagarLista( 
        codigo, 
        selectedResult?.extractedData?.nro ?? "",
        selectedResult.extractedData.fecha, 
        selectedResult.extractedData.ordenPago 
      );
      navigate(`..\\..\\`);
      toast.success("La orden pago fue valida exitosamente");    
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ha ocurrido un error inesperado");
      }
      navigate(`..\\..\\`);
    }
  };

  useEffect(() => {
    const initializeWorker = async () => {
      const worker: Worker = await createWorker('spa',1);
    
      await worker.setParameters({
        user_defined_dpi:          '300',
        tessedit_pageseg_mode:     PSM.SINGLE_BLOCK,
        preserve_interword_spaces: '1',
        tessedit_char_whitelist:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:- '
      });
    
      setTesseractWorker(worker);
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

      if (file.size < 348576) {
        setError('La imagen debe pesar al menos 300kb para asegurar buena calidad.');
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

  const adjustGamma = useCallback((src: CvMat, gamma: number): CvMat => {
    if (!cv) throw new Error("cv no está listo para adjustGamma");
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
  }, [cv]);

  const analizarExposicion = useCallback((
    mat: CvMat
  ): { mediana: number; estado: string; gammaRecomendado: number } => {
    if (!cv) throw new Error("cv no está listo para analizarExposicion");
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
  }, [cv]);

  const extractData = useCallback((raw: string): ExtractedData => {
    
    console.log(raw);
    const norm = raw
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .replace(/[|()[\]<>]/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  
    console.log(norm);
    
    const first = (rxs: RegExp[]) => rxs.find(rx => rx.test(norm))?.exec(norm) ?? null;
    const digits = (s: string) => s.replace(/\D/g, "");
    const firstMatch = (rxs: RegExp[]) =>
      rxs.reduce<RegExpExecArray | null>((m, rx) => m || rx.exec(norm), null);
    
    const NRO_PATTERNS: RegExp[] = [
      /\bN(?:R?[O0])?[.:u00ad-]?\s*([A-Z0-9](?:\s*[0-9O]){6,})\b/,
    

      /\bNR[O0]8?\s*([0-9O](?:\s*[0-9O]){6,})\b/,
    

      /\bN[u00bau00b0]\s*([0-9O](?:\s*[0-9O]){6,})\b/,
    

      /\bNUM(?:ERO)?[.:u00ad-]?\s*([0-9O](?:\s*[0-9O]){6,})\b/,
    ];

  
    const nroMatch = first(NRO_PATTERNS);
  
  
    const nro = nroMatch ? digits(nroMatch[1]) : null;
    
    const ctrlMatch = firstMatch([
      /\bN\w{0,3}\s*(?:CONTR[O0]L|CONTROL|CANCROL)\s*[:-]?\s*([A-Z]?\d+)\b/,
    ]);
    const nroControl = ctrlMatch ? digits(ctrlMatch[1]) : null;

    
    const docMatch = firstMatch([
      /\b[DP]?OCU\w*\s*[:-]?\s*([A-Z]?\d[\dA-Z.-]*)\b/, // DOCUMENTO / POCUMENTA
    ]);
    const documento = docMatch ? digits(docMatch[1]) : null;

const ORDENPAGO_PATTERNS: RegExp[] = [
  /\b(?:O|0)\s*[FP]\s*([0-9OQDSBGILZ]{1,7})\b/i,
  /\bOP([0-9OQDSBGILZ]{1,7})\b/i,
];

const DIGIT_MAP: Record<string, string> = {
  'O':'0','Q':'0','D':'0',
  'I':'1','L':'1','|':'1',
  'Z':'2',
  'S':'5',
  'G':'6',
  'B':'8',
  'g':'9','q':'9'
};

const toDigits7 = (raw: string) =>
  raw
    .split('')
    .map(c => DIGIT_MAP[c.toUpperCase()] ?? c)
    .join('')
    .replace(/\D/g, '')         
    .slice(0, 7);                             

  const ordenPagoMatch = firstMatch(ORDENPAGO_PATTERNS);
  const ordenPago = ordenPagoMatch ? toDigits7(ordenPagoMatch[1]) : null;

  
  const fechaLabel = /\bF\w?E?\w?C?\w?H?\w?A?\b\s*[:-]?\s*([0-9/\- ]{6,}(?:\s+[0-9:]{4,5})?)/;
  
  const fechaPlain = /(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})(?:\s+(\d{1,2})[:-](\d{2}))?/;
  
  const fechaCompact = /\b(\d{2})(\d{2})(\d{2,4})\b/;

  let fecha: string | null = null;

  const labeled = fechaLabel.exec(norm);
  const dated = labeled ? fechaPlain.exec(labeled[1]) : fechaPlain.exec(norm);

  if (dated) {
    const [, d, m, y, hh, mm] = dated;
    fecha = `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${(+y < 100 ? "20" : "") + y}`;
    if (hh && mm) fecha += ` ${hh.padStart(2, "0")}:${mm}`;
  } else {
    const compact = fechaCompact.exec(norm);
    if (compact) {
      const [, d, m, y] = compact;
      fecha = `${d}-${m}-${(+y < 100 ? "20" : "") + y}`;
    }
  }
    return { nro, fecha, nroControl, documento, ordenPago, fullText: norm || null };
  }, []);

  const applyGrayscalePipeline = useCallback((src: CvMat): CvMat => {
    if (!cv) throw new Error("cv no está listo para applyGrayscalePipeline");
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
  }, [cv, analizarExposicion, adjustGamma]);

  const scaleGraysPipelineV2 = useCallback((src: CvMat): CvMat => {
    if (!cv) throw new Error("cv no está listo para scaleGraysPipelineV2");
    const CLAHE_CLIP = 1.5;   // contraste local
    const BLOCK      = 31;    // tamaño del bloque del umbral adaptativo
    const C_TH       = 11;    // C más alto u21d2 menos "sal y pimienta"
    const KSIZE      = 3;     // kernel elíptico 3u00d73
    const MIN_AREA   = 20;    // elimina manchas < 20 pxu00b2
  
    const gray   = new cv.Mat(), blur = new cv.Mat(), claheMat = new cv.Mat();
    const den    = new cv.Mat(), bin  = new cv.Mat(), mask    = new cv.Mat();
    const res    = new cv.Mat(), lbls = new cv.Mat(), stats   = new cv.Mat(), cents = new cv.Mat();
  
    try {
      /* 1) gris + blur ligero ............................................... */
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
  
      /* 2) CLAHE con clip=1.5 y tile 16u00d716 .................................. */
      const clahe = new cv.CLAHE(CLAHE_CLIP, new cv.Size(16, 16));
      clahe.apply(blur, claheMat);
      clahe.delete();
  
      /* 3) Denoise suave: medianBlur 3u00d73  ................................... */
      cv.medianBlur(claheMat, den, 3);
  
      /* 4) Umbral adaptativo (block 31, C 11) ............................... */
      cv.adaptiveThreshold(
        den, bin, 255,
        cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY,
        BLOCK, C_TH
      );
  
      /* 5) Una sola apertura (kernel 3u00d73) ................................... */
      const k = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(KSIZE, KSIZE));
      cv.morphologyEx(bin, res, cv.MORPH_OPEN, k, new cv.Point(-1, -1), 1);
      k.delete();

      /* 5u00bd) Engrosar 1 px los trazos */
      const dilK = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
      cv.dilate(res, res, dilK, new cv.Point(-1, -1), 1);
      dilK.delete();
  
      /* 6) Filtrado por área: borra manchas < 20 pxu00b2 ........................ */
      const nComp = cv.connectedComponentsWithStats(res, lbls, stats, cents);
      for (let i = 1; i < nComp; i++) {                 // 0 = fondo
        if (stats.intAt(i, cv.CC_STAT_AREA) < MIN_AREA) {
          const constant = new cv.Mat(lbls.rows, lbls.cols, lbls.type(), new cv.Scalar(i));
          cv.compare(lbls, constant, mask, cv.CMP_EQ);
          constant.delete();
          res.setTo(new cv.Scalar(0), mask);
        }
      }
  
      /* 7) Invertir para OCR ............................................... */
      cv.bitwise_not(res, res);
      return res.clone();
  
    }catch (e) {
      console.error('Error pipeline gris:', e);
      
    } finally {           // liberación de memoria
      gray.delete(); blur.delete(); claheMat.delete(); den.delete();
      bin.delete(); mask.delete(); lbls.delete(); stats.delete(); cents.delete();
    }
  }, [cv]);
      
  const runOCR = useCallback(async (
    worker: Worker,
    imageDataUrl: string,
    id: string,
    name: string
  ): Promise<OcrResult> => {
    console.log(`Ejecutando OCR para: ${name}`);
    try {
      const {
        data: { text }
      } = await worker.recognize(imageDataUrl);
      const extracted: ExtractedData = extractData(text);
      return {
        id,
        name,
        extractedData: extracted,
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
          ordenPago: null,
          fullText: `Error en OCR: ${err instanceof Error ? err.message : String(err)}`
        }
      };
    }
  }, [extractData]);

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
        if (!cv) throw new Error('OpenCV module no está cargado');

        inputCanvasRef.current.width = imgElement.naturalWidth;
        inputCanvasRef.current.height = imgElement.naturalHeight;
        ctx.drawImage(imgElement, 0, 0);

        const src = cv.imread(inputCanvasRef.current);

        const pipelines = [
          { id: 'grayscale', name: 'Opción 1:', processFunc: applyGrayscalePipeline },
          { id: 'color', name: 'Opción 2:', processFunc: scaleGraysPipelineV2 }
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
  }, [originalFile, isCvReady, tesseractWorker, isLoading, applyGrayscalePipeline, scaleGraysPipelineV2, runOCR, outputCanvasRefs]);

  const checkOcrDataValidity = () => {
    if (ocrResults.length === 0) return false;
    
    const hasValidData = ocrResults.some(
      result => result.extractedData?.ordenPago && result.extractedData?.fecha
    );
    
    if (!hasValidData && processedImages.length > 0) {
      toast.error("No se pudieron detectar la Orden de Pago y la fecha en la imagen. Por favor, suba una nueva imagen con mejor calidad.");
      return false;
    }
    const selectedResult = ocrResults.find(result => result.id === selectedResultId);
    if (!selectedResult?.extractedData?.ordenPago || !selectedResult?.extractedData?.fecha) {
      toast.error("El resultado seleccionado no contiene Orden de Pago o fecha. Por favor, suba una imagen con mejor calidad o revise los datos extraídos.");
      return false;
    }
        
    return hasValidData;
  };

  useEffect(() => {
    if (ocrResults.length > 0 && step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ocrResults]);

  useEffect(() => {
    if (processedImages.length > 0 && step2Ref.current) {
      step2Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [processedImages]);
  
  useEffect(() => {
    if (selectedResultId && step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedResultId]);

  return (
    <>
      <ReturnComponent />
    <div className="container mx-auto p-4">
    
      <h2 className="text-2xl font-bold mb-4">Subir Comprobante y Extraer Datos</h2>

      <canvas ref={inputCanvasRef} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef1} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef2} style={{ display: 'none' }} />
      <canvas ref={outputCanvasRef3} style={{ display: 'none' }} />

      {isOpenCvLoading ? (
        <LoadingAlert message="Inicializando OpenCV..." />
      ) : !isCvReady ? (
        <LoadingAlert message="Error al cargar OpenCV. Por favor, recargue la página." />
      ) : !tesseractWorker ? (
        <LoadingAlert message="Cargando Tesseract..." />
      ) : (
        <div className="mb-4 p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-lg font-semibold mb-2">Cargar Imagen del Recibo</h2>
          <h3 className="font-semibold mb-2 ">Recomendaciones:</h3>
          <ul className="list-disc list-inside">
            <li>El recibo debe estar recto</li>
            <li>El recibo no debe tener rayaduras o manchas</li>
            <li>La foto del recibo debe tener una iluminación uniforme</li>
          </ul>
          <FileUpload
            onFilesChange={(files) => handleFileChange(files[0] ?? null)}
            accept="image/png, image/jpeg, image/jpg"
            maxSize={10}
            maxFiles={1}
            oldFiles={[]}
            filesRefresh={originalFile ? [originalFile] : []}
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          
          { processedImages.length>0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-muted-foreground mb-2">Baje para ver las imágenes procesadas</p>
                <ChevronDown className="h-8 w-8 text-primary animate-bounce" />
            </div>
          )}
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



      {ocrResults.length > 0 && (
        <div ref={step3Ref} className="p-4 border rounded-md shadow-sm bg-card">
          <h2 className="text-lg font-semibold mb-2">Resultados Obtenidos</h2>
          <div className="flex">
          
          <h2 className="text-lg mb-4 text-indigo-500">Seleccione el resultado que muestre la información prioritaria para validar su comprobante fecha y orden de pago</h2>
          
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {ocrResults.map((result) => (
              <div 
                key={result.id} 
                className={`border p-3 rounded bg-background break-words cursor-pointer hover:border-primary hover:border-4 transition-colors ${
                  selectedResultId === result.id ? "border-4 ring-primary border-primary" : ""
                }`}
                onClick={() => setSelectedResultId(result.id)}
              >
                <h3 className="font-medium mb-1">{result.name}</h3>
                {result.extractedData ? (
                  <>
                    <p className="text-sm">
                      <strong className="font-semibold">Nro.:</strong>{' '}
                      {result.extractedData.nro || 'No encontrado'}
                    </p>
                    <p className="text-sm mb-2">
                      <strong className="font-semibold">Orden de Pago:</strong>{' '}
                      {result.extractedData.ordenPago || 'No encontrado'}
                    </p>
                    <p className="text-sm">
                      <strong className="font-semibold">Fecha:</strong>{' '}
                      {result.extractedData.fecha || 'No encontrado'}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">Error en OCR.</p>
                )}
              </div>
            ))}
          </div>
          {selectedResultId && checkOcrDataValidity() && (
          <div className="mt-8">
                <Button 
                  className="w-full" 
                  onClick={terminarRegistro}
                >
                  Finalizar y Enviar Comprobante
                </Button>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default SubirComprobantePage;

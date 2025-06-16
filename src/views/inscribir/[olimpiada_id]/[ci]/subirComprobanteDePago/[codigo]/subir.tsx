"use client";

import { useRef } from 'react';
import ReturnComponent from '@/components/ReturnComponent';
import FileUpload from '@/components/fileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown } from 'lucide-react';
import LoadingAlert from '@/components/loading-alert';
import { useSubirComprobanteViewModel } from '@/viewModels/usarVistaModelo/inscribir/olimpiada/subir/useSubirComprobanteViewModel';

const SubirComprobantePage = () => {
  const {
    originalFile,
    processedImages,
    ocrResults,
    isLoading,
    isCvReady,
    isOpenCvLoading,
    error,
    selectedResultId,
    inputCanvasRef,
    outputCanvasRefs,
    handleFileChange,
    processImage,
    terminarRegistro,
    setSelectedResultId,
    checkOcrDataValidity
  } = useSubirComprobanteViewModel();

  const step3Ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <ReturnComponent />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Subir Comprobante y Extraer Datos</h2>

        <canvas ref={inputCanvasRef} style={{ display: 'none' }} />
        {outputCanvasRefs.map((ref, index) => (
          <canvas key={index} ref={ref} style={{ display: 'none' }} />
        ))}

        {isOpenCvLoading ? (
          <LoadingAlert message="Inicializando OpenCV..." />
        ) : !isCvReady ? (
          <LoadingAlert message="Error al cargar OpenCV. Por favor, recargue la página." />
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

        {ocrResults.length === 0 && originalFile && isCvReady && (
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

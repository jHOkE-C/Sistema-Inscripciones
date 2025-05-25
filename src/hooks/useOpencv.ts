import { useState, useCallback } from "react";

export interface CvModule {
  locateFile: (file: string, scriptDirectory?: string) => string;
  onRuntimeInitialized: (() => void) | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface OpenCvStatus {
  scriptAdded: boolean;
  initialized: boolean;
  error: string | null;
  wasmLoaded?: boolean;
}

declare global {
  interface Window {
    cv?: CvModule;
    cvLoadingPromise?: Promise<CvModule>;
    __OPENCV_STATUS__?: OpenCvStatus;
    Module?: {
      onRuntimeInitialized?: () => void;
      locateFile?: (path: string) => string;
      wasmBinary?: ArrayBuffer;
    };
  }
}

const SCRIPT_ID = "opencv-script";
const TIMEOUT_MS = 500000;

function getOpenCvStatus(): OpenCvStatus {
  if (!window.__OPENCV_STATUS__) {
    window.__OPENCV_STATUS__ = {
      scriptAdded: false,
      initialized: false,
      error: null,
      wasmLoaded: false
    };
  }
  return window.__OPENCV_STATUS__;
}

function updateOpenCvStatus(updates: Partial<OpenCvStatus>) {
  const status = getOpenCvStatus();
  Object.assign(status, updates);
}

export function useOpenCv() {
  const [cvModule, setCvModule] = useState<CvModule | null>(
    getOpenCvStatus().initialized ? window.cv || null : null
  );

  const load = useCallback(async (): Promise<CvModule> => {
    if (getOpenCvStatus().initialized && window.cv) {
      if (!cvModule) setCvModule(window.cv);
      return window.cv;
    }

    if (window.cvLoadingPromise) {
      return window.cvLoadingPromise;
    }

    window.cvLoadingPromise = new Promise<CvModule>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        updateOpenCvStatus({ 
          error: "Timeout de inicialización de OpenCV",
          scriptAdded: false,
          initialized: false 
        });
        reject(new Error("Timeout de inicialización de OpenCV"));
        delete window.cvLoadingPromise;
        document.getElementById(SCRIPT_ID)?.remove();
      }, TIMEOUT_MS);

      const loadWasm = () => {
        fetch("/opencv/opencv_js.wasm")
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error cargando WASM: ${response.status}`);
            }
            return response.arrayBuffer();
          })
          .then(wasmBinary => {
            window.Module = {
              wasmBinary,
              onRuntimeInitialized: () => {
                if (!window.cv) {
                  reject(new Error("Runtime inicializado pero window.cv no está disponible"));
                  return;
                }
                updateOpenCvStatus({
                  initialized: true,
                  error: null
                });
                setCvModule(window.cv);
                resolve(window.cv);
                delete window.cvLoadingPromise;
                clearTimeout(timeoutId);
              },
              locateFile: (path: string) => `/opencv/${path}`
            };

            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = "/opencv/opencv.js";
            script.async = true;

            script.onload = () => {
              updateOpenCvStatus({ scriptAdded: true });
              
              if (!window.cv) return;

              window.cv.onRuntimeInitialized = () => {
                updateOpenCvStatus({
                  initialized: true,
                  error: null
                });
                setCvModule(window.cv!);
                resolve(window.cv!);
                delete window.cvLoadingPromise;
                clearTimeout(timeoutId);
              };
            };

            script.onerror = () => {
              reject(new Error("Error cargando script de OpenCV"));
              document.getElementById(SCRIPT_ID)?.remove();
              delete window.cvLoadingPromise;
              clearTimeout(timeoutId);
            };

            document.body.appendChild(script);
          })
          .catch(error => {
            reject(error);
            delete window.cvLoadingPromise;
            clearTimeout(timeoutId);
          });
      };

      loadWasm();
    });

    return window.cvLoadingPromise;
  }, [cvModule]);

  return load;
}

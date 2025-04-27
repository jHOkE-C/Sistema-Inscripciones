import * as XLSX from 'xlsx';
import { validarCamposRequeridos } from '@/pages/inscribir/[olimpiada_id]/[ci]/viaExcel/validations';

export interface FileParseResult {
  jsonData: (string | null)[][];
  erroresDeArchivo: { mensaje: string }[];
  erroresDeFormato: { fila: number; columna: string; mensaje: string; hoja: number; campo: string }[];
}

export const parseExcel = async (file: File): Promise<FileParseResult> => {
  const erroresDeArchivo: { mensaje: string }[] = [];
  const erroresDeFormato: FileParseResult['erroresDeFormato'] = [];
  let jsonData: (string | null)[][] = [];
  try {
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: true, cellText: false });
    if (!workbook.SheetNames.length) {
      erroresDeArchivo.push({ mensaje: 'El archivo no contiene hojas' });
    } else {
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      jsonData = XLSX.utils.sheet_to_json(firstSheet, 
        { header: 1, 
          defval: null, 
          raw: false, 
          dateNF: 'dd/mm/yyyy' 
        }) as (string | null)[][];
      const headers = jsonData[0].map(h => h?.toString() || '');
      const faltantes = validarCamposRequeridos(headers);
      erroresDeFormato.push(
        ...faltantes.map(col => ({ fila: 0, 
                                  columna: col, 
                                  mensaje: `Falta columna ${col}`, 
                                  hoja: 0, 
                                  campo: col}))
      );
    }
  } catch (err: any) {
    erroresDeArchivo.push({ mensaje: err.message || 'Error al leer el archivo' });
  }

  return { jsonData, erroresDeArchivo, erroresDeFormato };
};
import * as XLSX from 'xlsx';
import { validarCamposRequeridos } from '@/pages/inscribir/[olimpiada_id]/[ci]/viaExcel/validations';

export interface FileParseResult {
  jsonData: (string | null)[][];
  erroresDeFormato: { fila: number; columna: string; mensaje: string; hoja: number; campo: string }[];
}

export async function ExcelParser(file: File): Promise<FileParseResult> {
  try {
    console.log('Procesando archivo:', file.name);
    if (!file) throw new Error('No se pasó ningún archivo');
    const erroresDeFormato: FileParseResult['erroresDeFormato'] = [];
    console.log('Procesando archivo:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    console.log('Array buffer:', arrayBuffer);
    const data = new Uint8Array(arrayBuffer);
    console.log('Data:', data);
    const workbook = XLSX.read(data, {
      type: 'array',
      cellDates: true,
      cellNF: true,
      cellText: false,
    });
    console.log(workbook);
    if (!workbook.SheetNames.length) {
      throw new Error('El archivo no contiene hojas');
    }
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    // Convert to JSON table
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
      header: 1,
      defval: null,
      raw: false,
      dateNF: 'dd/mm/yyyy',
    }) as (string | null)[][];
    // Validate required headers
    const headers = jsonData[0].map(h => h?.toString() || '') as string[];
    const camposFaltantes = validarCamposRequeridos(headers);
    if (camposFaltantes.length > 0) {
      erroresDeFormato.push(
        ...camposFaltantes.map(col => ({
          fila: 0,
          columna: col,
          mensaje: `Falta columna ${col}`,
          hoja: 0,
          campo: col,
        }))
      );
    }
    return { jsonData, erroresDeFormato };
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    throw new Error('Error al procesar el archivo');
  }
}

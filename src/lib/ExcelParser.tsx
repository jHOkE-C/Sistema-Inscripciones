import * as XLSX from 'xlsx';
import { validarCamposRequeridos } from '@/viewModels/inscribir/excel/validations';

export interface FileParseResult {
  jsonData: (string | null)[][][];
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
    const rawData = XLSX.utils.sheet_to_json(firstSheet, {
      header: 1,
      defval: null,
      raw: true,
    }) as (string | null | number | Date)[][];
    console.log(rawData);
    const jsonData = rawData.map((row, rowIdx) => (
      row.map((cell, colIdx) => {
        if (rowIdx > 0 && colIdx === 3 && cell instanceof Date) {
          const dd = cell.getDate().toString().padStart(2, '0');
          const mm = (cell.getMonth() + 1).toString().padStart(2, '0');
          const yyyy = cell.getFullYear().toString();
          return `${dd}-${mm}-${yyyy}`;
        }
        return cell != null ? String(cell) : null;
      })
    )) as (string | null)[][];
    console.log(jsonData);
    const headers = jsonData[0].map(h => h?.toString() || '') as string[];
    const camposFaltantes = validarCamposRequeridos(headers);
    if (camposFaltantes.length > 0) {
      erroresDeFormato.push(
        ...camposFaltantes.map(faltante => ({
          fila: 1,
          columna: "cabezera" + faltante.columna,
          mensaje: `Falta el nombre de la cabezera:"${faltante.campo}"`,
          hoja: 0,  
          campo: '',
        }))
      );
    }
    const secondSheet = workbook.Sheets[workbook.SheetNames[1]];
    const secondRawData = XLSX.utils.sheet_to_json(secondSheet, {
      header: 1,
      defval: null,
      raw: true,
    }) as (string | null)[][];
    const treeSheet = workbook.Sheets[workbook.SheetNames[2]];
    const treeRawData = XLSX.utils.sheet_to_json(treeSheet, {
      header: 1,
      defval: null,
      raw: true,
    }) as (string | null)[][];
    return { jsonData: [jsonData, secondRawData, treeRawData], erroresDeFormato };
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    throw new Error('Archivo corrupto, Verifique que el archivo no esté corrupto');
  }
}
import React, { useEffect } from 'react';
import * as XLSX from 'xlsx';
import { validarCamposRequeridos } from '@/pages/inscribir/[olimpiada_id]/[ci]/viaExcel/validations';

export interface FileParseResult {
  jsonData: (string | null)[][];
  erroresDeFormato: { fila: number; columna: string; mensaje: string; hoja: number; campo: string }[];
}

interface ExcelParserProps {
  file: File;
  onParsed: (result: FileParseResult) => void;
}

export const ExcelParser: React.FC<ExcelParserProps> = ({ file, onParsed }) => {
  useEffect(() => {
    const parse = async () => {
      const erroresDeFormato: FileParseResult['erroresDeFormato'] = [];
      let jsonData: (string | null)[][] = [];
      try {
        // lectura del archivo
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true, cellNF: true, cellText: false });
        if (!workbook.SheetNames.length) {
          throw new Error('El archivo no contiene hojas');
        } else {
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
            defval: null,
            raw: false,
            dateNF: 'dd/mm/yyyy',
          }) as (string | null)[][];
          // validación de columnas requeridas
          const headers = jsonData[0].map(h => h?.toString() || '');
          const faltantes = validarCamposRequeridos(headers);
          erroresDeFormato.push(
            ...faltantes.map(col => ({
              fila: 0,
              columna: col,
              mensaje: `Falta columna ${col}`,
              hoja: 0,
              campo: col,
            }))
          );
        }
      } catch (err: any) {
        throw new Error(err.message || 'Error al leer el archivo');
      }
      onParsed({ jsonData, erroresDeFormato });
    };
    if (file) parse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return null;
};

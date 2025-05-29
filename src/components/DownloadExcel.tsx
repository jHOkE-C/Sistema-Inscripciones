import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Postulante {
  id?: string;
  nombre: string;
  apellidos: string;
  ci: string;
  fechaNac: string;
  area: string;
  categoria: string;
  departamento: string;
  provincia: string;
  colegio: string;
  grado: string;
  responsable: string;
  responsableCi: string;
  estado: "Preinscrito" | "Pago Pendiente" | "Inscripcion Completa";
}

interface DownloadExcelProps {
  data: Postulante[];
  fileName: string;
}

const formatGrado = (grado: string): string => {
  const gradoNum = parseInt(grado.replace(/\D/g, ''));
  if (isNaN(gradoNum)) return grado;
  
  if (gradoNum <= 6) {
    return `${gradoNum}° P`;
  } else {
    return `${gradoNum - 6}° S`;
  }
};

const DownloadExcel: React.FC<DownloadExcelProps> = ({ data, fileName }) => {
  const handleDownloadExcel = () => {
    
    const formattedData = data.map(postulante => ({
      ...postulante,
      grado: formatGrado(postulante.grado)
    }));

    
    const wb = XLSX.utils.book_new();
    
    
    const ws = XLSX.utils.json_to_sheet(formattedData);
    
    
    const colWidths = [
      { wch: 20 }, // nombre
      { wch: 20 }, // apellidos
      { wch: 15 }, // ci
      { wch: 15 }, // fechaNac
      { wch: 20 }, // area
      { wch: 20 }, // categoria
      { wch: 15 }, // departamento
      { wch: 15 }, // provincia
      { wch: 30 }, // colegio
      { wch: 10 }, // grado
      { wch: 20 }, // responsable
      { wch: 15 }, // responsableCi
      { wch: 20 }, // estado
    ];
    ws['!cols'] = colWidths;

    
    XLSX.utils.book_append_sheet(wb, ws, "Postulantes");

    
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleDownloadCSV = () => {
    
    const formattedData = data.map(postulante => ({
      ...postulante,
      grado: formatGrado(postulante.grado)
    }));

    
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const csv = XLSX.utils.sheet_to_csv(ws);

    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Generar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleDownloadExcel}>
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadCSV}>
          CSV (.csv)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadExcel; 
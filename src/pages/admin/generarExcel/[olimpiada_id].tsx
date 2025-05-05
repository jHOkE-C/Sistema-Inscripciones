import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const departamentos = [
    "La Paz",
    "Cochabamba",
    "Santa Cruz",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
];

const provinciasPorDep: Record<string, string[]> = {
    "La Paz": ["El Alto", "Murillo", "Los Andes", "Omasuyos"],
    Cochabamba: ["Cercado", "Quillacollo", "Sacaba"],
    "Santa Cruz": ["Andrés Ibáñez", "Vallegrande"],
    // …añade las demás
};


function colLetter(n: number): string {
    let s = "";
    while (n > 0) {
        const m = (n - 1) % 26;
        s = String.fromCharCode(65 + m) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}

const Page = () => {
    const handleDownload = async () => {
        const wb = new ExcelJS.Workbook();
        const numFilas = 50;

        // 1) Hoja principal
        const ws = wb.addWorksheet("Inscripciones");
        ws.columns = [
            { key: "nombre", width: 20 },
            { key: "apellidos", width: 25 },
            { key: "ci", width: 15 },
            { key: "fecha_nac", width: 18 },
            { key: "email", width: 30 },
            { key: "departamento", width: 20 }, // F
            { key: "provincia", width: 20 }, // G
            // …otras…
        ];
        // Filas vacías para plantilla
        const emptyRows = Array(numFilas).fill([
            "",
            "",
            "",
            "",
            "",
            "" /* …resto… */,
        ]);
        ws.addTable({
            name: "PlantillaInscripcion",
            ref: "A1",
            headerRow: true,
            style: { theme: "TableStyleLight8", showRowStripes: true },
            columns: [
                { name: "Nombre" },
                { name: "Apellidos" },
                { name: "CI" },
                { name: "Fecha de nacimiento" },
                { name: "Correo electrónico" },
                { name: "Departamento" },
                { name: "Provincia" },
                // …otras…
            ],
            rows: emptyRows,
        });
        // 2) Hoja oculta con listas y Named Ranges
        const listSheet = wb.addWorksheet("Lists",
            // { state: "hidden" }
            );
        departamentos.forEach((dep, idx) => {
            // Sólo sustituimos espacios: La Paz → La_Paz
            const header = dep.replace(/\s+/g, "_");
            const items = provinciasPorDep[dep] || [];
            const colIdx = idx + 1;
            const letter = colLetter(colIdx);

            //  –––––––––––––––––––––––––––––––––––––––––––––––––––––
            // Importante: el primer elemento debe ser null para que
            // header quede en fila 1 y items en fila 2…
            listSheet.getColumn(colIdx).values = [null, header, ...items];
            // –––––––––––––––––––––––––––––––––––––––––––––––––––––

            if (items.length > 0) {
                wb.definedNames.add(
                    header,
                    `Lists!$${letter}$2:$${letter}$${items.length + 1}`
                );
            }
        });

        // 3) Validaciones: Departamento & Provincia (por celda)
        const depsListFormula = `"${departamentos.join(",")}"`;
        for (let i = 2; i <= numFilas + 1; i++) {
            // Departamento
            ws.getCell(`F${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [depsListFormula],
                showErrorMessage: true,
                errorStyle: "warning",
                errorTitle: "Valor inválido",
                error: "Selecciona un departamento",
            };
            // Provincia dependiente
            ws.getCell(`G${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT(F${i})`],
                showErrorMessage: true,
                errorStyle: "warning",
                errorTitle: "Valor inválido",
                error: "Selecciona una provincia válida",
            };
        }

        // 4) Generar y descargar
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), "plantilla_inscripcion.xlsx");
    };

    return (
        <div className="container mx-auto pt-5 max-w-5xl">
            <h1 className="font-semibold text-3xl">
                Generación de plantilla de Excel
            </h1>
            <p>Presiona el botón para descargar la plantilla de inscripción</p>
            <Button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white"
            >
                Generar Excel
            </Button>
        </div>
    );
};

export default Page;

import { apiClient } from "@/api/request";
import ExcelJS, { type Workbook, type Worksheet } from "exceljs";
import { saveAs } from "file-saver";

export const generarExcel = async (
    id_olimpiada: string | number,
    nombre?: string
) => {
    const res = apiClient.get("/api/" + id_olimpiada);
    console.log(res);
    const wb = new ExcelJS.Workbook();
    const numFilas = 50;

    const SheetPlantilla = () => {
        const ws = wb.addWorksheet("Inscripciones");

        const emptyRows = Array(numFilas).fill([""]);
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
                { name: "Colegio" },
                { name: "Grado" },
                { name: "Teléfono de referencia" },
                { name: "Teléfono pertenece a" },
                { name: "Correo de referencia" },
                { name: "Correo pertenece a" },
                { name: "Área categoría 1" },
                { name: "Área categoría 2" },
            ],
            rows: emptyRows,
        });
        for (let i = 2; i <= numFilas + 1; i++) {
            // Departamento
            ws.getCell(`F${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=Lists!$A$1:$${colLetter(departamentos.length)}$1`],
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
    };
    const SheetList = () => {
        const listSheet = wb.addWorksheet(
            "Lists"
            // { state: "hidden" }
        );
        agregarDepartamentos(wb, listSheet);
        agregarGrados(wb, listSheet);
        agregarPertenencias(wb, listSheet);
    };
    SheetPlantilla();
    SheetList();
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
        new Blob([buf]),
        `${nombre ? nombre : "plantilla_inscripcion"}.xlsx`
    );
};
const agregarDepartamentos = (wb: Workbook, listSheet: Worksheet) => {
    departamentos.forEach((dep, idx) => {
        // Sólo sustituimos espacios: La Paz → La_Paz
        const header = dep.replace(/\s+/g, "_");
        const items = provinciasPorDep[dep] || [];
        const colIdx = idx + 1;
        const letter = colLetter(colIdx);

        listSheet.getColumn(colIdx).values = [header, ...items];

        if (items.length > 0) {
            wb.definedNames.add(
                `Lists!$${letter}$2:$${letter}$${items.length + 1}`,
                header
            );
        }
    });
};
const agregarPertenencias = (wb: Workbook, listSheet: Worksheet) => {
    listSheet.getColumn(9).values = pertenencias;

    wb.definedNames.add(`Lists!$I$1:$I$${pertenencias.length}`, "pertenecias");
};
const agregarGrados = (wb: Workbook, listSheet: Worksheet) => {
    grados.forEach((grado, idx) => {
        listSheet.getColumn(idx + 10).values = [grado];
        console.log(wb);
    });
};
const departamentos = [
    "La_Paz",
    "Cochabamba",
    "Santa_Cruz",
    "Oruro",
    "Potosí",
    "Chuquisaca",
    "Tarija",
    "Beni",
    "Pando",
];

const provinciasPorDep: Record<string, string[]> = {
    La_Paz: [
        "El Alto",
        "Murillo",
        "Los Andes",
        "Omasuyos",
        "Nor Yungas",
        "Sud Yungas",
        "Camacho",
        "Inquisivi",
        "Franz Tamayo",
        "Bautista Saavedra",
        "Manco Kapac",
        "Gualberto Villarroel",
        "José Manuel Pando",
        "Aroma",
        "Pacajes",
        "Abel Iturralde",
        "Ingavi",
        "Larecaja",
        "Loayza",
        "Caranavi",
    ],
    Cochabamba: [
        "Cercado",
        "Quillacollo",
        "Sacaba",
        "Tapacarí",
        "Arani",
        "Capinota",
        "Ayopaya",
        "Campero",
        "Carrasco",
        "Chapare",
        "Esteban Arce",
        "Germán Jordán",
        "Mizque",
        "Punata",
        "Tiraque",
        "Bolívar",
    ],
    Santa_Cruz: [
        "Andrés Ibáñez",
        "Vallegrande",
        "Cordillera",
        "Florida",
        "Ñuflo de Chávez",
        "Sara",
        "Ichilo",
        "Chiquitos",
        "Warnes",
        "Velasco",
        "Caballero",
        "Germán Busch",
        "Obispo Santistevan",
        "Angel Sandoval",
        "Manuel María Caballero",
    ],
    Oruro: [
        "Cercado",
        "Carangas",
        "Poopó",
        "Sajama",
        "Litoral",
        "Pantaleón Dalence",
        "Ladislao Cabrera",
        "Eduardo Avaroa",
        "Saucarí",
        "Tomas Barrón",
        "Sur Carangas",
        "San Pedro de Totora",
        "Sebastián Pagador",
        "Nor Carangas",
        "Challapata",
        "Mejillones",
    ],
    Potosí: [
        "Antonio Quijarro",
        "Rafael Bustillo",
        "Cornelio Saavedra",
        "Charcas",
        "Chayanta",
        "Daniel Campos",
        "Enrique Baldivieso",
        "José María Linares",
        "Modesto Omiste",
        "Nor Chichas",
        "Nor Lípez",
        "Sud Chichas",
        "Sud Lípez",
        "Tomás Frías",
        "Alonso de Ibáñez",
        "Bernardino Bilbao",
    ],
    Chuquisaca: [
        "Azurduy",
        "Zudáñez",
        "Tomina",
        "Yamparáez",
        "Nor Cinti",
        "Sud Cinti",
        "Belisario Boeto",
        "Hernando Siles",
        "Luis Calvo",
        "Oropeza",
    ],
    Tarija: [
        "Cercado",
        "Arce",
        "Gran Chaco",
        "Méndez",
        "Burdet O'Connor",
        "Avilez",
    ],
    Beni: [
        "Cercado",
        "Ballivián",
        "Mamoré",
        "Marbán",
        "Moxos",
        "Iténez",
        "José Ballivián",
        "Vaca Díez",
    ],
    Pando: [
        "Nicolás Suárez",
        "Manuripi",
        "Madre de Dios",
        "Abuná",
        "Federico Román",
    ],
};

const pertenencias = ["Madre/Padre", "Responsable", "Estudiante"];
const grados = [
    "1ro_Primaria",
    "2do_Primaria",
    "3ro_Primaria",
    "4to_Primaria",
    "5to_Primaria",
    "6to_Primaria",
    "1ro_Secundaria",
    "2do_Secundaria",
    "3ro_Secundaria",
    "4to_Secundaria",
    "5to_Secundaria",
    "6to_Secundaria",
];
function colLetter(n: number): string {
    let s = "";
    while (n > 0) {
        const m = (n - 1) % 26;
        s = String.fromCharCode(65 + m) + s;
        n = Math.floor((n - 1) / 26);
    }
    return s;
}

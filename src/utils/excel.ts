import { Colegio, type Categoria } from "@/api/areas";
import { apiClient } from "@/api/request";
import ExcelJS, {
    type Workbook,
    type Worksheet,
} from "exceljs";
import { saveAs } from "file-saver";

export const generarExcel = async (
    id_olimpiada: string | number,
    nombre?: string
) => {
    const res = apiClient.get("/api/olimpiadas/" + id_olimpiada);
    console.log(res);
    const wb = new ExcelJS.Workbook();
    const numFilas = 50;

    const SheetPlantilla = () => {
        const ws = wb.addWorksheet("Inscripciones");
        const columns = [
            { name: "Nombre" },
            { name: "Apellidos" },
            { name: "CI" },
            {
                name: "Fecha de nacimiento",
            },
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
        ];
        ws.getColumn(4).numFmt = "dd/mm/yyyy";

        const emptyRows = Array(numFilas).fill([""]);
        ws.addTable({
            name: "PlantillaInscripcion",
            ref: "A1",
            headerRow: true,
            style: { theme: "TableStyleLight8", showRowStripes: true },
            columns,
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
                showInputMessage: true,
                promptTitle: "Departamento",
                prompt: "seleccione un departamento de la lista",
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
            //referencia
            ws.getCell(`K${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT("pertenencias")`],
                showErrorMessage: true,
                errorStyle: "warning",
                errorTitle: "Valor inválido",
                error: "Selecciona un telefono de referencia",
                showInputMessage: true,
                promptTitle: "Referencias",
                prompt: "Seleccione un tipo de telefono de referencia",
            };
            ws.getCell(`M${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT("pertenencias")`],
                showErrorMessage: true,
                errorStyle: "warning",
                errorTitle: "Valor inválido",
                error: "Selecciona un correo de referencia",
                showInputMessage: true,
                promptTitle: "Referencias",
                prompt: "Seleccione un tipo de correo de referencia",
            };
            ws.getCell(`I${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT("grados")`],
                showErrorMessage: true,
                errorStyle: "warning",
                errorTitle: "Valor inválido",
                error: "Selecciona un grado",
                showInputMessage: true,
                promptTitle: "Grado",
                prompt: "Seleccione un grado",
            };
            for (let index = 0; index < 2; index++) {
                const col = 14 + index
                ws.getCell(`${colLetter(col)}${i}`).dataValidation = {
                    type: "list",
                    allowBlank: true,
                    formulae: [`=INDIRECT("Grado_" & I${i})`],
                    showErrorMessage: true,
                    errorStyle: "warning",
                    errorTitle: "Valor inválido",
                    error: "Selecciona area",
                    showInputMessage: true,
                    promptTitle: "Area-Categoria",
                    prompt: "Seleccione un Area-Categoria si no aparece una lista entonces no hay areas a las que se pueda inscribir",
                };
            }
        }
        for (let i = 1; i <= columns.length; i++) {
            ws.getColumn(colLetter(i)).width = 20;
        }
    };

    SheetPlantilla();
    await SheetList(wb, id_olimpiada);
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
        new Blob([buf]),
        `${nombre ? nombre : "plantilla_inscripcion"}.xlsx`
    );
};
const SheetList = async (wb: Workbook, id_olimpiada: string | number) => {
    const listSheet = wb.addWorksheet("Lists", { state: "hidden" });
    agregarDepartamentos(wb, listSheet);
    await agregarGrados(wb, listSheet);
    agregarPertenencias(wb, listSheet);
    await agregarColegios(wb, listSheet);
    await agregarAreasCategorias(id_olimpiada, wb, listSheet);
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
                `Lists!$${letter}$2:$${letter}$${items.length}`,
                header
            );
        }
    });
};
const agregarPertenencias = (wb: Workbook, listSheet: Worksheet) => {
    listSheet.getColumn(10).values = pertenencias;

    wb.definedNames.add(`Lists!$J$1:$J$${pertenencias.length}`, "pertenencias");
};
const agregarColegios = async (wb: Workbook, listSheet: Worksheet) => {
    try {
        const colegios = await apiClient.get<Colegio[]>("/api/colegios");
        listSheet.getColumn("K").values = colegios.map(({ nombre }) => nombre);
        wb.definedNames.add(`Lists!$K$1:$K:${colegios.length}`, "colegios");
    } catch {
        console.log("hubo un error al obtener los colegios");
    }
};
const agregarGrados = (wb: Workbook, listSheet: Worksheet) => {
    grados.forEach((grado, idx) => {
        listSheet.getColumn(idx + 12).values = [grado];
    });
    wb.definedNames.add(`Lists!$L$1:$W$1`, "grados");
};
function organizarPorGrado(data: Categoria[]) {
    // Primero, obtenemos el grado máximo para definir el tamaño del arreglo
    const gradoMaximo = Math.max(...data.map((item) => item.maximo_grado));

    // Creamos una lista vacía con sublistas por cada grado (del 0 al grado máximo)
    const resultado = Array.from(
        { length: gradoMaximo + 1 },
        () => [] as string[]
    );

    // Llenamos la lista
    data.forEach((item) => {
        const { nombre, areas, minimo_grado, maximo_grado } = item;

        for (let grado = minimo_grado; grado <= maximo_grado; grado++) {
            areas.forEach((area) => {
                resultado[grado].push(`${area.nombre} - ${nombre}`);
            });
        }
    });

    return resultado;
}

const agregarAreasCategorias = async (
    id_olimpiada: string | number,
    wb: Workbook,
    listSheet: Worksheet
) => {
    try {
        const areasCategorias = await apiClient.get<Categoria[]>(
            "/api/categorias/areas/olimpiada/" + id_olimpiada
        );
        const organizado = organizarPorGrado(areasCategorias).slice(1);
        organizado.forEach((areaCategoria, index) => {
            const grado = listSheet.getCell(1, 12 + index).value;
            listSheet.getColumn(12 + index).values = [grado, ...areaCategoria];
            wb.definedNames.add(
                `Lists!$${colLetter(12 + index)}$2:$${colLetter(12 + index)}$${
                    areaCategoria.length
                }`,
                "Grado_" + grados[index]
            );
        });
    } catch {
        console.error("hubo un erro al obtener las areas");
    }
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

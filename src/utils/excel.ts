import { Colegio, type Categoria } from "@/api/areas";
import { apiClient } from "@/api/request";
import { getDepartamentosWithProvinces } from "@/api/ubicacion";
import {
    CONTACTOS_PERMITIDOS,
    grados,
} from "@/interfaces/postulante.interface";
import type { Olimpiada } from "@/pages/admin/version/[id]/types";
import ExcelJS, { type Workbook, type Worksheet } from "exceljs";
import { saveAs } from "file-saver";
let departamentos: string[] = [];

export const generarExcel = async (
    id_olimpiada: string | number,
    nombre?: string
) => {
    const olimpiada = await apiClient.get<Olimpiada>(
        "/api/olimpiadas/" + id_olimpiada
    );
    const wb = new ExcelJS.Workbook();
    const numFilas = 50;

    const SheetPlantilla = async () => {
        const provinciasConDepartamentos =
            await getDepartamentosWithProvinces();
        departamentos = provinciasConDepartamentos.map(({ nombre }) =>
            nombre.replace(" ", "_")
        );

        provinciasConDepartamentos.forEach((dep) => {
            provinciasPorDep[dep.nombre] = dep.provincias.map(
                ({ nombre }) => nombre
            );
        });

        const ws = wb.addWorksheet("Inscripciones");
        let columns = [
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
        ];
        for (let index = 1; index <= olimpiada.limite_inscripciones; index++) {
            columns = [...columns, { name: "Área categoría " + index+ (index>1? "(opcional)" :"") }];
        }

        ws.getColumn(4).numFmt = "dd/mm/yyyy";
        ws.getColumn("J").numFmt = "0";

        const emptyRows = Array(numFilas).fill([null]);
        ws.addTable({
            name: "PlantillaInscripcion",
            ref: "A1",
            headerRow: true,
            style: { theme: "TableStyleLight8", showRowStripes: true },
            columns,
            rows: emptyRows,
        });
        for (let i = 2; i <= numFilas + 1; i++) {
            // Correo
            ws.getCell(`E${i}`).dataValidation = {
                type: "custom",
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: "Correo Inválido",
                error: "Ingrese una dirección de correo válida",
                formulae: [
                    `AND(ISNUMBER(FIND("@",E${i})), ISNUMBER(FIND(".",E${i})), FIND("@",E${i}) < FIND(".",E${i}), LEN(E${i}) > 5)`,
                ],
            };

            // Departamento
            ws.getCell(`F${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=Lists!$A$1:$${colLetter(departamentos.length)}$1`],
                showErrorMessage: true,
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
                errorTitle: "Valor inválido",
                error: "Selecciona una provincia válida",
            };
            ws.getCell(`H${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT("Colegios")`],
                showErrorMessage: true,
                errorTitle: "Valor inválido",
                error: "Selecciona un grado",
                showInputMessage: true,
                promptTitle: "Colegio",
                prompt: "Seleccione un colegio",
            };
            ws.getCell(`I${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT("grados")`],
                showErrorMessage: true,
                errorTitle: "Valor inválido",
                error: "Selecciona un grado",
                showInputMessage: true,
                promptTitle: "Grado",
                prompt: "Seleccione un grado",
            };
            //telefono
            ws.getCell(`J${i}`).dataValidation = {
                type: "custom",
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: "Teléfono Inválido",
                error: "Ingrese un número de teléfono válido (7-8 dígitos)",
                formulae: [
                    `AND(ISNUMBER(J${i}), OR(LEN(TEXT(J${i},"0"))=7, LEN(TEXT(J${i},"0"))=8))`,
                ],
            };
            //referencia
            ws.getCell(`K${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT("pertenencias")`],
                showErrorMessage: true,

                errorTitle: "Valor inválido",
                error: "Selecciona un telefono de referencia",
                showInputMessage: true,
                promptTitle: "Referencias",
                prompt: "Seleccione un tipo de telefono de referencia",
            };
            // Correo
            ws.getCell(`L${i}`).dataValidation = {
                type: "custom",
                allowBlank: true,
                showErrorMessage: true,
                errorTitle: "Correo Inválido",
                error: "Ingrese una dirección de correo válida",
                formulae: [
                    `AND(ISNUMBER(FIND("@",L${i})), ISNUMBER(FIND(".",L${i})), FIND("@",L${i}) < FIND(".",L${i}), LEN(L${i}) > 5)`,
                ],
            };
            ws.getCell(`M${i}`).dataValidation = {
                type: "list",
                allowBlank: true,
                formulae: [`=INDIRECT("pertenencias")`],
                showErrorMessage: true,
                errorTitle: "Valor inválido",
                error: "Selecciona un correo de referencia",
                showInputMessage: true,
                promptTitle: "Referencias",
                prompt: "Seleccione un tipo de correo de referencia",
            };

            for (
                let index = 0;
                index < olimpiada.limite_inscripciones;
                index++
            ) {
                const col = 14 + index;
                ws.getCell(`${colLetter(col)}${i}`).dataValidation = {
                    type: "list",
                    allowBlank: true,
                    formulae: [`=INDIRECT("Grado_" & $I${i})`],
                    showErrorMessage: true,
                    errorStyle: "danger",
                    errorTitle: "Valor inválido",
                    error: "Selecciona area",
                    showInputMessage: true,
                    promptTitle: "Area-Categoria",
                    prompt: "Seleccione un Area-Categoria si no aparece una lista entonces no hay areas a las que se pueda inscribir o cambie de grado",
                };
            }
        }
        for (let i = 1; i <= columns.length; i++) {
            ws.getColumn(colLetter(i)).width = 30;
        }
    };

    await SheetPlantilla();
    await SheetList(wb, id_olimpiada);
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
        new Blob([buf]),
        `${nombre ? nombre : "plantilla_inscripcion"}.xlsx`
    );
};

const SheetList = async (wb: Workbook, id_olimpiada: string | number) => {
    const listSheet = wb.addWorksheet("Lists", { state: "hidden" });
    await agregarDepartamentos(wb, listSheet);
    await agregarGrados(wb, listSheet);
    await agregarPertenencias(wb, listSheet);
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
    const pertenencias = CONTACTOS_PERMITIDOS.map(({ contacto }) => contacto);
    listSheet.getColumn(10).values = pertenencias;

    wb.definedNames.add(`Lists!$J$1:$J$${pertenencias.length}`, "pertenencias");
};
const agregarColegios = async (wb: Workbook, listSheet: Worksheet) => {
    try {
        const colegios = await apiClient.get<Colegio[]>("/api/colegios");
        listSheet.getColumn("K").values = colegios.map(({ nombre }) => nombre);
        wb.definedNames.add(`Lists!$K$1:$K$${colegios.length}`, "Colegios");
    } catch {
        console.log("hubo un error al obtener los colegios");
    }
};
const agregarGrados = (wb: Workbook, listSheet: Worksheet) => {
    grados.forEach(({ nombre }, idx) => {
        listSheet.getColumn(idx + 12).values = [nombre];
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
            if (areaCategoria.length > 0) {
                wb.definedNames.add(
                    `Lists!$${colLetter(12 + index)}$2:$${colLetter(
                        12 + index
                    )}$${areaCategoria.length + 1}`,
                    "Grado_" + grados.map(({ nombre }) => nombre)[index]
                );
            }
        });
    } catch {
        console.error("hubo un erro al obtener las areas");
    }
};

const provinciasPorDep: Record<string, string[]> = {
    La_Paz: [],
    Cochabamba: [],
    Santa_Cruz: [],
    Oruro: [],
    Potosí: [],
    Chuquisaca: [],
    Tarija: [],
    Beni: [],
    Pando: [],
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

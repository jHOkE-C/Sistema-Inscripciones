import { Colegio, type Categoria } from "@/models/api/areas";
import { CONTACTOS, GRADOS } from "@/models/interfaces/postulante.interface";
import type { Olimpiada } from "@/models/types/versiones.type";
import ExcelJS, { type Workbook, type Worksheet } from "exceljs";
import { saveAs } from "file-saver";
import { type Departamento } from "@/models/interfaces/ubicacion.interface";


let departamentos: string[] = [];

export const generarExcel = async (
    OlimpiadaElegida: Olimpiada,
    departamentosConProvincias: Departamento[],
    colegios: Colegio[],
    areasCategorias: Categoria[],
    nombre?: string
) => {
    const olimpiada = OlimpiadaElegida
    const wb = new ExcelJS.Workbook();
    const numFilas = 50;

    const SheetPlantilla = async () => {
        departamentos = departamentosConProvincias.map(({ nombre }) =>
            nombre.replace(" ", "_")
        );
        departamentosConProvincias.forEach((dep) => {
            // convierto el nombre a la clave con guión bajo
            const key = dep.nombre.replace(/\s+/g, "_");
            provinciasPorDep[key] = dep.provincias.map((p) => p.nombre);
        });
        console.log("por dep", provinciasPorDep);

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
          const limiteInscripciones = olimpiada.limite_inscripciones ?? 0;        
            for (let index = 1; index <= limiteInscripciones; index++) {
                columns = [
                    ...columns,
                    {
                        name:
                            "Área categoría " +
                            index +
                            (index > 1 ? " (opcional)" : " "),
                    },
                ];
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
                index < limiteInscripciones;
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
    await SheetList(wb, colegios, areasCategorias);
    const buf = await wb.xlsx.writeBuffer();
    saveAs(
        new Blob([buf]),
        `${nombre ? nombre : "plantilla_inscripcion"}.xlsx`
    );
};

const SheetList = async (wb: Workbook, colegios: Colegio[], areasCategorias: Categoria[]) => {
    const listSheet = wb.addWorksheet("Lists", { state: "hidden" });
        agregarDepartamentos(wb, listSheet);
    agregarGrados(wb, listSheet);
    agregarPertenencias(wb, listSheet);
    agregarColegios(wb, listSheet, colegios);
    agregarAreasCategorias(areasCategorias, wb, listSheet);
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
    const pertenencias = CONTACTOS.map(({ nombre: contacto }) => contacto);
    listSheet.getColumn(10).values = pertenencias;

    wb.definedNames.add(`Lists!$J$1:$J$${pertenencias.length}`, "pertenencias");
};
const agregarColegios = (wb: Workbook, listSheet: Worksheet, colegios: Colegio[]) => {
    try {
        listSheet.getColumn("K").values = colegios.map(({ nombre }) => nombre);
        wb.definedNames.add(`Lists!$K$1:$K$${colegios.length}`, "Colegios");
    } catch {
        console.log("hubo un error al obtener los colegios");
    }
};
const agregarGrados = (wb: Workbook, listSheet: Worksheet) => {
    GRADOS.forEach(({ nombre }, idx) => {
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

const agregarAreasCategorias = (
    areasCategorias: Categoria[],
    wb: Workbook,
    listSheet: Worksheet
) => {
    try {
        const organizado = organizarPorGrado(areasCategorias).slice(1);
        console.log(organizado);
        organizado.forEach((areaCategoria, index) => {
            const grado = listSheet.getCell(1, 12 + index).value;
            listSheet.getColumn(12 + index).values = [grado, ...areaCategoria];
            if (areaCategoria.length > 0) {
                wb.definedNames.add(
                    `Lists!$${colLetter(12 + index)}$2:$${colLetter(
                        12 + index
                    )}$${areaCategoria.length + 1}`,
                    "Grado_" + GRADOS.map(({ nombre }) => nombre)[index]
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

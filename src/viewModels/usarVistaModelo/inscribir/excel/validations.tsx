import {
    CategoriaExtendida,
    GRADOS,
    ExcelPostulante,
    Postulante,
    CONTACTOS,
    type newExcelPostulante,
    type newPostulante,
} from "@/models/interfaces/postulante.interface";
import { ValidationError } from "@/models/interfaces/error.interface";
import {
    Departamento,
    Provincia,
    Colegio,
} from "@/models/interfaces/ubicacion.interface";

export const validarCamposRequeridos = (
    headers: string[]
): { campo: string; columna: string }[] => {
    const camposRequeridos = [
        { columna: "A", nombre: "Nombre" },
        { columna: "B", nombre: "Apellidos" },
        { columna: "C", nombre: "CI" },
        { columna: "D", nombre: "Fecha de nacimiento" },
        { columna: "E", nombre: "Correo electrónico" },
        { columna: "F", nombre: "Departamento" },
        { columna: "G", nombre: "Provincia" },
        { columna: "H", nombre: "Colegio" },
        { columna: "I", nombre: "Grado" },
        { columna: "J", nombre: "Teléfono de referencia" },
        { columna: "K", nombre: "Teléfono pertenece a" },
        { columna: "L", nombre: "Correo de referencia" },
        { columna: "M", nombre: "Correo pertenece a" },
        { columna: "N", nombre: "Área categoría 1" },
    ];

    //fix temporal
    const camposFaltantes = camposRequeridos.filter((campo, i) => {
        const indice = headers.findIndex((h) => {
            return h.normalize().toLocaleLowerCase().trim() === campo.nombre.normalize().toLocaleLowerCase().trim()
        });
        if (i === 3) {
            return indice === 3;
        }
        return indice === -1;
    });

    return camposFaltantes.map((campo) => {
        return {
            campo: `${campo.nombre}`,
            columna: `(Columna ${campo.columna})`,
        };
    });
};

export const validarFila = (
    fila: ExcelPostulante,
    numFila: number,
    departamentos: Departamento[],
    provincias: Provincia[],
    colegios: Colegio[],
    areasCategorias: Map<string, CategoriaExtendida[]>,
    postulantesConvertidos: Postulante[]
): ValidationError[] => {
    const errores: ValidationError[] = [];

    const camposParaVerificar = [
        "nombres",
        "apellidos",
        "ci",
        "fecha_nacimiento",
        "correo_electronico",
        "departamento",
        "provincia",
        "colegio",
        "grado",
        "telefono_referencia",
        "telefono_pertenece_a",
        "correo_referencia",
        "correo_pertenece_a",
        "area_categoria1",
    ];

    const filaVacia = camposParaVerificar.every(
        (campo) =>
            !fila[campo as keyof ExcelPostulante] ||
            fila[campo as keyof ExcelPostulante].toString().trim() === ""
    );

    if (filaVacia) {
        return [];
    }

    const camposObligatorios = [
        { campo: "nombres", nombre: "Nombre" },
        { campo: "apellidos", nombre: "Apellidos" },
        { campo: "ci", nombre: "CI" },
        { campo: "fecha_nacimiento", nombre: "Fecha de nacimiento" },
        { campo: "correo_electronico", nombre: "Correo electrónico" },
        { campo: "departamento", nombre: "Departamento" },
        { campo: "provincia", nombre: "Provincia" },
        { campo: "colegio", nombre: "Colegio" },
        { campo: "grado", nombre: "Grado" },
        { campo: "telefono_referencia", nombre: "Teléfono de referencia" },
        { campo: "telefono_pertenece_a", nombre: "Teléfono pertenece a" },
        { campo: "correo_referencia", nombre: "Correo de referencia" },
        { campo: "correo_pertenece_a", nombre: "Correo pertenece a" },
        { campo: "area_categoria1", nombre: "Área categoría 1" },
    ];

    console.log("fila: ", fila);
    camposObligatorios.forEach(({ campo, nombre }) => {
        if (
            !fila[campo as keyof ExcelPostulante] ||
            fila[campo as keyof ExcelPostulante].toString().trim() === ""
        ) {
            errores.push({
                campo: nombre,
                fila: numFila,
                ci: fila.ci,
                mensaje: "Campo obligatorio vacío",
            });
        }
    });
    const ciRegex = /^\d{7,8}[A-Za-z]?$/;
    if (!ciRegex.test(fila.ci)) {
        errores.push({
            campo: "CI",
            fila: numFila,
            ci: fila.ci,
            mensaje:
                "Formato de CI inválido. Debe tener 7-8 dígitos y opcionalmente una letra al final",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    ["correo_electronico", "correo_referencia"].forEach((campo) => {
        if (!emailRegex.test(fila[campo as keyof ExcelPostulante])) {
            errores.push({
                campo:
                    campo === "correo_electronico"
                        ? "Correo electrónico"
                        : "Correo de referencia",
                fila: numFila,
                ci: fila.ci,
                mensaje:
                    "Formato de correo electrónico inválido: tiene que tener un formato como: letras@dominio.com",
            });
        }
    });

    const fechaRegex = /^\d{2}-\d{2}-\d{4}$/;
    const fechaValida = fechaRegex.test(fila.fecha_nacimiento);

    const fechaNacimientoNormalizada = fila.fecha_nacimiento;

    if (!fechaValida) {
        errores.push({
            campo: "Fecha de nacimiento",
            fila: numFila,
            ci: fila.ci,
            mensaje:
                "Formato de fecha inválido debe ser DD/MM/AAAA. Revise que la columna de fecha tenga el formato de celdas en FECHA(DD/MM/AAAA)",
        });
    }

    const telefonoRegex = /^\d{7,8}$/;
    if (!telefonoRegex.test(fila.telefono_referencia)) {
        errores.push({
            campo: "Teléfono de referencia",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Teléfono debe tener entre 7 y 8 dígitos",
        });
    }

    const postulante: Postulante = {
        nombres: fila.nombres,
        apellidos: fila.apellidos,
        ci: fila.ci,
        fecha_nacimiento: fechaNacimientoNormalizada, // formato ISO (DD-MM-YYYY)
        correo_postulante: fila.correo_electronico,
        email_contacto: fila.correo_electronico,
        tipo_contacto_email: 1,
        telefono_contacto: fila.telefono_referencia,
        tipo_contacto_telefono: 1,

        idDepartamento: 0,
        idProvincia: 0,
        idColegio: 0,
        idCurso: 0,
        idArea1: 0,
        idCategoria1: 0,
        idArea2: -1,
        idCategoria2: -1,
    };

    ["telefono_pertenece_a", "correo_pertenece_a"].forEach((campo) => {
        const valorCampo = String(fila[campo as keyof ExcelPostulante] ?? "")
            .trim()
            .toLowerCase();
        const contacto = CONTACTOS.find(
            (c) => c.nombre.toLowerCase() === valorCampo
        );
        if (!contacto) {
            errores.push({
                campo:
                    campo === "telefono_pertenece_a"
                        ? "Teléfono pertenece a"
                        : "Correo pertenece a",
                fila: numFila,
                ci: fila.ci,
                mensaje:
                    "Valor no permitido. Debe ser: Estudiante, Madre/Padre, Responsable",
            });
        } else {
            if (campo === "correo_pertenece_a") {
                postulante.tipo_contacto_email = Number(contacto.id);
            } else {
                postulante.tipo_contacto_telefono = Number(contacto.id);
            }
        }
    });

    const normalizedInputDepartamento =
        fila.departamento?.replace(/_/g, " ").toLowerCase() || "";

    const departamentoEncontrado = departamentos.find(
        (d) => d.nombre.toLowerCase() === normalizedInputDepartamento
    );

    if (!departamentoEncontrado) {
        errores.push({
            campo: "Departamento",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Departamento no válido",
        });
    } else {
        postulante.idDepartamento = departamentoEncontrado.id;
    }

    const provinciaEncontrada = provincias.find(
        (p) => p.nombre.toLowerCase() === fila.provincia.toLowerCase()
        //&& p.departamento_id === departamentoEncontrado?.ID.toString()
    );
    if (!provinciaEncontrada) {
        errores.push({
            campo: "Provincia",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Provincia no válida para el departamento seleccionado",
        });
    } else {
        postulante.idProvincia = provinciaEncontrada.id;
    }

    const colegioEncontrado = colegios.find(
        (c) => c.nombre.toLowerCase() === fila.colegio.toLowerCase()
    );
    if (!colegioEncontrado) {
        errores.push({
            campo: "Colegio",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Colegio no válido",
        });
    } else {
        postulante.idColegio = parseInt(colegioEncontrado.id);
    }

    const gradoEncontrado = GRADOS.find((g) => {
        return g.nombre.toLowerCase() == fila.grado.toLowerCase();
    });

    if (!gradoEncontrado) {
        errores.push({
            campo: "Grado",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Grado no válido",
        });
    } else {
        postulante.idCurso = parseInt(gradoEncontrado.id);
    }

    if (gradoEncontrado) {
        const areasDisponibles = areasCategorias.get(gradoEncontrado.id);
        if (areasDisponibles) {
            const areaCategoria1 = areasDisponibles.find(
                (ac) =>
                    `${ac.areaNombre} - ${ac.nombre}`.toLowerCase() ===
                    fila.area_categoria1.toLowerCase()
            );
            if (areaCategoria1) {
                postulante.idArea1 = areaCategoria1.areaId;
                postulante.idCategoria1 = parseInt(areaCategoria1.id);
            } else {
                errores.push({
                    campo: "Área-Categoría 1",
                    fila: numFila,
                    ci: fila.ci,
                    mensaje:
                        "Área-Categoría no válida para el grado seleccionado",
                });
            }

            if (fila.area_categoria2) {
                const areaCategoria2 = areasDisponibles.find(
                    (ac) =>
                        `${ac.areaNombre} - ${ac.nombre}`.toLowerCase() ===
                        fila.area_categoria2.toLowerCase()
                );
                if (areaCategoria2) {
                    postulante.idArea2 = areaCategoria2.areaId;
                    postulante.idCategoria2 = parseInt(areaCategoria2.id);
                } else {
                    errores.push({
                        campo: "Área-Categoría 2",
                        fila: numFila,
                        ci: fila.ci,
                        mensaje:
                            "Área-Categoría no válida para el grado seleccionado",
                    });
                }
            }
        }
    }

    if (errores.length === 0) {
        postulantesConvertidos.push(postulante);
    }

    return errores;
};
export const newValidarFila = (
    fila: newExcelPostulante,
    numFila: number,
    departamentos: Departamento[],
    provincias: Provincia[],
    colegios: Colegio[],
    areasCategorias: Map<string, CategoriaExtendida[]>,
    postulantesConvertidos: newPostulante[]
): ValidationError[] => {
    const errores: ValidationError[] = [];

    const camposParaVerificar = [
        "nombres",
        "apellidos",
        "ci",
        "fecha_nacimiento",
        "correo_electronico",
        "departamento",
        "provincia",
        "colegio",
        "grado",
        "telefono_referencia",
        "telefono_pertenece_a",
        "correo_referencia",
        "correo_pertenece_a",
        "area_categoria1",
    ];

    const filaVacia = camposParaVerificar.every(
        (campo) =>
            !fila[campo as keyof newExcelPostulante] ||
            fila[campo as keyof newExcelPostulante].toString().trim() === ""
    );

    if (filaVacia) {
        return [];
    }

    const camposObligatorios = [
        { campo: "nombres", nombre: "Nombre" },
        { campo: "apellidos", nombre: "Apellidos" },
        { campo: "ci", nombre: "CI" },
        { campo: "fecha_nacimiento", nombre: "Fecha de nacimiento" },
        { campo: "correo_electronico", nombre: "Correo electrónico" },
        { campo: "departamento", nombre: "Departamento" },
        { campo: "provincia", nombre: "Provincia" },
        { campo: "colegio", nombre: "Colegio" },
        { campo: "grado", nombre: "Grado" },
        { campo: "telefono_referencia", nombre: "Teléfono de referencia" },
        { campo: "telefono_pertenece_a", nombre: "Teléfono pertenece a" },
        { campo: "correo_referencia", nombre: "Correo de referencia" },
        { campo: "correo_pertenece_a", nombre: "Correo pertenece a" },
    ] as const;

    camposObligatorios.forEach(({ campo, nombre }) => {
        if (fila[campo].toString().trim() === "") {
            errores.push({
                campo: nombre,
                fila: numFila,
                ci: fila.ci,
                mensaje: "Campo vacío obligatorio",
            });
        }
    });
    if (fila.inscripciones[0].toString().trim() === "") {
        errores.push({
            campo: "Área Categoría",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Campo vacío obligatorio",
        });
    }

    const ciRegex = /^\d{7,8}[A-Za-z]?$/;
    if (!ciRegex.test(fila.ci)) {
        errores.push({
            campo: "CI",
            fila: numFila,
            ci: fila.ci,
            mensaje:
                "Formato de CI inválido. Debe tener 7-8 dígitos y opcionalmente una letra al final",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    (["correo_electronico", "correo_referencia"] as const).forEach((campo) => {
        if (!emailRegex.test(fila[campo])) {
            errores.push({
                campo:
                    campo === "correo_electronico"
                        ? "Correo electrónico"
                        : "Correo de referencia",
                fila: numFila,
                ci: fila.ci,
                mensaje:
                    "Formato de correo electrónico inválido: tiene que tener un formato como: letras@dominio.com",
            });
        }
    });

    const fechaRegex = /^\d{2}-\d{2}-\d{4}$/;
    const fechaValida = fechaRegex.test(fila.fecha_nacimiento);

    const fechaNacimientoNormalizada = fila.fecha_nacimiento;

    if (!fechaValida) {
        errores.push({
            campo: "Fecha de nacimiento",
            fila: numFila,
            ci: fila.ci,
            mensaje:
                "Formato de fecha inválido debe ser DD/MM/AAAA. Revise que la columna de fecha tenga el formato de celdas en FECHA(DD/MM/AAAA)",
        });
    }

    const telefonoRegex = /^\d{7,8}$/;
    if (!telefonoRegex.test(fila.telefono_referencia)) {
        errores.push({
            campo: "Teléfono de referencia",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Teléfono debe tener entre 7 y 8 dígitos",
        });
    }

    const postulante: newPostulante = {
        nombres: fila.nombres,
        apellidos: fila.apellidos,
        ci: fila.ci,
        fecha_nacimiento: fechaNacimientoNormalizada, // formato ISO (DD-MM-YYYY)
        correo_postulante: fila.correo_electronico,
        email_contacto: fila.correo_electronico,
        tipo_contacto_email: 1,
        telefono_contacto: fila.telefono_referencia,
        tipo_contacto_telefono: 1,

        idDepartamento: 0,
        idProvincia: 0,
        idColegio: 0,
        idCurso: 0,
        inscripciones: [],
    };

    ["telefono_pertenece_a", "correo_pertenece_a"].forEach((campo) => {
        const valorCampo = String(fila[campo as keyof newExcelPostulante] ?? "")
            .trim()
            .toLowerCase();
        const contacto = CONTACTOS.find(
            (c) => c.nombre.toLowerCase() === valorCampo
        );
        if (!contacto) {
            errores.push({
                campo:
                    campo === "telefono_pertenece_a"
                        ? "Teléfono pertenece a"
                        : "Correo pertenece a",
                fila: numFila,
                ci: fila.ci,
                mensaje:
                    "Valor no permitido. Debe ser: Estudiante, Madre/Padre, Responsable",
            });
        } else {
            if (campo === "correo_pertenece_a") {
                postulante.tipo_contacto_email = Number(contacto.id);
            } else {
                postulante.tipo_contacto_telefono = Number(contacto.id);
            }
        }
    });

    const normalizedInputDepartamento =
        fila.departamento?.replace(/_/g, " ").toLowerCase() || "";

    const departamentoEncontrado = departamentos.find(
        (d) => d.nombre.toLowerCase() === normalizedInputDepartamento
    );

    if (!departamentoEncontrado) {
        errores.push({
            campo: "Departamento",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Departamento no válido",
        });
    } else {
        postulante.idDepartamento = departamentoEncontrado.id;
    }

    const provinciaEncontrada = provincias.find(
        (p) => p.nombre.toLowerCase() === fila.provincia.toLowerCase()
        //&& p.departamento_id === departamentoEncontrado?.ID.toString()
    );
    if (!provinciaEncontrada) {
        errores.push({
            campo: "Provincia",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Provincia no válida para el departamento seleccionado",
        });
    } else {
        postulante.idProvincia = provinciaEncontrada.id;
    }

    const colegioEncontrado = colegios.find(
        (c) => c.nombre.toLowerCase() === fila.colegio.toLowerCase()
    );
    if (!colegioEncontrado) {
        errores.push({
            campo: "Colegio",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Colegio no válido",
        });
    } else {
        postulante.idColegio = parseInt(colegioEncontrado.id);
    }

    const gradoEncontrado = GRADOS.find((g) => {
        return g.nombre.toLowerCase() == fila.grado.toLowerCase();
    });

    if (!gradoEncontrado) {
        errores.push({
            campo: "Grado",
            fila: numFila,
            ci: fila.ci,
            mensaje: "Grado no válido",
        });
    } else {
        postulante.idCurso = parseInt(gradoEncontrado.id);
    }

    if (gradoEncontrado) {
        const areasDisponibles: CategoriaExtendida[] =
            areasCategorias.get(gradoEncontrado.id) || [];
        if (areasDisponibles) {
            fila.inscripciones.forEach((area_categoria, i) => {
                if (!area_categoria) return;

                const encontrado = areasDisponibles.find(
                    (ac) =>
                        `${ac.areaNombre} - ${ac.nombre}`.toLowerCase() ===
                        area_categoria.toLowerCase()
                );
                //console.log("encontrados: ",i,area_categoria,encontrado)
                if (encontrado) {
                    postulante.inscripciones.push({
                        idArea: encontrado?.areaId || "",
                        idCategoria: encontrado?.id || "",
                    });
                } else {
                    errores.push({
                        campo: "Área-Categoría " + (i + 1),
                        fila: numFila,
                        ci: fila.ci,
                        mensaje:
                            "Área-Categoría no válida para el grado seleccionado",
                    });
                }
            });
            //console.log("inscripcion divididas:", fila.inscripciones);
        }
    }

    if (errores.length === 0) {
        postulantesConvertidos.push(postulante);
    }

    return errores;
};

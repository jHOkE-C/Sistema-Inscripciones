import { ExcelPostulante, ValidationError, CONTACTOS_PERMITIDOS, Postulante } from './types';
import { Departamento, Provincia, Colegio, CategoriaExtendida } from './types';
import { grados } from './types';

export const validarCamposRequeridos = (headers: string[]): string[] => {
    const camposRequeridos = [
        { columna: 'A', nombre: 'Nombre' },
        { columna: 'B', nombre: 'Apellidos' },
        { columna: 'C', nombre: 'CI' },
        { columna: 'D', nombre: 'Fecha de nacimiento' },
        { columna: 'E', nombre: 'Correo electrónico' },
        { columna: 'F', nombre: 'Departamento' },
        { columna: 'G', nombre: 'Provincia' },
        { columna: 'H', nombre: 'Colegio' },
        { columna: 'I', nombre: 'Grado' },
        { columna: 'J', nombre: 'Teléfono de referencia' },
        { columna: 'K', nombre: 'Teléfono pertenece a' },
        { columna: 'L', nombre: 'Correo de referencia' },
        { columna: 'M', nombre: 'Correo pertenece a' },
        { columna: 'N', nombre: 'Área categoría 1' }
    ];

    const camposFaltantes = camposRequeridos.filter(campo => {
        const indice = headers.findIndex(h => h === campo.nombre);
        return indice === -1;
    });

    return camposFaltantes.map(campo => `${campo.nombre} (Columna ${campo.columna})`);
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
        'nombres', 'apellidos', 'ci', 'fecha_nacimiento', 'correo_electronico',
        'departamento', 'provincia', 'colegio', 'grado', 'telefono_referencia',
        'telefono_pertenece_a', 'correo_referencia', 'correo_pertenece_a', 'area_categoria1'
    ];

    const filaVacia = camposParaVerificar.every(campo => 
        !fila[campo as keyof ExcelPostulante] || 
        fila[campo as keyof ExcelPostulante].toString().trim() === ''
    );

    if (filaVacia) {
        return [];
    }

    const camposObligatorios = [
        { campo: 'nombres', nombre: 'Nombre' },
        { campo: 'apellidos', nombre: 'Apellidos' },
        { campo: 'ci', nombre: 'CI' },
        { campo: 'fecha_nacimiento', nombre: 'Fecha de nacimiento' },
        { campo: 'correo_electronico', nombre: 'Correo electrónico' },
        { campo: 'departamento', nombre: 'Departamento' },
        { campo: 'provincia', nombre: 'Provincia' },
        { campo: 'colegio', nombre: 'Colegio' },
        { campo: 'grado', nombre: 'Grado' },
        { campo: 'telefono_referencia', nombre: 'Teléfono de referencia' },
        { campo: 'telefono_pertenece_a', nombre: 'Teléfono pertenece a' },
        { campo: 'correo_referencia', nombre: 'Correo de referencia' },
        { campo: 'correo_pertenece_a', nombre: 'Correo pertenece a' },
        { campo: 'area_categoria1', nombre: 'Área categoría 1' }
    ];

    camposObligatorios.forEach(({ campo, nombre }) => {
        if (!fila[campo as keyof ExcelPostulante] || fila[campo as keyof ExcelPostulante].toString().trim() === '') {
            errores.push({
                campo: nombre,
                fila: numFila,
                ci: fila.ci,
                mensaje: 'Campo obligatorio vacío'
            });
        }
    });
    const ciRegex = /^\d{7,8}[A-Za-z]?$/;
    if (!ciRegex.test(fila.ci)) {
        errores.push({
            campo: 'CI',
            fila: numFila,
            ci: fila.ci,
            mensaje: 'Formato de CI inválido. Debe tener 7-8 dígitos y opcionalmente una letra al final'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    ['correo_electronico', 'correo_referencia'].forEach(campo => {
        if (!emailRegex.test(fila[campo as keyof ExcelPostulante])) {
            errores.push({
                campo: campo === 'correo_electronico' ? 'Correo electrónico' : 'Correo de referencia',
                fila: numFila,
                ci: fila.ci,
                mensaje: 'Formato de correo electrónico inválido: tiene que tener un formato como: letras@dominio.com'
            });
        }
    });

    let fechaValida = false;
    if (typeof fila.fecha_nacimiento === 'string') {
        const numeroFecha = parseFloat(fila.fecha_nacimiento);
        if (!isNaN(numeroFecha)) {
            const fecha = new Date((numeroFecha - 25569) * 86400 * 1000);
            if (!isNaN(fecha.getTime())) {
                const dia = fecha.getDate().toString().padStart(2, '0');
                const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
                const año = fecha.getFullYear();
                fila.fecha_nacimiento = `${dia}/${mes}/${año}`;
                fechaValida = true;
            }
        } else {
            const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            fechaValida = fechaRegex.test(fila.fecha_nacimiento);
        }
    }

    if (!fechaValida) {
        errores.push({
            campo: 'Fecha de nacimiento',
            fila: numFila,
            ci: fila.ci,
            mensaje: 'Formato de fecha inválido. Debe ser DD/MM/AAAA o una fecha válida de Excel'
        });
    }


    const telefonoRegex = /^\d{7,8}$/;
    if (!telefonoRegex.test(fila.telefono_referencia)) {
        errores.push({
            campo: 'Teléfono de referencia',
            fila: numFila,
            ci: fila.ci,
            mensaje: 'Teléfono debe tener entre 7 y 8 dígitos'
        });
    }

    ['telefono_pertenece_a', 'correo_pertenece_a'].forEach(campo => {
        if (!CONTACTOS_PERMITIDOS.includes(fila[campo as keyof ExcelPostulante].toUpperCase())) {
            errores.push({
                campo: campo === 'telefono_pertenece_a' ? 'Teléfono pertenece a' : 'Correo pertenece a',
                fila: numFila,
                ci: fila.ci,
                mensaje: 'Valor no permitido. Debe ser: Estudiante, MAMA, PAPA, PROFESOR o TUTOR'
            });
        }
    });

    const postulante: Postulante = {
        ...fila,
        iddepartamento: 0,
        idprovincia: 0,
        idcolegio: 0,
        idgrado: 0,
        idarea1: 0,
        idcategoria1: 0,
        idarea2: -1,
        idcategoria2: -1
    };

    const departamentoEncontrado = departamentos.find(d => d.Nombre.toLowerCase() === fila.departamento.toLowerCase());
    if (!departamentoEncontrado) {
        errores.push({
            campo: 'Departamento',
            fila: numFila,
            ci: fila.ci,
            mensaje: 'Departamento no válido'
        });
    } else {
        postulante.iddepartamento = departamentoEncontrado.ID;
    }

    const provinciaEncontrada = provincias.find(p => 
        p.nombre.toLowerCase() === fila.provincia.toLowerCase() 
      //&& p.departamento_id === departamentoEncontrado?.ID.toString()
    );
    if (!provinciaEncontrada) {
        errores.push({
            campo: 'Provincia',
            fila: numFila,
            ci: fila.ci,
            mensaje: 'Provincia no válida para el departamento seleccionado'
        });
    } else {
        postulante.idprovincia = provinciaEncontrada.id;
    }

    const colegioEncontrado = colegios.find(c => c.nombre.toLowerCase() === fila.colegio.toLowerCase());
    if (!colegioEncontrado) {
        errores.push({
            campo: 'Colegio',
            fila: numFila,
            ci: fila.ci,
            mensaje: 'Colegio no válido'
        });
    } else {
        postulante.idcolegio = parseInt(colegioEncontrado.id);
    }

    const gradoEncontrado = grados.find(g => g.nombre === fila.grado);
    if (!gradoEncontrado) {
        errores.push({
            campo: 'Grado',
            fila: numFila,
            ci: fila.ci,
            mensaje: 'Grado no válido'
        });
    } else {
        postulante.idgrado = parseInt(gradoEncontrado.id);
    }

    if (gradoEncontrado) {
        const areasDisponibles = areasCategorias.get(gradoEncontrado.id);
        if (areasDisponibles) {
            const areaCategoria1 = areasDisponibles.find(ac => 
                `${ac.areaNombre} - ${ac.nombre}`.toLowerCase() === fila.area_categoria1.toLowerCase()
            );
            if (areaCategoria1) {
                postulante.idarea1 = areaCategoria1.areaId;
                postulante.idcategoria1 = parseInt(areaCategoria1.id);
            } else {
                errores.push({
                    campo: 'Área-Categoría 1',
                    fila: numFila,
                    ci: fila.ci,
                    mensaje: 'Área-Categoría no válida para el grado seleccionado'
                });
            }

            if (fila.area_categoria2) {
                const areaCategoria2 = areasDisponibles.find(ac => 
                    `${ac.areaNombre} - ${ac.nombre}`.toLowerCase() === fila.area_categoria2.toLowerCase()
                );
                if (areaCategoria2) {
                    postulante.idarea2 = areaCategoria2.areaId;
                    postulante.idcategoria2 = parseInt(areaCategoria2.id);
                } else {
                    errores.push({
                        campo: 'Área-Categoría 2',
                        fila: numFila,
                        ci: fila.ci,
                        mensaje: 'Área-Categoría no válida para el grado seleccionado'
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
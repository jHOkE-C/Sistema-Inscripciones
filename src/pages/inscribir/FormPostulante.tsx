/// Corregir las areas con el grado
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import DatePicker from "@/components/DatePicker";
import { ComboBox } from "@/components/ComboBox";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { API_URL } from "@/hooks/useApiRequest";
import { postDataPostulante } from "@/api/postulantes";
import { getCategoriaAreaPorGrado, type Categoria } from "@/api/areas";
import { MultiSelect } from "@/components/MultiSelect";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "react-router-dom";
import { MyCombobox } from "@/components/MyComboBox";

const grados = [
    { id: "1", nombre: "1ro Primaria" },
    { id: "2", nombre: "2do Primaria" },
    { id: "3", nombre: "3ro Primaria" },
    { id: "4", nombre: "4to Primaria" },
    { id: "5", nombre: "5to Primaria" },
    { id: "6", nombre: "6to Primaria" },
    { id: "7", nombre: "1ro Secundaria" },
    { id: "8", nombre: "2do Secundaria" },
    { id: "9", nombre: "3ro Secundaria" },
    { id: "10", nombre: "4to Secundaria" },
    { id: "11", nombre: "5to Secundaria" },
    { id: "12", nombre: "6to Secundaria" },
];

const contactos = [
    { id: "0", nombre: "Profesor" },
    { id: "1", nombre: "Mamá/Papá" },
    { id: "2", nombre: "Estudiante" },
];
const postulanteSchema = z.object({
    nombre: z
        .string()
        .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
        .max(50, { message: "El nombre no debe exceder los 50 caracteres." }),

    apellido: z
        .string()
        .min(3, { message: "El apellido debe tener al menos 3 caracteres." })
        .max(50, { message: "El apellido no debe exceder los 50 caracteres." }),

    ci: z
        .string()
        .min(7, { message: "El CI debe tener al menos 7 caracteres." })
        .max(15, { message: "El CI no debe exceder los 15 caracteres." }),

    fecha_nacimiento: z.date().refine(
        (date) => {
            const edad = new Date().getFullYear() - date.getFullYear();
            return edad >= 5;
        },
        { message: "Debes tener al menos 5 años para registrarte." }
    ),

    correo_postulante: z
        .string()
        .email({ message: "El correo ingresado no es válido." })
        .max(100, { message: "El correo no debe exceder los 100 caracteres." }),

    curso: z.string().min(1, { message: "El curso es obligatorio." }),

    departamento: z
        .string()
        .min(1, { message: "El departamento es obligatorio." }),

    provincia: z.string().min(1, { message: "La provincia es obligatoria." }),

    tipo_contacto_email: z
        .string()
        .min(1, { message: "El tipo de contacto por email es obligatorio." }),

    areas: z.array(z.object({ id_area: z.number(), id_cat: z.number() })),

    email_contacto: z
        .string()
        .email({ message: "El correo de contacto no es válido." })
        .max(100, {
            message:
                "El correo de contacto no debe exceder los 100 caracteres.",
        }),

    tipo_contacto_telefono: z.string().min(1, {
        message: "El tipo de contacto por teléfono es obligatorio.",
    }),

    telefono_contacto: z
        .string()
        .regex(/^\d+$/, { message: "El teléfono solo debe contener números." })
        .min(7, { message: "El teléfono debe tener al menos 7 dígitos." })
        .max(15, { message: "El teléfono no debe exceder los 15 dígitos." }),

    colegio: z.string(),
});

interface Departamento {
    id: string;
    nombre: string;
    abreviatura: string;
}

interface Provincia {
    departamento_id: string;
    nombre: string;
    id: number;
}
interface Colegio {
    id: string;
    nombre: string;
}

const FormPostulante = () => {
    const [selectedGrado, setSelectedGrado] = useState<string>();
    const [selectedDepartamento, setSelectedDepartamento] = useState<string>();
    const form = useForm<z.infer<typeof postulanteSchema>>({
        resolver: zodResolver(postulanteSchema),
        mode: "onSubmit",
    });
    const { codigo } = useParams();

    const onSubmit = (data: z.infer<typeof postulanteSchema>) => {
        console.log({ ...data, uuid_lista: codigo });
        postDataPostulante({
            ...data,
            fecha_nacimiento: data.fecha_nacimiento.toISOString(),
            areas: data.areas.join(","),
        });
    };
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [colegios, setColegios] = useState<Colegio[]>([]);

    useEffect(() => {
        const endpoints = [
            {
                label: "Departamentos",
                url: API_URL + "/api/departamentos",
                setData: setDepartamentos,
            },
            {
                label: "Provincias",
                url: API_URL + "/api/provincias",
                setData: setProvincias,
            },
            // {
            //     label: "Categorias",
            //     url: API_URL + "/api/categorias",
            //     setData: setCategorias,
            // },
            {
                label: "Colegios",
                url: API_URL + "/api/colegios",
                setData: setColegios,
            },
        ];

        const fetchData = async () => {
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint.url);
                    if (!response.ok) {
                        console.error(`Error al obtener ${endpoint.label}`);
                    } else {
                        const data = await response.json();
                        console.log(endpoint.label, data);
                        endpoint.setData(data);
                    }
                } catch (error) {
                    console.error(`Error en ${endpoint.label}:`, error);
                }
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        if (!selectedGrado) return;
        const fetchArea = async () => {
            const areas = await getCategoriaAreaPorGrado(selectedGrado);
            setCategorias(areas);
        };
        fetchArea();
    }, [selectedGrado]);
    const [openAccordions, setOpenAccordions] = useState<string[]>([]);

    const handleErrors = (errors: Record<string, unknown>) => {
        const errorFields = Object.keys(errors);
        const fieldToAccordionMap: Record<string, string> = {
            nombre: "personal",
            apellido: "personal",
            ci: "personal",
            fecha_nacimiento: "personal",
            correo_postulante: "personal",
            departamento: "ubicacion",
            provincia: "ubicacion",
            colegio: "ubicacion",
            telefono_contacto: "contacto",
            tipo_contacto_telefono: "contacto",
            email_contacto: "contacto",
            tipo_contacto_email: "contacto",
            curso: "categoria-area",
            areas: "categoria-area",
        };

        const accordionsToOpen = new Set<string>();
        errorFields.forEach((field) => {
            const accordion = fieldToAccordionMap[field];
            if (accordion) {
                accordionsToOpen.add(accordion);
            }
        });

        setOpenAccordions(Array.from(accordionsToOpen));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Postulante
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[calc(100vh-100px)] overflow-y-auto ">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Postulante</DialogTitle>
                    <DialogDescription>
                        Ingresa los datos del nuevo postulante para las
                        olimpiadas ohSansi
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, handleErrors)}>
                        <div className="grid gap-4 py-2">
                            <div className="grid  gap-4">
                                <Accordion
                            
                                    type="multiple"
                                    value={openAccordions}
                                    onValueChange={(value) => {
                                        setOpenAccordions(value);
                                        console.log(value);
                                    }}
                                    className="space-y-4"
                                >
                                    <AccordionItem value="personal">
                                        <AccordionTrigger>
                                            Datos Personales
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 mt-2">
                                            <div className="grid grid-cols-1  gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="nombre"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Nombres
                                                            </FormLabel>
                                                            <FormControl className="col-span-2">
                                                                <Input
                                                                    placeholder="Juan"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="apellido"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Apellidos
                                                            </FormLabel>
                                                            <FormControl className="col-span-2">
                                                                <Input
                                                                    placeholder="Gonzales"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="ci"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                CI
                                                            </FormLabel>
                                                            <FormControl className="col-span-2">
                                                                <Input
                                                                    placeholder="12345678"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="fecha_nacimiento"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Fecha de
                                                                Nacimiento
                                                            </FormLabel>
                                                            <FormControl className="col-span-2">
                                                                <DatePicker
                                                                    classname="w-full"
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="correo_postulante"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Correo
                                                                Electrónico
                                                            </FormLabel>
                                                            <FormControl className="col-span-2">
                                                                <Input
                                                                    placeholder="correo@ejemplo.com"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="ubicacion">
                                        <AccordionTrigger>
                                            Ubicación
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 mt-2">
                                            <div className="grid grid-cols-1  gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="departamento"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Departamento
                                                            </FormLabel>

                                                            <FormControl className="col-span-2">
                                                                <ComboBox
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        field.onChange(
                                                                            e
                                                                        );
                                                                        setSelectedDepartamento(
                                                                            Array.isArray(
                                                                                e
                                                                            )
                                                                                ? e[0]
                                                                                : e
                                                                        );
                                                                    }}
                                                                    values={departamentos.map(
                                                                        ({
                                                                            id,
                                                                            nombre,
                                                                        }) => ({
                                                                            id: id.toString(),
                                                                            nombre,
                                                                        })
                                                                    )}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="provincia"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Provincia
                                                            </FormLabel>
                                                            <FormControl>
                                                                <ComboBox
                                                                    className="col-span-2"
                                                                    disabled={
                                                                        !selectedDepartamento
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    values={provincias
                                                                        .filter(
                                                                            ({
                                                                                departamento_id,
                                                                            }) =>
                                                                                departamento_id ==
                                                                                selectedDepartamento
                                                                        )
                                                                        .map(
                                                                            ({
                                                                                id,
                                                                                nombre,
                                                                            }) => ({
                                                                                id: id.toString(),
                                                                                nombre,
                                                                            })
                                                                        )}
                                                                />
                                                            </FormControl>

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="colegio"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Colegio
                                                            </FormLabel>
                                                            <FormControl>
                                                                <MyCombobox
                                                                    values={
                                                                        colegios
                                                                    }
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="contacto">
                                        <AccordionTrigger>
                                            Datos de Contacto
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 mt-2">
                                            <div className="grid grid-cols-1  gap-4">
                                                {/* Teléfono */}
                                                <FormField
                                                    control={form.control}
                                                    name="telefono_contacto"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Número de
                                                                teléfono de
                                                                referencia
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="12345678"
                                                                    type="tel"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Tipo teléfono */}
                                                <FormField
                                                    control={form.control}
                                                    name="tipo_contacto_telefono"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                ¿A quién
                                                                pertenece el
                                                                teléfono?
                                                            </FormLabel>
                                                            <FormControl>
                                                                <ComboBox
                                                                    values={
                                                                        contactos
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Email contacto */}
                                                <FormField
                                                    control={form.control}
                                                    name="email_contacto"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Correo
                                                                electrónico de
                                                                referencia
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="contacto@ejemplo.com"
                                                                    type="email"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Tipo email */}
                                                <FormField
                                                    control={form.control}
                                                    name="tipo_contacto_email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                ¿A quién
                                                                pertenece el
                                                                correo?
                                                            </FormLabel>
                                                            <FormControl>
                                                                <ComboBox
                                                                    values={
                                                                        contactos
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="categoria-area">
                                        <AccordionTrigger>
                                            Categoria - Área
                                        </AccordionTrigger>
                                        <AccordionContent className="space-y-4 mt-2">
                                            <div className="grid grid-cols-1 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="curso"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Grado
                                                            </FormLabel>
                                                            <FormControl>
                                                                <ComboBox
                                                                    values={
                                                                        grados
                                                                    }
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        field.onChange(
                                                                            e
                                                                        );
                                                                        setSelectedGrado(
                                                                            String(
                                                                                e
                                                                            )
                                                                        );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="areas"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Selecciona hasta
                                                                2 Áreas
                                                            </FormLabel>
                                                            <FormControl>
                                                                <MultiSelect
                                                                    disabled={
                                                                        !selectedGrado
                                                                    }
                                                                    max={2}
                                                                    values={
                                                                        categorias?.flatMap(
                                                                            ({
                                                                                id: idCat,
                                                                                nombre: nombreCat,
                                                                                areas,
                                                                            }) =>
                                                                                areas?.map(
                                                                                    ({
                                                                                        id: idArea,
                                                                                        nombre: nombreArea,
                                                                                    }) => ({
                                                                                        id: `${idArea}-${idCat}`,
                                                                                        nombre: `${nombreArea} - ${nombreCat}   `,
                                                                                    })
                                                                                ) ||
                                                                                []
                                                                        ) || []
                                                                    }
                                                                    value={
                                                                        field.value?.map(
                                                                            ({
                                                                                id_area,
                                                                                id_cat,
                                                                            }) =>
                                                                                `${id_area}-${id_cat}`
                                                                        ) || []
                                                                    }
                                                                    onChange={(
                                                                        selected: string[]
                                                                    ) => {
                                                                        const transformed =
                                                                            selected.map(
                                                                                (
                                                                                    item
                                                                                ) => {
                                                                                    const [
                                                                                        idArea,
                                                                                        idCat,
                                                                                    ] =
                                                                                        item
                                                                                            .split(
                                                                                                "-"
                                                                                            )
                                                                                            .map(
                                                                                                Number
                                                                                            );
                                                                                    return {
                                                                                        id_cat: idCat,
                                                                                        id_area:
                                                                                            idArea,
                                                                                    };
                                                                                }
                                                                            );
                                                                        field.onChange(
                                                                            transformed
                                                                        );
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <DialogTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogTrigger>
                            <Button
                                type="submit"
                                onClick={() => console.log(form.getValues())}
                            >
                                Guardar Postulante
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default FormPostulante;

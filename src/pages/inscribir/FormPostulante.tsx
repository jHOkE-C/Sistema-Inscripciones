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

const areas = [
    { value: "0", label: "ASTRONOMÍA - ASTROFÍSICA" },
    { value: "1", label: "BIOLOGÍA" },
    { value: "2", label: "FÍSICA" },
    { value: "3", label: "INFORMATICA" },
    { value: "4", label: "MATEMATICAS" },
];

const grados = [
    { id: "0", nombre: "1ro Primaria" },
    { id: "1", nombre: "2do Primaria" },
    { id: "2", nombre: "3ro Primaria" },
    { id: "3", nombre: "4to Primaria" },
    { id: "4", nombre: "5to Primaria" },
    { id: "5", nombre: "6to Primaria" },
    { id: "6", nombre: "1ro Secundaria" },
    { id: "7", nombre: "2do Secundaria" },
    { id: "8", nombre: "3ro Secundaria" },
    { id: "9", nombre: "4to Secundaria" },
    { id: "10", nombre: "5to Secundaria" },
    { id: "11", nombre: "6to Secundaria" },
];

const contactos = [
    { value: "0", label: "Profesor" },
    { value: "1", label: "Mamá/Papá" },
    { value: "2", label: "Estudiante" },
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

    area: z.string().min(1, { message: "El nombre del área es obligatorio." }),

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

    colegio: z
        .string()
        .min(3, {
            message: "El nombre del colegio debe tener al menos 3 caracteres.",
        })
        .max(100, {
            message:
                "El nombre del colegio no debe exceder los 100 caracteres.",
        }),
});
interface Area {
    id: string;
    nombre: string;
}

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
interface Categoria {
    id: string;
    nombre: string;
    maximo_grado: number;
    minimo_grado: number;
    areas: {
        id: string;
        pivot: { area_id: number; categoria_id: number };
    }[];
}

const FormPostulante = () => {
    const [grado, setGrado] = useState<number>();
    const [selectedDepartamento, setSelectedDepartamento] = useState<
        string | number
    >();
    const form = useForm<z.infer<typeof postulanteSchema>>({
        resolver: zodResolver(postulanteSchema),
        mode: "onSubmit",
    });

    const onSubmit = (data: any) => {
        console.log("Formulario enviado con datos:", data);
    };
    const [areas, setAreas] = useState<Area[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [colegios, setColegios] = useState([]);
    const [selectedGrado, setSelectedGrado] = useState<number>();

    useEffect(() => {
        const endpoints = [
            {
                label: "Areas",
                url: API_URL + "/api/categorias/areas",
                setData: setAreas,
            },
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
            {
                label: "Categorias",
                url: API_URL + "/api/categorias",
                setData: setCategorias,
            },
            // { label: "Grados", url: API_URL + "/api/grados", setData: setGrados},
            // { label: "Colegios", url: API_URL + "/api/colegios", setData: setColegios},
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
                    <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-2">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>Nombres</FormLabel>
                                            <FormControl>
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
                                        <FormItem className="">
                                            <FormLabel>Apellidos</FormLabel>
                                            <FormControl>
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
                                        <FormItem className="">
                                            <FormLabel>CI</FormLabel>
                                            <FormControl>
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
                                                Fecha de Nacimiento
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value} // Pasa el valor del campo
                                                    onChange={field.onChange} // Usa la función de react-hook-form
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
                                        <FormItem className="">
                                            <FormLabel>
                                                Correo Electrónico
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="correo@ejemplo.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="departamento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Departamento</FormLabel>

                                            <FormControl>
                                                <ComboBox
                                                    value={field.value}
                                                    setValue={(e) => {
                                                        field.onChange(e);
                                                        setSelectedDepartamento(
                                                            e
                                                        );
                                                    }}
                                                    values={departamentos.map(
                                                        ({ id, nombre }) => ({
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
                                            <FormLabel>Provincia</FormLabel>
                                            <FormControl>
                                                <ComboBox
                                                    disabled={
                                                        !selectedDepartamento
                                                    }
                                                    value={field.value}
                                                    setValue={field.onChange}
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
                                            <FormLabel>Colegio</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="curso"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grado</FormLabel>
                                            <FormControl>
                                                <ComboBox
                                                    values={grados}
                                                    value={field.value}
                                                    setValue={(e) => {
                                                        field.onChange(e);
                                                        setGrado(Number(e));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="area"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area</FormLabel>
                                            <FormControl>
                                                <ComboBox
                                                    disabled={!grado}
                                                    values={categorias.filter(
                                                        ({
                                                            maximo_grado,
                                                            minimo_grado,
                                                        }) =>
                                                            grado >=
                                                                minimo_grado &&
                                                            grado <=
                                                                maximo_grado
                                                    ).map(
                                                        ({
                                                            id,
                                                            nombre,
                                                        }) => ({
                                                            id: id.toString(),
                                                            nombre,
                                                        })
                                                    )}
                                                    value={field.value}
                                                    setValue={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="telefono_contacto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Numero de telefono de referencia
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="12345678"
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tipo_contacto_telefono"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                El telefono pertenece a:
                                            </FormLabel>
                                            <FormControl>
                                                <ComboBox
                                                    values={contactos}
                                                    value={field.value}
                                                    setValue={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email_contacto"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel>
                                                Correo electronico de referencia
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="contacto@ejemplo.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tipo_contacto_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                El Correo electronico pertenece
                                                a:
                                            </FormLabel>
                                            <FormControl>
                                                <ComboBox
                                                    values={contactos}
                                                    value={field.value}
                                                    setValue={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <DialogTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DialogTrigger>
                            <Button type="submit">Guardar Postulante</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default FormPostulante;

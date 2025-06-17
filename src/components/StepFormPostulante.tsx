import { useState, useEffect, type ChangeEventHandler, type FC } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ComboBox } from "@/components/ComboBox";
import { DateSelector } from "@/components/DateSelector";
import { MultiSelect } from "@/components/MultiSelect";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { getCategoriaAreaPorGrado, type Categoria } from "@/models/api/areas";
import { useUbicacion } from "@/viewModels/context/UbicacionContext";
import type { Olimpiada } from "@/models/interfaces/versiones.type";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { apiClient } from "@/models/api/request";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alertDialog";
import { getDateUTC } from "@/viewModels/utils/fechas";
import type {
    Colegio,
    Departamento,
    Provincia,
} from "@/models/interfaces/ubicacion.interface";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowRight, Trash2, TriangleAlert, User } from "lucide-react";
import { getResponsable } from "@/models/api/responsables";
import { CONTACTOS } from "@/models/interfaces/postulante.interface";
import { Card, CardContent } from "./ui/card";

const personalSchema = z.object({
    nombres: z.string().min(3).max(50),
    apellidos: z.string().min(3).max(50),
    ci: z.string().min(7).max(10),
    fecha_nacimiento: z.date().refine(
        (date) => {
            const edad = new Date().getFullYear() - date.getFullYear();
            return edad >= 5;
        },
        { message: "Debes tener al menos 5 años para registrarte." }
    ),
    correo_postulante: z.string().email().max(100),
});

const ubicacionSchema = z.object({
    departamento: z.string().min(1),
    provincia: z.string().min(1),
    colegio: z.string().min(1),
});

const contactoSchema = z.object({
    telefono_contacto: z.string().regex(/^\d+$/).min(7).max(8),
    tipo_contacto_telefono: z.string().min(1),
    email_contacto: z.string().email().max(100),
    tipo_contacto_email: z.string().min(1),
});

const categoriaAreaSchema = z.object({
    curso: z.string().min(1),
    niveles_competencia: z.array(
        z.object({ id_area: z.number(), id_cat: z.number() })
    ),
});

type PersonalData = z.infer<typeof personalSchema>;
type UbicacionData = z.infer<typeof ubicacionSchema>;
type ContactoData = z.infer<typeof contactoSchema>;
type CategoriaAreaData = z.infer<typeof categoriaAreaSchema>;

interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
}
interface Inscripcion {
    nivel_competencia: string;
    id_area: number;
    id_categoria: number;
    estado: "Pago Pendiente" | "Inscripcion Completa" | "Preinscrito";
}

interface PostulanteData {
    ci: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    email: string;
    departamento: string;
    id_departamento: string;
    provincia: string;
    id_provincia: string;
    colegio: string;
    id_colegio: string;
    curso: string;
    inscripciones: Inscripcion[];
    fieldsDisabled: boolean;
}
interface ExtraData {
    niveles_inscritos?: {
        id_area: number;
        id_cat: number;
        nivel_competencia: string;
    }[];
    fieldsDisabled: boolean;
}
interface ContactoLista {
    contactos: ContactoData[];
}
export type StepData = PersonalData &
    UbicacionData &
    CategoriaAreaData &
    ExtraData &
    ContactoLista;

const PersonalStep = ({
    initialData,
    onNext,
}: {
    initialData?: Partial<PersonalData> & Partial<ExtraData>;
    onNext: (
        data: PersonalData & ExtraData,
        postulante?: PostulanteData
    ) => void;
}) => {
    const { olimpiada_id } = useParams();
    const [postulante, setPostulante] = useState<PostulanteData>();
    const form = useForm<PersonalData>({
        resolver: zodResolver(personalSchema),
        defaultValues: initialData,
        mode: "onSubmit",
    });
    const [fieldsDisabled, setFieldsDisabled] = useState(
        initialData?.fieldsDisabled || false
    );

    const submit: SubmitHandler<PersonalData> = (data) => {
        onNext({ ...data, fieldsDisabled }, postulante);
    };

    const onChangeCI: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const CI = e.target.value;
        if (CI.length >= 7) {
            try {
                const { postulante } = await apiClient.get<{
                    postulante: PostulanteData;
                }>(
                    `/api/inscripciones/postulante/${CI}/olimpiada/${olimpiada_id}`
                );
                form.setValue("nombres", postulante.nombres);
                form.setValue("apellidos", postulante.apellidos);
                form.setValue("correo_postulante", postulante.email);
                const [dia, mes, anio] = postulante.fecha_nacimiento.split("-");
                const nacimiento = new Date(`${anio}-${mes}-${dia}`);
                form.setValue("fecha_nacimiento", nacimiento);
                setPostulante(postulante);
                if (
                    postulante.inscripciones.some(
                        ({ estado }) => estado == "Inscripcion Completa"
                    )
                ) {
                    setFieldsDisabled(true);
                }
            } catch {
                form.setValue("nombres", "");
                form.setValue("apellidos", "");
                form.setValue("correo_postulante", "");
                form.setValue("fecha_nacimiento", new Date());
                setPostulante(undefined);
                setFieldsDisabled(false);
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="ci"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CI</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Ingrese CI"
                                    maxLength={10}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onChangeCI(e);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombres</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={fieldsDisabled}
                                    {...field}
                                    placeholder="Ingrese nombres"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="apellidos"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Apellidos</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={fieldsDisabled}
                                    {...field}
                                    placeholder="Ingrese apellidos"
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
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <FormControl>
                                <DateSelector
                                    disabled={fieldsDisabled}
                                    value={field.value}
                                    onChange={field.onChange}
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
                            <FormLabel>Correo Electrónico</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={fieldsDisabled}
                                    {...field}
                                    type="email"
                                    placeholder="Ingrese correo"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Siguiente</Button>
                </div>
            </form>
        </Form>
    );
};

const UbicacionStep = ({
    initialData,
    onBack,
    onNext,
}: {
    initialData?: Partial<UbicacionData> & Partial<ExtraData>;
    onBack: () => void;
    onNext: (data: UbicacionData) => void;
}) => {
    const form = useForm<UbicacionData>({
        resolver: zodResolver(ubicacionSchema),
        defaultValues: initialData,
        mode: "onSubmit",
    });

    const {
        departamentos,
        provincias,
        colegios,
        loading: ubicacionesLoading,
    } = useUbicacion();
    const [selectedDepartamento, setSelectedDepartamento] = useState<
        string | undefined
    >(initialData?.departamento);

    const submit: SubmitHandler<UbicacionData> = (data) => onNext(data);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="departamento"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Departamento</FormLabel>
                            <FormControl>
                                <ComboBox
                                    disabled={
                                        ubicacionesLoading ||
                                        initialData?.fieldsDisabled
                                    }
                                    values={departamentos.map((d) => ({
                                        id: d.id.toString(),
                                        nombre: d.nombre,
                                    }))}
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        setSelectedDepartamento(
                                            Array.isArray(val) ? val[0] : val
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
                    name="provincia"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Provincia</FormLabel>
                            <FormControl>
                                <ComboBox
                                    disabled={
                                        !selectedDepartamento ||
                                        initialData?.fieldsDisabled
                                    }
                                    values={provincias
                                        .filter(
                                            (p) =>
                                                p.departamento_id.toString() ===
                                                selectedDepartamento
                                        )
                                        .map((p) => ({
                                            id: p.id.toString(),
                                            nombre: p.nombre,
                                        }))}
                                    value={field.value}
                                    onChange={field.onChange}
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
                                <ComboBox
                                    disabled={
                                        (!field.value && ubicacionesLoading) ||
                                        initialData?.fieldsDisabled
                                    }
                                    values={colegios}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between">
                    <Button variant="outline" onClick={onBack}>
                        Atrás
                    </Button>
                    <Button type="submit">Siguiente</Button>
                </div>
            </form>
        </Form>
    );
};
const ContactoForm = ({
    initialData,
    onBack,
    onNext,
}: {
    initialData?: Partial<ContactoData>;
    onBack: () => void;
    onNext: (data: ContactoData) => void;
}) => {
    const form = useForm<ContactoData>({
        resolver: zodResolver(contactoSchema),
        defaultValues: initialData,
        mode: "onSubmit",
    });

    const submit: SubmitHandler<ContactoData> = (data) => onNext(data);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="telefono_contacto"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Teléfono de referencia</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Ingrese teléfono"
                                    maxLength={8}
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
                                ¿A quién pertenece el teléfono?
                            </FormLabel>
                            <FormControl>
                                <ComboBox
                                    values={CONTACTOS}
                                    value={field.value}
                                    onChange={field.onChange}
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
                        <FormItem>
                            <FormLabel>Correo de referencia</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Ingrese correo"
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
                            <FormLabel>¿A quién pertenece el correo?</FormLabel>
                            <FormControl>
                                <ComboBox
                                    values={CONTACTOS}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-between">
                    <Button variant="outline" onClick={onBack}>
                        Atrás
                    </Button>
                    <Button type="submit">Siguiente</Button>
                </div>
            </form>
        </Form>
    );
};
// ContactoStep.tsx
const ContactoStep = ({
    initialData,
    onBack,
    onNext,
}: {
    initialData?: ContactoData[]; // Ahora es un array
    onBack: () => void;
    onNext: (data: ContactoData[]) => void;
}) => {
    const [contactos, setContactos] = useState<ContactoData[]>(
        initialData || []
    );
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleAddContacto = (data: ContactoData) => {
        if (
            contactos.some(
                ({ email_contacto }) => data.email_contacto == email_contacto
            )
        ) {
            toast.error("Correo de contacto duplicado");
        } else if (
            contactos.some(
                ({ telefono_contacto }) =>
                    telefono_contacto == data.telefono_contacto
            )
        ) {
            toast.error("Telefono de contacto duplicado ");
        } else {
            setContactos((prev) => [...prev, data]);
            setDialogOpen(false);
        }
    };

    const handleRemove = (index: number) => {
        setContactos((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        disabled={contactos.length >= 3}
                        className="w-full md:w-auto"
                        variant="outline"
                    >
                        <User className="mr-2 h-4 w-4" />
                        Agregar nuevo contacto
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                    <DialogTitle>Datos de Contacto</DialogTitle>
                    <ContactoForm
                        onBack={() => setDialogOpen(false)}
                        onNext={handleAddContacto}
                        initialData={undefined}
                    />
                </DialogContent>
            </Dialog>

            <div className="mt-6 space-y-4">
                {contactos.map((contacto, index) => {
                    const tipoTel =
                        CONTACTOS.find(
                            (c) => c.id === contacto.tipo_contacto_telefono
                        )?.nombre || "—";
                    const tipoEmail =
                        CONTACTOS.find(
                            (c) => c.id === contacto.tipo_contacto_email
                        )?.nombre || "—";

                    return (
                        <Card key={index} className=" border ">
                            <CardContent className="pt-0 flex justify-between">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span>
                                            <strong>Teléfono:</strong>{" "}
                                            {contacto.telefono_contacto}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            <strong>
                                                Tipo de contacto telefónico :
                                            </strong>{" "}
                                            {tipoTel}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>
                                            <strong>Correo:</strong>{" "}
                                            {contacto.email_contacto}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <strong>
                                            Tipo de contacto correo :
                                        </strong>{" "}
                                        <span className="font-medium">
                                            {tipoEmail}
                                        </span>
                                    </div>
                                </div>
                                {index != 0 && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <Trash2 className="w-4 h-4" /> Eliminar
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onBack}>
                    Atrás
                </Button>
                <Button
                    onClick={() => onNext(contactos)}
                    disabled={contactos.length === 0}
                >
                    Siguiente
                </Button>
            </div>
        </>
    );
};

const CategoriaAreaStep = ({
    olimpiada,
    initialData,
    onBack,
    onNext,
    disabled,
    textButton,
}: {
    initialData?: Partial<CategoriaAreaData> & Partial<ExtraData>;
    onBack: () => void;
    onNext: (data: CategoriaAreaData) => void;
    disabled: boolean;
    textButton: string;
    olimpiada?: Olimpiada;
}) => {
    const form = useForm<CategoriaAreaData>({
        resolver: zodResolver(categoriaAreaSchema),
        defaultValues: initialData,
        mode: "onSubmit",
    });
    const { olimpiada_id } = useParams();
    const [selectedGrado, setSelectedGrado] = useState<string | undefined>(
        initialData?.curso
    );
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    useEffect(() => {
        if (selectedGrado && olimpiada_id) {
            getCategoriaAreaPorGrado(selectedGrado, olimpiada_id)
                .then(setCategorias)
                .catch(console.error);
        }
    }, [selectedGrado, olimpiada_id]);

    const submit: SubmitHandler<CategoriaAreaData> = (data) => onNext(data);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="curso"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Grado</FormLabel>
                            <FormControl>
                                <ComboBox
                                    disabled={initialData?.fieldsDisabled}
                                    values={grados}
                                    value={field.value}
                                    onChange={(val) => {
                                        field.onChange(val);
                                        setSelectedGrado(val as string);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="niveles_competencia"
                    render={({ field }) => {
                        let categoriasAreas =
                            categorias?.flatMap(
                                ({ id: idCat, nombre: nombreCat, areas }) =>
                                    areas?.map(
                                        ({
                                            id: idArea,
                                            nombre: nombreArea,
                                        }) => ({
                                            id: `${idArea}-${idCat}`,
                                            nombre: `${nombreArea} - ${nombreCat}`,
                                        })
                                    ) || []
                            ) || [];
                        if (initialData?.niveles_inscritos) {
                            categoriasAreas = categoriasAreas.filter(
                                ({ id }) => {
                                    const encontrado =
                                        initialData.niveles_inscritos?.find(
                                            ({ id_area, id_cat }) =>
                                                `${id_area}-${id_cat}` == id
                                        );
                                    return !encontrado;
                                }
                            );
                        }
                        return (
                            <FormItem>
                                <div className="flex justify-between">
                                    <FormLabel>Áreas - Categorias</FormLabel>

                                    {initialData?.niveles_inscritos && (
                                        <ModalIncritos
                                            initialData={initialData}
                                        />
                                    )}
                                </div>
                                <FormControl>
                                    <MultiSelect
                                        disabled={!selectedGrado}
                                        max={
                                            olimpiada?.limite_inscripciones ??
                                            0 -
                                                (initialData?.niveles_inscritos
                                                    ?.length ?? 0)
                                        }
                                        values={categoriasAreas}
                                        value={
                                            field.value?.map(
                                                ({ id_area, id_cat }) =>
                                                    `${id_area}-${id_cat}`
                                            ) || []
                                        }
                                        onChange={(selected: string[]) => {
                                            const transformed = selected.map(
                                                (item) => {
                                                    const [idArea, idCat] = item
                                                        .split("-")
                                                        .map(Number);
                                                    console.log(item);
                                                    return {
                                                        id_cat: idCat,
                                                        id_area: idArea,
                                                    };
                                                }
                                            );
                                            field.onChange(transformed);
                                        }}
                                        messageWithoutValues="No hay areas disponibles seleccione otro grado"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <div className="flex justify-between">
                    <Button variant="outline" onClick={onBack}>
                        Atrás
                    </Button>
                    <Button disabled={disabled} type="submit">
                        {textButton || "Finalizar"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
interface ModalIncritosProps {
    initialData: Partial<ExtraData>;
}

const ModalIncritos: FC<ModalIncritosProps> = ({ initialData }) => {
    const inscritos = initialData.niveles_inscritos ?? [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link">Ver registros previas</Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-md">
                        El Postulante esta registrado a las siguiente Areas
                        Categorias:
                    </DialogTitle>
                    <DialogDescription>
                        {inscritos.length > 0 ? (
                            <ul className="mt-2 space-y-2">
                                {inscritos.map(({ nivel_competencia }, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between"
                                    >
                                        <span className="font-medium">
                                            {nivel_competencia
                                                .split("-")
                                                .slice(0, -1)}
                                        </span>
                                        <span className="text-sm text-foreground/80">
                                            {nivel_competencia.split("-").pop()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2 text-sm text-gray-500">
                                No hay inscripciones previas.
                            </p>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
interface Cambio {
    campo: string;
    anterior: string | number;
    nuevo: string | number;
}
const StepFormPostulante = ({
    onSubmit,
    olimpiada,
}: {
    onSubmit: (data: StepData) => Promise<void>;
    olimpiada?: Olimpiada;
}) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<Partial<StepData>>({});
    const [openConfirmModification, setOpenConfirmModification] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [postulante, setPostulante] = useState<PostulanteData>();
    const [cambios, setCambios] = useState<Cambio[]>([]);
    const { departamentos, provincias, colegios, fetchUbicaciones } =
        useUbicacion();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUbicaciones();
            } catch (error) {
                console.error("Error al cargar datos de ubicación:", error);
            }
        };
        fetchData();
    }, [fetchUbicaciones]);

    const { ci } = useParams();
    if (!ci) return;

    const next = async (
        stepData:
            | PersonalData
            | UbicacionData
            | ContactoLista
            | CategoriaAreaData
            | ExtraData,

        postulante?: PostulanteData
    ) => {
        if (postulante) {
            setPostulante(postulante);

            setData({
                nombres: postulante.nombres,
                apellidos: postulante.apellidos,
                fecha_nacimiento: new Date(postulante.fecha_nacimiento),
                correo_postulante: postulante.email,
                departamento: postulante.id_departamento + "",
                provincia: postulante.id_provincia + "",
                colegio: postulante.id_colegio + "",
                curso: postulante.curso + "",
                ci: postulante.ci + "",
                niveles_inscritos: postulante.inscripciones.map(
                    ({ id_area, id_categoria, nivel_competencia }) => {
                        return {
                            id_area: id_area,
                            id_cat: id_categoria,
                            nivel_competencia,
                        };
                    }
                ),
            });
        }
        if (step == 0) {
            try {
                const {data} = await getResponsable(ci);
                const responsableContacto = {
                    telefono_contacto: data.telefono || "",
                    tipo_contacto_telefono: "4",
                    email_contacto: data.email || "",
                    tipo_contacto_email: "4",
                };
                setData((prev) => ({
                    ...prev,
                    contactos: [responsableContacto],
                }));
            } catch (e) {
                console.error(e);
            }
        }
        setData((prev) => ({ ...prev, ...stepData }));
        setStep((s) => s + 1);
    };
    const back = () => setStep((s) => Math.max(0, s - 1));

    const finish = async (
        stepData: null | CategoriaAreaData,
        force?: boolean
    ) => {
        let final = data as StepData;
        if (stepData) {
            setData({ ...data, ...stepData });
            final = { ...data, ...stepData } as StepData;
        }
        console.log("categorias???", stepData);
        console.log("final", final);
        // verificar diferencias entre datos anteriores y nuevos del postulante
        if (postulante && !force) {
            const cambios = obtenerCambios(
                postulante,
                final,
                departamentos,
                provincias,
                colegios
            );

            if (cambios.length > 0) {
                setCambios(cambios);
                setOpenConfirmModification(true);
                return;
            }
        }

        setLoading(true);
        try {
            await onSubmit(final);
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Error al enviar");
        } finally {
            setLoading(false);
        }
    };

    const stepLabels = [
        "Datos Personales",
        "Ubicación",
        "Contacto",
        "Categoría Y Área",
    ];

    return (
        <div className="w-full h-full flex flex-col justify-around mx-auto">
            <StepIndicator currentStep={step} steps={stepLabels} />
            {step === 0 && <PersonalStep initialData={data} onNext={next} />}
            {step === 1 && (
                <UbicacionStep initialData={data} onBack={back} onNext={next} />
            )}
            {step === 2 && (
                <ContactoStep
                    initialData={data.contactos || []}
                    onBack={back}
                    onNext={(contactos) => next({ contactos })}
                />
            )}

            {step === 3 && (
                <CategoriaAreaStep
                    olimpiada={olimpiada}
                    initialData={data}
                    onBack={back}
                    onNext={finish}
                    disabled={loading}
                    textButton={loading ? "Registrando..." : "Finalizar"}
                />
            )}
            <AlertDialog
                open={openConfirmModification}
                onOpenChange={setOpenConfirmModification}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estas seguro de que desea modificar los siguiente
                            datos?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Se reemplazarán los datos de las otras inscripciones
                            por los siguientes:
                        </AlertDialogDescription>
                        <ul className="pl-5 pr-8">
                            {cambios.map((cambio, index) => (
                                <li key={index}>
                                    <div className="flex items-center space-x-2">
                                        <strong>{cambio.campo}:</strong>{" "}
                                        <span className="font-semibold text-red-600">
                                            Anterior: {cambio.anterior}
                                        </span>
                                        <ArrowRight className="size-6" />
                                        <span className="font-semibold text-green-600">
                                            Nuevo: {cambio.nuevo}
                                        </span>
                                    </div>
                                    {cambio.campo === "Curso" && (
                                        <Alert
                                            className=""
                                            variant={"destructive"}
                                        >
                                            <TriangleAlert />
                                            <AlertTitle className="font-medium">
                                                Estás cambiando de grado:
                                            </AlertTitle>{" "}
                                            <AlertDescription>
                                                se eliminarán las
                                                inscripciones que no
                                                pertenecen a este grado.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                finish(null, true);
                            }}
                        >
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

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

const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
    return (
        <nav className="flex flex-wrap space-x-2  mx-auto justify-between  space-y-2 gap-3 mb-5">
            {steps.map((label, i) => (
                <div key={i} className="flex m-0 items-center ">
                    <div
                        className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full border-3 m-0",
                            i === currentStep
                                ? "border-primary bg-primary text-foreground"
                                : "border-foreground "
                        )}
                    >
                        {i + 1}
                    </div>
                    <span
                        className={cn(
                            "ml-2 ",
                            i === currentStep ? "text-primary font-bold" : ""
                        )}
                    >
                        {label}
                    </span>
                </div>
            ))}
        </nav>
    );
};
export default StepFormPostulante;

const obtenerCambios = (
    postulante: PostulanteData,
    data: StepData,
    departamentos: Departamento[],
    provincias: Provincia[],
    colegios: Colegio[]
) => {
    const cambios = [];

    if (postulante.ci != data.ci) {
        cambios.push({
            campo: "CI",
            anterior: postulante.ci,
            nuevo: data.ci,
        });
    }
    if (postulante.nombres != data.nombres) {
        cambios.push({
            campo: "Nombres",
            anterior: postulante.nombres,
            nuevo: data.nombres,
        });
    }
    if (postulante.apellidos != data.apellidos) {
        cambios.push({
            campo: "Apellidos",
            anterior: postulante.apellidos,
            nuevo: data.apellidos,
        });
    }

    if (postulante.fecha_nacimiento != getDateUTC(data.fecha_nacimiento)) {
        cambios.push({
            campo: "Fecha de Nacimiento",
            anterior: postulante.fecha_nacimiento,
            nuevo: getDateUTC(data.fecha_nacimiento),
        });
    }
    if (postulante.email != data.correo_postulante) {
        cambios.push({
            campo: "Correo Electrónico",
            anterior: postulante.email,
            nuevo: data.correo_postulante,
        });
    }
    console.log("departamentos", departamentos);
    if (postulante.id_departamento != data.departamento) {
        cambios.push({
            campo: "Departamento",
            anterior:
                departamentos.find(
                    ({ id }) =>
                        id.toString() === postulante.id_departamento.toString()
                )?.nombre || "",
            nuevo:
                departamentos.find(
                    ({ id }) => id.toString() === data.departamento.toString()
                )?.nombre || "",
        });
    }
    if (postulante.id_provincia != data.provincia) {
        cambios.push({
            campo: "Provincia",
            anterior:
                provincias.find(
                    ({ id }) =>
                        id.toString() === postulante.id_provincia.toString()
                )?.nombre || "",
            nuevo:
                provincias.find(
                    ({ id }) => id.toString() === data.provincia.toString()
                )?.nombre || "",
        });
    }
    if (postulante.id_colegio != data.colegio) {
        cambios.push({
            campo: "Colegio",
            anterior:
                colegios.find(
                    ({ id }) =>
                        id.toString() === postulante.id_colegio.toString()
                )?.nombre || "",
            nuevo:
                colegios.find(
                    ({ id }) => id.toString() === data.colegio.toString()
                )?.nombre || "",
        });
    }
    if (postulante.curso != data.curso) {
        cambios.push({
            campo: "Curso",
            anterior: grados[Number(postulante.curso) - 1].nombre || "",
            nuevo: grados[Number(data.curso) - 1].nombre || "",
        });
    }
    return cambios;
};

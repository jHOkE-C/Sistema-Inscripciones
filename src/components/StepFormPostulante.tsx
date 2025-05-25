import { useState, useEffect } from "react";
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
import { getCategoriaAreaPorGrado, type Categoria } from "@/api/areas";
import { useUbicacion } from "@/context/UbicacionContext";
import type { Olimpiada } from "@/types/versiones.type";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

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
    areas: z.array(z.object({ id_area: z.number(), id_cat: z.number() })),
});

type PersonalData = z.infer<typeof personalSchema>;
type UbicacionData = z.infer<typeof ubicacionSchema>;
type ContactoData = z.infer<typeof contactoSchema>;
type CategoriaAreaData = z.infer<typeof categoriaAreaSchema>;

interface StepIndicatorProps {
    currentStep: number;
    steps: string[];
}

export type StepData = PersonalData &
    UbicacionData &
    ContactoData &
    CategoriaAreaData;

const PersonalStep = ({
    initialData,
    onNext,
}: {
    initialData?: Partial<PersonalData>;
    onNext: (data: PersonalData) => void;
}) => {
    const form = useForm<PersonalData>({
        resolver: zodResolver(personalSchema),
        defaultValues: initialData,
        mode: "onSubmit",
    });

    const submit: SubmitHandler<PersonalData> = (data) => {
        onNext(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombres</FormLabel>
                            <FormControl>
                                <Input
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
                    name="ci"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>CI</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Número de CI"
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
    initialData?: Partial<UbicacionData>;
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
                                    disabled={ubicacionesLoading}
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
                                    disabled={!selectedDepartamento}
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
                                        !field.value && ubicacionesLoading
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

const ContactoStep = ({
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
    const contactos = [
        { id: "1", nombre: "Profesor" },
        { id: "2", nombre: "Mamá/Papá" },
        { id: "3", nombre: "Estudiante" },
    ];

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
                                    values={contactos}
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
                                    values={contactos}
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

const CategoriaAreaStep = ({
    olimpiada,
    initialData,
    onBack,
    onNext,
    disabled,
    textButton,
}: {
    initialData?: Partial<CategoriaAreaData>;
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
                    name="areas"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Áreas</FormLabel>
                            <FormControl>
                                <MultiSelect
                                    disabled={!selectedGrado}
                                    max={olimpiada?.limite_inscripciones}
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
                                                        nombre: `${nombreArea} - ${nombreCat}`,
                                                    })
                                                ) || []
                                        ) || []
                                    }
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
                    )}
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

const StepFormPostulante = ({
    onSubmit,
    olimpiada,
}: {
    onSubmit: (data: StepData) => Promise<void>;
    olimpiada?: Olimpiada;
}) => {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<Partial<StepData>>({});
    const [loading, setLoading] = useState(false);

    const next = (
        stepData:
            | PersonalData
            | UbicacionData
            | ContactoData
            | CategoriaAreaData
    ) => {
        setData((prev) => ({ ...prev, ...stepData }));
        setStep((s) => s + 1);
    };
    const back = () => setStep((s) => Math.max(0, s - 1));

    const finish = async (stepData: CategoriaAreaData) => {
        const final = { ...data, ...stepData } as StepData;
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
        "Categoría & Área",
    ];

    return (
        <div className="w-full  mx-auto">
            <StepIndicator currentStep={step} steps={stepLabels} />
            {step === 0 && <PersonalStep initialData={data} onNext={next} />}
            {step === 1 && (
                <UbicacionStep initialData={data} onBack={back} onNext={next} />
            )}
            {step === 2 && (
                <ContactoStep initialData={data} onBack={back} onNext={next} />
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
        <nav className="flex space-x-4 mb-6 mx-auto justify-center">
            {steps.map((label, i) => (
                <div key={i} className="flex items-center">
                    <div
                        className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full border-2",
                            i === currentStep
                                ? "border-primary bg-primary text-foreground"
                                : "border-foreground "
                        )}
                    >
                        {i + 1}
                    </div>
                    <span
                        className={cn(
                            "ml-2 text-sm",
                            i === currentStep
                                ? "text-primary font-semibold"
                                : ""
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

/// Corregir las areas con el grado
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

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
import {
  getCategoriaAreaPorGrado,
  type Categoria,
  type Area,
} from "@/models/api/areas";
import { MultiSelect } from "@/components/MultiSelect";
import { useOlimpiada } from "@/models/getCacheResponsable/useOlimpiadas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "react-router-dom";
import { MyCombobox } from "@/components/MyComboBox";
import { DateSelector } from "@/components/DateSelector";
import { toast } from "sonner";

import { useUbicacion } from "@/viewModels/context/UbicacionContext";
import { CONTACTOS } from "@/models/interfaces/postulantes";

export const grados = [
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

export const postulanteSchema = z.object({
  nombres: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
    .max(50, { message: "El nombre no debe exceder los 50 caracteres." }),

  apellidos: z
    .string()
    .min(3, { message: "El apellido debe tener al menos 3 caracteres." })
    .max(50, { message: "El apellido no debe exceder los 50 caracteres." }),

  ci: z
    .string()
    .min(7, "La Cédula de Identidad debe tener al menos 7 dígitos")
    .max(10, "La Cédula de Identidad no puede tener más de 10 digitos"),
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
      message: "El correo de contacto no debe exceder los 100 caracteres.",
    }),

  tipo_contacto_telefono: z.string().min(1, {
    message: "El tipo de contacto por teléfono es obligatorio.",
  }),

  telefono_contacto: z
    .string()
    .regex(/^\d+$/, { message: "El teléfono solo debe contener números." })
    .min(7, { message: "El teléfono debe tener al menos 7 dígitos." })
    .max(8, { message: "El teléfono no debe exceder los 8 dígitos." }),

  colegio: z.string(),
});

interface FormProps {
  onCancel?: () => void;
  onSubmit?: (data: z.infer<typeof postulanteSchema>) => void;
}
const FormPostulante = ({
  onCancel = () => {},
  onSubmit = () => {},
}: FormProps) => {
  const [selectedGrado, setSelectedGrado] = useState<string>();
  const [selectedDepartamento, setSelectedDepartamento] = useState<string>();
  const form = useForm<z.infer<typeof postulanteSchema>>({
    resolver: zodResolver(postulanteSchema),
    mode: "onSubmit",
  });

  const { olimpiada_id } = useParams();
  const {
    data: olimpiada,
    isLoading: olimpiadaLoading,
    isError: olimpiadaError,
  } = useOlimpiada(Number(olimpiada_id));
  const [loading, setLoading] = useState(false);
  const {
    departamentos,
    provincias,
    colegios,
    loading: ubicacionesLoading,
    fetchUbicaciones,
  } = useUbicacion();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    fetchUbicaciones();
  }, [fetchUbicaciones]);

  useEffect(() => {
    if (olimpiadaError) {
      console.error("Error al obtener olimpiada");
    }
  }, [olimpiadaError]);

  useEffect(() => {
    if (!selectedGrado || !olimpiada_id) return;
    const fetchArea = async () => {
      const areas = await getCategoriaAreaPorGrado(selectedGrado, olimpiada_id);
      setCategorias(areas);
    };
    fetchArea();
  }, [selectedGrado, olimpiada_id]);

  const [openAccordions, setOpenAccordions] = useState<string[]>(["personal"]);

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

  const enviar = async (data: z.infer<typeof postulanteSchema>) => {
    if (loading) return;
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Hubo un error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(enviar, handleErrors)}>
          <div className="grid gap-4 py-2">
            <div className="grid  gap-4">
              <Accordion
                type="multiple"
                value={openAccordions}
                onValueChange={(value) => {
                  setOpenAccordions(value);
                }}
                className="space-y-4"
              >
                <AccordionItem value="personal">
                  <AccordionTrigger className="hover:text-primary">
                    Datos Personales
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 mt-2">
                    <div className="grid grid-cols-1  gap-4">
                      <FormField
                        control={form.control}
                        name="nombres"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombres</FormLabel>
                            <FormControl className="col-span-2">
                              <Input placeholder="Ingrese Nombres" {...field} />
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
                            <FormControl className="col-span-2">
                              <Input
                                placeholder="Ingrese Apellidos"
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
                            <FormLabel>CI</FormLabel>
                            <FormControl className="col-span-2">
                              <Input
                                maxLength={10}
                                minLength={7}
                                placeholder="Ingrese CI"
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
                            <FormLabel>Fecha de Nacimiento</FormLabel>
                            <FormControl className="col-span-2">
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
                            <FormControl className="col-span-2">
                              <Input placeholder="Ingrese Correo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ubicacion">
                  <AccordionTrigger className="hover:text-primary">
                    Ubicación
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 mt-2">
                    <div className="grid grid-cols-1  gap-4">
                      <FormField
                        control={form.control}
                        name="departamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Departamento</FormLabel>

                            <FormControl className="col-span-2">
                              <ComboBox
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setSelectedDepartamento(
                                    Array.isArray(e) ? e[0] : e
                                  );
                                }}
                                values={departamentos.map(({ id, nombre }) => ({
                                  id: id.toString(),
                                  nombre,
                                }))}
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
                                className="col-span-2"
                                disabled={!selectedDepartamento}
                                value={field.value}
                                onChange={field.onChange}
                                values={provincias
                                  .filter(
                                    ({ departamento_id }) =>
                                      departamento_id == selectedDepartamento
                                  )
                                  .map(({ id, nombre }) => ({
                                    id: id.toString(),
                                    nombre,
                                  }))}
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
                              <MyCombobox values={colegios} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contacto">
                  <AccordionTrigger className="hover:text-primary">
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
                              Número de teléfono de referencia
                            </FormLabel>
                            <FormControl>
                              <Input
                                maxLength={8}
                                placeholder="Ingrese Telefono de Referencia"
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

                      {/* Email contacto */}
                      <FormField
                        control={form.control}
                        name="email_contacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Correo electrónico de referencia
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese Correo de Referencia"
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
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="categoria-area">
                  <AccordionTrigger className="hover:text-primary">
                    Categoria - Área
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 mt-2">
                    <div className="grid grid-cols-1 gap-4">
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
                                onChange={(e) => {
                                  field.onChange(e);
                                  setSelectedGrado(String(e));
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
                              Selecciona hasta {olimpiada?.limite_inscripciones}{" "}
                              Áreas
                            </FormLabel>
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
                                    }: Categoria) =>
                                      areas?.map(
                                        ({
                                          id: idArea,
                                          nombre: nombreArea,
                                        }: Area) => ({
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
                                  const transformed = selected.map((item) => {
                                    const [idArea, idCat] = item
                                      .split("-")
                                      .map(Number);
                                    return {
                                      id_cat: idCat,
                                      id_area: idArea,
                                    };
                                  });
                                  field.onChange(transformed);
                                }}
                                messageWithoutValues="No hay areas disponibles seleccione otro grado"
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
            <Button
              disabled={loading || ubicacionesLoading || olimpiadaLoading}
              type="submit"
              onClick={form.handleSubmit(enviar, handleErrors)}
            >
              {loading ? "Registrando..." : "Agregar Postulante"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FormPostulante;

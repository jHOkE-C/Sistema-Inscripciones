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
import { useState } from "react";
import DatePicker from "./DatePicker";
import { ComboBox } from "./ComboBox";
import { Plus } from "lucide-react";

const areas = [
    { value: "0", label: "ASTRONOMÍA - ASTROFÍSICA" },
    { value: "1", label: "BIOLOGÍA" },
    { value: "2", label: "FÍSICA" },
    { value: "3", label: "INFORMATICA" },
    { value: "4", label: "MATEMATICAS" },
];

const grados = [
    { value: "0", label: "1ro Primaria" },
    { value: "1", label: "2do Primaria" },
    { value: "2", label: "3ro Primaria" },
    { value: "3", label: "4to Primaria" },
    { value: "4", label: "5to Primaria" },
    { value: "5", label: "6to Primaria" },
    { value: "6", label: "1ro Secundaria" },
    { value: "7", label: "2do Secundaria" },
    { value: "8", label: "3ro Secundaria" },
    { value: "9", label: "4to Secundaria" },
    { value: "10", label: "5to Secundaria" },
    { value: "11", label: "6to Secundaria" },
];

const contactos = [
    { value: "0", label: "Profesor" },
    { value: "1", label: "Mamá/Papá" },
    { value: "2", label: "Estudiante" },
];

const FormPostulante = () => {
    const [date, setDate] = useState<Date>();
    const [area, setArea] = useState("");
    const [grado, setGrado] = useState("");
    const [correoDe, setCorreoDe] = useState("");
    const [celularDe, setCelularDe] = useState("");

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
                <div className="grid gap-4 py-2">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="nombre"
                                className="text-sm font-medium"
                            >
                                Nombres
                            </label>
                            <Input id="nombre" placeholder="Nombres" />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="apellido"
                                className="text-sm font-medium"
                            >
                                Apellidos
                            </label>
                            <Input id="apellido" placeholder="Apellidos" />
                        </div>
                        <div className="space-y-2 ">
                            <label htmlFor="ci" className="text-sm font-medium">
                                CI
                            </label>
                            <Input id="ci" placeholder="12345678" />
                        </div>
                        <div className="space-y-2 ">
                            <label
                                htmlFor="fecha"
                                className="text-sm font-medium"
                            >
                                Fecha Nacimiento
                            </label>
                            <DatePicker
                                date={date}
                                setDate={setDate}
                                id={"fecha"}
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Correo Electrónico
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="departamento"
                                className="text-sm font-medium"
                            >
                                Departamento
                            </label>
                            <Input id="departamento" placeholder="Cochabamba" />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="provincia"
                                className="text-sm font-medium"
                            >
                                Provincia
                            </label>
                            <Input id="provincia" placeholder="Cercado" />
                        </div>
                        <div className="space-y-2 ">
                            <label
                                htmlFor="colegio"
                                className="text-sm font-medium"
                            >
                                Colegio
                            </label>
                            <Input id="colegio" placeholder="U.E. ejemplo" />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="grado"
                                className="text-sm font-medium"
                            >
                                Grado
                            </label>
                            <ComboBox
                                id="grado"
                                values={grados}
                                value={grado}
                                setValue={setGrado}
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="area"
                                className="text-sm font-medium"
                            >
                                Área
                            </label>
                            <ComboBox
                                disabled={grado === ""}
                                id="area"
                                values={areas}
                                value={area}
                                setValue={setArea}
                            />
                        </div>
                        <div className="space-y-2 ">
                            <label
                                htmlFor="celular"
                                className="text-sm font-medium"
                            >
                                Numero de telefono de referencia
                            </label>
                            <Input id="celular" placeholder="12345678" />
                        </div>
                        <div className="space-y-2 ">
                            <label
                                htmlFor="celular-de"
                                className="text-sm font-medium"
                            >
                                El telefono pertenece a:
                            </label>

                            <ComboBox
                                id="celular-de"
                                value={celularDe}
                                setValue={setCelularDe}
                                values={contactos}
                            />
                        </div>
                        <div className="space-y-2 ">
                            <label
                                htmlFor="correo-contacto"
                                className="text-sm font-medium"
                            >
                                Correo electronico de referencia
                            </label>
                            <Input
                                id="correo-contacto"
                                placeholder="contacto@ejemplo.com"
                            />
                        </div>
                        <div className="space-y-2 ">
                            <label
                                htmlFor="correo-de"
                                className="text-sm font-medium"
                            >
                                El Correo electronico pertenece a:
                            </label>

                            <ComboBox
                                id="correo-de"
                                value={correoDe}
                                setValue={setCorreoDe}
                                values={contactos}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <DialogTrigger asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogTrigger>
                    <Button>Guardar Postulante</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FormPostulante;

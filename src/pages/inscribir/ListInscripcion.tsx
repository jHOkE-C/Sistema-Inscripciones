import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import PostulanteDetalle from "./postulante-detalle";
import FormPostulante from "./FormPostulante";
import ShareUrl from "./ShareUrl";
import { useParams } from "react-router-dom";
import { getInscripcion } from "@/utils/apiUtils";


// Datos de ejemplo para los postulantes
const postulantes = [
    {
        id: 1,
        nombre: "Carlos Rodríguez",
        fechaNacimiento: "1999-05-15",
        categoria: "Natación",
        area: "100m Libre",
        estado: "Aprobado",
        email: "carlos.rodriguez@email.com",
        telefono: "+51 987 654 321",
        documentos: ["DNI", "Certificado Médico", "Ficha de Inscripción"],
        fechaRegistro: "15/04/2024",
    },
    {
        id: 2,
        nombre: "María López",
        fechaNacimiento: "2002-08-22",
        categoria: "Atletismo",
        area: "Salto Largo",
        estado: "Pendiente",
        email: "maria.lopez@email.com",
        telefono: "+51 912 345 678",
        documentos: ["DNI", "Ficha de Inscripción"],
        fechaRegistro: "18/04/2024",
    },
    {
        id: 3,
        nombre: "Juan Pérez",
        fechaNacimiento: "1997-11-30",
        categoria: "Fútbol",
        area: "Equipo Masculino",
        estado: "Rechazado",
        email: "juan.perez@email.com",
        telefono: "+51 945 678 123",
        documentos: ["DNI", "Certificado Médico"],
        fechaRegistro: "10/04/2024",
    },
    {
        id: 4,
        nombre: "Ana Gómez",
        fechaNacimiento: "2000-02-14",
        categoria: "Voleibol",
        area: "Equipo Femenino",
        estado: "Aprobado",
        email: "ana.gomez@email.com",
        telefono: "+51 923 456 789",
        documentos: ["DNI", "Certificado Médico", "Ficha de Inscripción"],
        fechaRegistro: "12/04/2024",
    },
    {
        id: 5,
        nombre: "Luis Torres",
        fechaNacimiento: "1998-07-07",
        categoria: "Baloncesto",
        area: "Equipo Masculino",
        estado: "Pendiente",
        email: "luis.torres@email.com",
        telefono: "+51 934 567 890",
        documentos: ["DNI", "Ficha de Inscripción"],
        fechaRegistro: "20/04/2024",
    },
    {
        id: 6,
        nombre: "Sofia Mendoza",
        fechaNacimiento: "2001-12-03",
        categoria: "Tenis",
        area: "Individual Femenino",
        estado: "Pendiente de Pago",
        email: "sofia.mendoza@email.com",
        telefono: "+51 956 789 012",
        documentos: ["DNI", "Ficha de Inscripción"],
        fechaRegistro: "22/04/2024",
    },
];

export default function ListInscripcion() {
    const [selectedPostulante, setSelectedPostulante] = useState<Postulante | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedPostulantes, setSelectedPostulantes] = useState<number[]>([]);
    const [activeTab, setActiveTab] = useState("todos");
    const { uuid } = useParams();

    useEffect(()=>{
        console.log("UUID:",uuid)
        getInscripcion();
    },[])


    interface TabChangeHandler {
        (value: string): void;
    }

    const handleTabChange: TabChangeHandler = (value) => {
        setActiveTab(value);
    };

    interface StatusBadgeProps {
        estado: string;
    }

    const getStatusBadge = (estado: StatusBadgeProps["estado"]): JSX.Element => {
        switch (estado) {
            case "Aprobado":
                return <Badge className="bg-green-500">Aprobado</Badge>;
            case "Pendiente":
                return <Badge className="bg-yellow-500">Pendiente</Badge>;
            case "Rechazado":
                return <Badge className="bg-red-500">Rechazado</Badge>;
            case "Pendiente de Pago":
                return (
                    <Badge className="bg-orange-500">Pendiente de Pago</Badge>
                );
            default:
                return <Badge className="bg-gray-500">{estado}</Badge>;
        }
    };

    interface Postulante {
        id: number;
        nombre: string;
        fechaNacimiento: string;
        categoria: string;
        area: string;
        estado: string;
        email: string;
        telefono: string;
        documentos: string[];
        fechaRegistro: string;
    }

    const openPostulanteDetail = (postulante: Postulante): void => {
        setSelectedPostulante(postulante);
        setIsDetailOpen(true);
    };


    const handlePagoInscripcion = (postulante: Postulante): void => {
        // Aquí iría la lógica para procesar el pago
        console.log(`Procesando pago para ${postulante.nombre}`);
        // Por ahora, solo mostraremos una alerta
        alert(`Pago de inscripción procesado para ${postulante.nombre}`);
    };

    const handleGenerarOrdenPago = () => {
        if (selectedPostulantes.length === 0) {
            alert(
                "Por favor, seleccione al menos un postulante para generar la orden de pago."
            );
            return;
        }
        const postulantesPago = postulantes.filter((p) =>
            selectedPostulantes.includes(p.id)
        );
        console.log("Generando orden de pago para:", postulantesPago);
        alert(
            `Orden de pago generada para ${postulantesPago.length} postulante(s)`
        );
    };

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1">
                {/* Sidebar */}
                {/* <Sidebar /> */}
                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <ShareUrl />
                    <div className="p-8 py-6 sm:p-10">
                        <div className="mb-6 flex flex-col gap-2">
                            <h1 className="text-3xl font-bold">
                                Mis Postulantes
                            </h1>
                            <p className="text-muted-foreground">
                                Gestiona los postulantes que has registrado para
                                las olimpiadas ohSansi
                            </p>
                        </div>

                        <Tabs
                            defaultValue="todos"
                            className="mb-6"
                            value={activeTab}
                            onValueChange={handleTabChange}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                <Select
                                    value={activeTab}
                                    onValueChange={handleTabChange}
                                >
                                    <SelectTrigger className="w-full sm:hidden">
                                        <SelectValue placeholder="Filtrar por estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">
                                            Todos
                                        </SelectItem>
                                        <SelectItem value="aprobados">
                                            Aprobados
                                        </SelectItem>
                                        <SelectItem value="pendientes">
                                            Pendientes
                                        </SelectItem>
                                        <SelectItem value="pendientes-pago">
                                            Pendientes de Pago
                                        </SelectItem>
                                        <SelectItem value="rechazados">
                                            Rechazados
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <TabsList className="hidden sm:block">
                                    <TabsTrigger value="todos">
                                        Todos
                                    </TabsTrigger>
                                    <TabsTrigger value="aprobados">
                                        Aprobados
                                    </TabsTrigger>
                                    <TabsTrigger value="pendientes">
                                        Pendientes
                                    </TabsTrigger>
                                    <TabsTrigger value="pendientes-pago">
                                        Pendientes de Pago
                                    </TabsTrigger>
                                    <TabsTrigger value="rechazados">
                                        Rechazados
                                    </TabsTrigger>
                                </TabsList>
                                <div className="grid sm:flex gap-2">
                                    <div className="relative w-full">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Buscar postulante..."
                                            className="pl-8 sm:w-[300px]"
                                        />
                                    </div>

                                    <FormPostulante />
                                </div>
                            </div>

                            <TabsContent value="todos" className="mt-0">
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]">
                                                        <Checkbox
                                                            checked={
                                                                selectedPostulantes.length ===
                                                                postulantes.length
                                                            }
                                                            onCheckedChange={(
                                                                checked
                                                            ) => {
                                                                setSelectedPostulantes(
                                                                    checked
                                                                        ? postulantes.map(
                                                                              (
                                                                                  p
                                                                              ) =>
                                                                                  p.id
                                                                          )
                                                                        : []
                                                                );
                                                            }}
                                                        />
                                                    </TableHead>
                                                    <TableHead>
                                                        Nombre
                                                    </TableHead>

                                                    <TableHead>
                                                        Categoría
                                                    </TableHead>
                                                    <TableHead>Área</TableHead>
                                                    <TableHead>
                                                        Estado
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha Registro
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {postulantes.map(
                                                    (postulante) => (
                                                        <TableRow
                                                            key={postulante.id}
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedPostulantes.includes(
                                                                        postulante.id
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        setSelectedPostulantes(
                                                                            checked
                                                                                ? [
                                                                                      ...selectedPostulantes,
                                                                                      postulante.id,
                                                                                  ]
                                                                                : selectedPostulantes.filter(
                                                                                      (
                                                                                          id
                                                                                      ) =>
                                                                                          id !==
                                                                                          postulante.id
                                                                                  )
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    postulante.nombre
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.categoria
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.area
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    postulante.estado
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaRegistro
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Abrir
                                                                                menú
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openPostulanteDetail(
                                                                                    postulante
                                                                                )
                                                                            }
                                                                        >
                                                                            Ver
                                                                            Detalles
                                                                        </DropdownMenuItem>
                                                                        {postulante.estado ===
                                                                            "Pendiente de Pago" && (
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handlePagoInscripcion(
                                                                                        postulante
                                                                                    )
                                                                                }
                                                                            >
                                                                                Pagar
                                                                                Inscripción
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem>
                                                                            Editar
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-red-600">
                                                                            Eliminar
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleGenerarOrdenPago}>
                                        Generar Orden de Pago
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="aprobados" className="mt-0">
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                    <TableHead>
                                                        Nombre
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha de Nacimiento
                                                    </TableHead>
                                                    <TableHead>
                                                        Categoría
                                                    </TableHead>
                                                    <TableHead>Área</TableHead>
                                                    <TableHead>
                                                        Estado
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha Registro
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {postulantes
                                                    .filter(
                                                        (p) =>
                                                            p.estado ===
                                                            "Aprobado"
                                                    )
                                                    .map((postulante) => (
                                                        <TableRow
                                                            key={postulante.id}
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedPostulantes.includes(
                                                                        postulante.id
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        setSelectedPostulantes(
                                                                            checked
                                                                                ? [
                                                                                      ...selectedPostulantes,
                                                                                      postulante.id,
                                                                                  ]
                                                                                : selectedPostulantes.filter(
                                                                                      (
                                                                                          id
                                                                                      ) =>
                                                                                          id !==
                                                                                          postulante.id
                                                                                  )
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    postulante.nombre
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaNacimiento
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.categoria
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.area
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    postulante.estado
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaRegistro
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Abrir
                                                                                menú
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openPostulanteDetail(
                                                                                    postulante
                                                                                )
                                                                            }
                                                                        >
                                                                            Ver
                                                                            Detalles
                                                                        </DropdownMenuItem>
                                                                        {postulante.estado ===
                                                                            "Pendiente de Pago" && (
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handlePagoInscripcion(
                                                                                        postulante
                                                                                    )
                                                                                }
                                                                            >
                                                                                Pagar
                                                                                Inscripción
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem>
                                                                            Editar
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-red-600">
                                                                            Eliminar
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleGenerarOrdenPago}>
                                        Generar Orden de Pago
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="pendientes" className="mt-0">
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                    <TableHead>
                                                        Nombre
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha de Nacimiento
                                                    </TableHead>
                                                    <TableHead>
                                                        Categoría
                                                    </TableHead>
                                                    <TableHead>Área</TableHead>
                                                    <TableHead>
                                                        Estado
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha Registro
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {postulantes
                                                    .filter(
                                                        (p) =>
                                                            p.estado ===
                                                            "Pendiente"
                                                    )
                                                    .map((postulante) => (
                                                        <TableRow
                                                            key={postulante.id}
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedPostulantes.includes(
                                                                        postulante.id
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        setSelectedPostulantes(
                                                                            checked
                                                                                ? [
                                                                                      ...selectedPostulantes,
                                                                                      postulante.id,
                                                                                  ]
                                                                                : selectedPostulantes.filter(
                                                                                      (
                                                                                          id
                                                                                      ) =>
                                                                                          id !==
                                                                                          postulante.id
                                                                                  )
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    postulante.nombre
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaNacimiento
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.categoria
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.area
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    postulante.estado
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaRegistro
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Abrir
                                                                                menú
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openPostulanteDetail(
                                                                                    postulante
                                                                                )
                                                                            }
                                                                        >
                                                                            Ver
                                                                            Detalles
                                                                        </DropdownMenuItem>
                                                                        {postulante.estado ===
                                                                            "Pendiente de Pago" && (
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handlePagoInscripcion(
                                                                                        postulante
                                                                                    )
                                                                                }
                                                                            >
                                                                                Pagar
                                                                                Inscripción
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem>
                                                                            Editar
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-red-600">
                                                                            Eliminar
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleGenerarOrdenPago}>
                                        Generar Orden de Pago
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="pendientes-pago"
                                className="mt-0"
                            >
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                    <TableHead>
                                                        Nombre
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha de Nacimiento
                                                    </TableHead>
                                                    <TableHead>
                                                        Categoría
                                                    </TableHead>
                                                    <TableHead>Área</TableHead>
                                                    <TableHead>
                                                        Estado
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha Registro
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {postulantes
                                                    .filter(
                                                        (p) =>
                                                            p.estado ===
                                                            "Pendiente de Pago"
                                                    )
                                                    .map((postulante) => (
                                                        <TableRow
                                                            key={postulante.id}
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedPostulantes.includes(
                                                                        postulante.id
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        setSelectedPostulantes(
                                                                            checked
                                                                                ? [
                                                                                      ...selectedPostulantes,
                                                                                      postulante.id,
                                                                                  ]
                                                                                : selectedPostulantes.filter(
                                                                                      (
                                                                                          id
                                                                                      ) =>
                                                                                          id !==
                                                                                          postulante.id
                                                                                  )
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    postulante.nombre
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaNacimiento
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.categoria
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.area
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    postulante.estado
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaRegistro
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Abrir
                                                                                menú
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openPostulanteDetail(
                                                                                    postulante
                                                                                )
                                                                            }
                                                                        >
                                                                            Ver
                                                                            Detalles
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handlePagoInscripcion(
                                                                                    postulante
                                                                                )
                                                                            }
                                                                        >
                                                                            Pagar
                                                                            Inscripción
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            Editar
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-red-600">
                                                                            Eliminar
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleGenerarOrdenPago}>
                                        Generar Orden de Pago
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="rechazados" className="mt-0">
                                <Card>
                                    <CardContent className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                    <TableHead>
                                                        Nombre
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha de Nacimiento
                                                    </TableHead>
                                                    <TableHead>
                                                        Categoría
                                                    </TableHead>
                                                    <TableHead>Área</TableHead>
                                                    <TableHead>
                                                        Estado
                                                    </TableHead>
                                                    <TableHead>
                                                        Fecha Registro
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {postulantes
                                                    .filter(
                                                        (p) =>
                                                            p.estado ===
                                                            "Rechazado"
                                                    )
                                                    .map((postulante) => (
                                                        <TableRow
                                                            key={postulante.id}
                                                        >
                                                            <TableCell>
                                                                <Checkbox
                                                                    checked={selectedPostulantes.includes(
                                                                        postulante.id
                                                                    )}
                                                                    onCheckedChange={(
                                                                        checked
                                                                    ) => {
                                                                        setSelectedPostulantes(
                                                                            checked
                                                                                ? [
                                                                                      ...selectedPostulantes,
                                                                                      postulante.id,
                                                                                  ]
                                                                                : selectedPostulantes.filter(
                                                                                      (
                                                                                          id
                                                                                      ) =>
                                                                                          id !==
                                                                                          postulante.id
                                                                                  )
                                                                        );
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    postulante.nombre
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaNacimiento
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.categoria
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.area
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    postulante.estado
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    postulante.fechaRegistro
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">
                                                                                Abrir
                                                                                menú
                                                                            </span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openPostulanteDetail(
                                                                                    postulante
                                                                                )
                                                                            }
                                                                        >
                                                                            Ver
                                                                            Detalles
                                                                        </DropdownMenuItem>
                                                                        {postulante.estado ===
                                                                            "Pendiente de Pago" && (
                                                                            <DropdownMenuItem
                                                                                onClick={() =>
                                                                                    handlePagoInscripcion(
                                                                                        postulante
                                                                                    )
                                                                                }
                                                                            >
                                                                                Pagar
                                                                                Inscripción
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem>
                                                                            Editar
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="text-red-600">
                                                                            Eliminar
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={handleGenerarOrdenPago}>
                                        Generar Orden de Pago
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>

            {/* Detalle del Postulante Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    {selectedPostulante && (
                        <PostulanteDetalle
                            postulante={selectedPostulante}
                            onClose={() => setIsDetailOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

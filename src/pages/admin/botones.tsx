import { Button } from "@/components/ui/button";
import {  Users, Link as Asociar, Layers2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import GestionRegistration from "./RegistrarGestion";
import { AreasModal } from "./areas-modal";

export default function Botones() {
    return (
        <div className="flex flex-col space-y-4 p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 grid-">
                <GestionRegistration refresh={() => {}} />

                <AreasModal />

                <Button
                    className="h-auto py-10 bg-amber-600 hover:bg-amber-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg lg:col-span-1"
                    asChild
                >
                    <Link to="/admin/categorias">
                        <Layers2 className="size-8 mb-1" />
                        <span className="text-lg font-semibold">
                            Gestionar categorías
                        </span>
                    </Link>
                </Button>

                <Button
                    className="h-auto py-10 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
                    asChild
                >
                    <Link to="/gestionar-postulantes">
                        <Users className="size-8 mb-1" />
                        <span className="text-lg font-semibold">
                            Gestionar postulantes
                        </span>
                    </Link>
                </Button>

                <Button
                    className="h-auto py-10 bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
                    asChild
                >
                    <Link to="/admin/subirExcel">
                        <Asociar className="size-8 mb-1" />
                        <span className="text-lg font-semibold">Subir Excel</span>
                    </Link>
                </Button>

                <Button
                    className="h-auto py-10 bg-pink-600 hover:bg-pink-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
                    asChild
                >
                    <Link to="fases">
                        <Asociar className="size-8 mb-1" />
                        <span className="text-lg font-semibold">
                            Definir fases
                        </span>
                    </Link>
                </Button>
                <Button
                    className="h-auto py-10 bg-slate-600 hover:bg-slate-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
                    asChild
                >
                    <Link to="/admin/asociarAreas">
                        <Asociar className="size-8 mb-1" />
                        <span className="text-lg font-semibold">
                            Asociar áreas
                        </span>
                    </Link>
                </Button>
                <Button
                    className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
                    asChild
                >
                    <Link to="/admin/asociarCategorias">
                        <Asociar className="size-8 mb-1" />
                        <span className="text-lg font-semibold">
                            Asociar Categorías
                        </span>
                    </Link>
                </Button>
                <Button
                    className="h-auto py-10 bg-sky-600 hover:bg-sky-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1"
                    asChild
                >
                    <Link to="version">
                        <Trophy className="size-8 mb-1" />
                        <span className="text-lg font-semibold">
                            Versiones de Olimpiada
                        </span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}

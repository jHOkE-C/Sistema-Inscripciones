import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListasPostulantes } from "@/api/postulantes";
import FormResponsable from "../../FormResponsable";
import NotFoundPage from "../../../404";
import Loading from "@/components/Loading";
import ReturnComponent from "@/components/ReturnComponent";
import Footer from "@/components/Footer";
import ButtonsGrid from "@/components/ButtonsGrid";
import { ButtonConfig } from "@/interfaces/buttons.interface";
import {  Receipt, List, CheckCircle } from "lucide-react";
import { apiClient } from "@/api/request";
import { Olimpiada } from "@/types/versiones.type";
import InscribirPostulante from "../../../../components/InscribirPostulante";
import ShareUrl from "../../ShareUrl";
import OlimpiadaNoEnCurso from "@/components/OlimpiadaNoEnCurso";
import InscribirExcel from "@/components/InscribirExcel";

const Page = () => {
    const [openFormResponsable, setOpenFormResponsable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [olimpiada, setOlimpiada] = useState<Olimpiada>();
    const { ci, olimpiada_id } = useParams();
    const buttons: ButtonConfig[] = [
        // {
        //     label: "Inscribir por Excel",
        //     to: `/inscribir/${olimpiada_id}/${ci}/viaExcel`,
        //     Icon: FileIcon,
        //     color: "green",
        // },
        {
            label: "Ver Inscripciones",
            to: `listas`,
            Icon: List,
        },
        {
            label: "Generar Orden de Pago",
            to: `generarOrden`,
            Icon: Receipt,
            color: "amber",
        },
        {
            label: "Subir Comprobante de Pago",
            to: `subirComprobanteDePago`,
            Icon: CheckCircle,
            color: "slate",
        },
    ];
    const getOlimpiada = async () => {
        const olimpiada = await apiClient.get<Olimpiada>(
            "/api/olimpiadas/" + olimpiada_id
        );
        setOlimpiada(olimpiada);
    };
    useEffect(() => {
        if (!ci || ci.length < 7 || ci.length > 10) return;
        fetchData();
        getOlimpiada();
    }, []);

    if (!ci || ci.length < 7 || ci.length > 10) {
        return <NotFoundPage />;
    }
    if (!olimpiada_id) return;

    const refresh = async () => {
        setLoading(true);
        try {
            await getListasPostulantes(ci);
            setOpenFormResponsable(false);
        } catch {
            setOpenFormResponsable(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            refresh();
        } catch {
            console.error("Error al obtener las inscripciones de postulantes");
        }
    };

    if (loading) return <Loading />;
    if (openFormResponsable)
        return (
            <FormResponsable
                onClose={() => {
                    setOpenFormResponsable(false);
                }}
            />
        );
    if (!olimpiada) return <NotFoundPage />;
    console.log(olimpiada);
    if (!olimpiada.fase?.fase.nombre_fase.includes("inscripción")) {
        return <OlimpiadaNoEnCurso olimpiada={olimpiada} />;
    }
    return (
        <div className="flex flex-col min-h-screen">
            <div className="p-2">
                <ReturnComponent to="/" />
            </div>

            <h1 className="text-3xl font-bold text-center">
                Bienvenido a la Olimpiada {olimpiada?.nombre}
            </h1>
            <p className="text-center">
                Selecciona alguna de las opciones que realizara en la olimpiada
            </p>
            <div className="w-full p-4 md:w-3/5 mx-auto my-auto gap-3 flex flex-col">
                <ButtonsGrid buttons={buttons}>
                    <InscribirPostulante olimpiada={olimpiada}/>
                    <InscribirExcel olimpiada={olimpiada} onSubmit={() => fetchData()} />
                </ButtonsGrid>
            </div>
            <ShareUrl />
            <Footer />
        </div>
    );
};

export default Page;

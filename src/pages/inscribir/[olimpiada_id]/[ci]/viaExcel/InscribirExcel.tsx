import Loading from "@/components/Loading";
import { Suspense, useEffect, useState } from "react";
import FileUploadModal from "./file-upload-modal";
import { useParams } from "react-router-dom";
import type { Olimpiada } from "@/types/versiones.type";
import { getOlimpiada } from "@/api/olimpiada";

const IncribirExcel = ({ onSubmit }: { onSubmit?: () => void }) => {
    const [olimpiada, setOlimpiada] = useState<Olimpiada>();
    const { olimpiada_id } = useParams();

    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            if (!olimpiada_id) {
                throw new Error("No se proporciono un id de olimpiada");
            }
            const olimpiada = await getOlimpiada(olimpiada_id);
            setOlimpiada(olimpiada);
            console.log(olimpiada);
        } catch (e) {
            //recordatoro falta mejorar esta wea
            console.log(e);
        }
    };
    if (!olimpiada) return;
    return (
        <Suspense fallback={<Loading />}>
            <FileUploadModal
                maxFiles={1}
                maxSize={10}
                accept=".xlsx,.xls"
                onFilesChange={(files) => console.log("Files changed:", files)}
                triggerText="Inscribir por Excel"
                title="Añadir archivo Excel"
                description="Selecciona un archivo de Excel de tu dispositivo o arrástralo y suéltalo aquí."
                olimpiada={olimpiada}
                onSubmit={onSubmit}
            />
        </Suspense>
    );
};

export default IncribirExcel;

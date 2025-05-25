import Loading from "@/components/Loading";
import { Suspense } from "react";

import FileUploadModal from "@/pages/inscribir/[olimpiada_id]/[ci]/viaExcel/file-upload-modal";
import type { Olimpiada } from "@/types/versiones.type";

export const IncribirExcel = ({
    onSubmit,
    olimpiada,
}: {
    onSubmit?: () => void;
    olimpiada: Olimpiada;
}) => {
    return (
        <Suspense fallback={<Loading />}>
            <FileUploadModal
                maxFiles={1}
                maxSize={10}
                accept=".xlsx"
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

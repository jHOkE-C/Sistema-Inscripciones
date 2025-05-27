"use client";

import VersionesPage from "@/pages/admin/VersionesPage";
import { Version } from "@/types/versiones.type";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminReportesPage = () => {
    const renderVersionContainer = (version: Version) => (
        <div className="flex justify-end">
            <Link to={`/admin/reportes/${version.id}`}>
                <Button>Ver información</Button>
            </Link>
        </div>
    );

    return (
        <VersionesPage
            title={"Seleccione una olimpiada para Generar el Reporte deseado"}
            queVersiones={['pasadas',
                'Primera inscripción', 
                'Segunda inscripción', 
                'Tercera inscripción', 
                'Cuarta inscripción',
                "Primera clasificación",
                "Segunda clasificación",
                "Tercera clasificación",
                "Final",
                "Segunda Final",
                "Premiación",
                "Segunda premiación",
            ]}
            container={renderVersionContainer}
        />
    );
};

export default AdminReportesPage;

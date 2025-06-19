"use client";

import VersionesPage from "@/views/admin/VersionesPage";
const AdminReportesPage = () => {

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
            textoBoton="Ver Reporte"
        />
    );
};

export default AdminReportesPage; 
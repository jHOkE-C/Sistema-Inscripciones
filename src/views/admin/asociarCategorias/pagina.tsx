"use client";

import VersionesPage from "@/views/admin/VersionesPage";
import { Olimpiada } from "@/models/interfaces/versiones.type";

const Admin = () => {
    return (
        <VersionesPage
            filter={({ fase }: Olimpiada) =>
                fase && fase?.fase?.nombre_fase === "Preparación"
            }
            title="Seleccione una olimpiada para asociar Categorías"
        />
    );
};

export default Admin; 
"use client";

import VersionesPage from "@/pages/admin/VersionesPage";
import { Version } from "@/models/interfaces/versiones.type";
const Admin = () => {
    return (
        <VersionesPage
            filter={({ fase }: Version) =>
                fase && fase?.fase?.nombre_fase === "Preparación"
            }
            title="Seleccione una olimpiada para asociar Areas"
        />
    );
};

export default Admin;

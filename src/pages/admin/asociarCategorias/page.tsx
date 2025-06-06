"use client";

import VersionesPage from "@/pages/admin/VersionesPage";
import { Version } from "@/models/types/versiones.type";

const Admin = () => {
  return (
    <div>
      <VersionesPage
        filter={({ fase }: Version) => fase && fase?.fase?.nombre_fase === "Preparación"}
        title="Seleccione una olimpiada para asociar Categorias a Areas"
      />
    </div>
  );
};

export default Admin;

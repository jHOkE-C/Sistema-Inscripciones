import type { Postulante } from "@/models/interfaces/consultar-estado.types";

interface PostulanteData {
  postulante: Postulante;
}

interface Data {
  data: PostulanteData;
}

// Mapeo de códigos de departamento a nombres completos
const departamentos: Record<string, string> = {
  LP: "La Paz",
  CB: "Cochabamba",
  SC: "Santa Cruz",
  OR: "Oruro",
  PT: "Potosí",
  TJ: "Tarija",
  TJA: "Tarija",
  CH: "Chuquisaca",
  BN: "Beni",
  PD: "Pando",
};

export function usePostulanteCardViewModel({ data }: Data) {
  const { postulante } = data;

  // Obtener el nombre completo del departamento o usar el código si no está en el mapeo
  const nombreDepartamento =
    departamentos[postulante.departamento] || postulante.departamento;

  return {
    postulante,
    nombreDepartamento,
  };
} 
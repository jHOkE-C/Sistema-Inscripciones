import { request } from "./request";
import type {
  UploadResponse,
  Postulante,
} from "@/models/interfaces/postulantes";
//creo que sera mejor usar axios pa este
export async function postBulkInscripciones(
  ci: string,
  nombreLista: string,
  olimpiadaId: number,
  listaPostulantes: Postulante[]
): Promise<UploadResponse> {
  const payload = {
    ci,
    nombre_lista: nombreLista,
    olimpiada_id: olimpiadaId,
    listaPostulantes,
  };
  return await request<UploadResponse>(`/api/inscripciones/bulk`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

export async function uploadExcelOlimpiada(
  olimpiadaId: number,
  fileName: string,
  fileContentBase64: string
): Promise<UploadResponse> {
  const payload = { olimpiadaId, fileName, fileContentBase64 };
  return await request<UploadResponse>(`/api/olimpiadas/upload-excel`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
}

import { useParams } from "react-router-dom";

export const useDecodeParams = () => {
    const encodedParams: Record<string, string | undefined> = useParams();
    const decoded: Record<string, string> = {};

    Object.keys(encodedParams).forEach((key) => {
        try {
            decoded[key] = atob(encodedParams[key] || ""); 
        } catch (e) {
            console.error(`Error al decodificar ${key}:`, e);
        }
    });

    console.log("encoded", encodedParams);
    console.log("decoded", decoded);

    return decoded;
};

import { OlympicsData } from "@/views/admin/estatus";

interface StatusProps {
    data: OlympicsData;
}

export function useStatusViewModel({ data }: StatusProps) {
    const isActive = !data.message;

    return {
        isActive
    };
} 
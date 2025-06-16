import { useAuth } from "@/viewModels/hooks/auth";

export function useUserPanelViewModel() {
    const { user } = useAuth();

    return {
        user
    };
} 
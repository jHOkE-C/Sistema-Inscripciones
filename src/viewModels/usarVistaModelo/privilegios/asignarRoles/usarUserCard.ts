import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import { type Role } from '@/models/interfaces/role.interface';
import { type UserData } from '@/models/interfaces/user.interface';

export const useUsarUserCard = (user: UserData, availableRoles: Role[]) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

    const hasRoles = user.roles.length > 0;
    const assignedRoleIds = user.roles.map((role: Role) => role.id);
    const unassignedRoles = availableRoles.filter(
        (role) => !assignedRoleIds.includes(role.id)
    );

    const handleOpenDialog = () => {
        setSelectedRoleIds([]);
        setIsDialogOpen(true);
    };

    const handleRoleCheckboxChange = (roleId: number) => {
        setSelectedRoleIds((prev) => {
            if (prev.includes(roleId)) {
                return prev.filter((id) => id !== roleId);
            } else {
                return [...prev, roleId];
            }
        });
    };

    const handleSaveRoles = async () => {
        const rolesAssinados = {
            usuario_id: user.id,
            roles_add: selectedRoleIds,
            roles_remove: []
        };

        try {
            await axios.put(`${API_URL}/api/roles/usuario`, rolesAssinados);
            toast.success(
                `Se han asignado ${selectedRoleIds.length} roles a ${user.nombre_usuario}`
            );
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving roles:", error);
            toast.error("Error al guardar los roles");
        }
    };

    return {
        isDialogOpen,
        setIsDialogOpen,
        selectedRoleIds,
        hasRoles,
        unassignedRoles,
        handleOpenDialog,
        handleRoleCheckboxChange,
        handleSaveRoles
    };
}; 
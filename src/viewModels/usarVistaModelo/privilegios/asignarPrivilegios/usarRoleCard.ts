import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import { type Privilege, type Role } from '@/models/interfaces/role.interface';

export const useUsarRoleCard = (role: Role, availablePrivileges: Privilege[], refresh: () => void) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPrivilegeIds, setSelectedPrivilegeIds] = useState<number[]>([]);

    const hasPrivileges = role.servicios.length > 0;
    const assignedPrivilegeIds = role.servicios.map((privilege: Privilege) => privilege.id);
    const unassignedPrivileges = availablePrivileges.filter(
        (privilege) => !assignedPrivilegeIds.includes(privilege.id)
    );

    const handleOpenDialog = () => {
        setSelectedPrivilegeIds([]);
        setIsDialogOpen(true);
    };

    const handlePrivilegeCheckboxChange = (privilegeId: number) => {
        setSelectedPrivilegeIds((prev) => {
            if (prev.includes(privilegeId)) {
                return prev.filter((id) => id !== privilegeId);
            } else {
                return [...prev, privilegeId];
            }
        });
    };

    const handleSavePrivileges = async () => {
        const privilegesAssigned = {
            rol_id: role.id,
            servicios_add: selectedPrivilegeIds,
            servicios_remove: [],
        };

        try {
            await axios.put(`${API_URL}/api/roles/servicios`, privilegesAssigned);
            toast.success(
                `Se han asignado ${selectedPrivilegeIds.length} privilegios al rol ${role.nombre}`
            );
            refresh();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error saving privileges:", error);
            toast.error("Error al guardar los privilegios");
        }
    };

    return {
        isDialogOpen,
        setIsDialogOpen,
        selectedPrivilegeIds,
        hasPrivileges,
        unassignedPrivileges,
        handleOpenDialog,
        handlePrivilegeCheckboxChange,
        handleSavePrivileges
    };
}; 
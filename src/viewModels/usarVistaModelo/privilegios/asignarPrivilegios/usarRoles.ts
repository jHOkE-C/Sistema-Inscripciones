import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import { type Privilege, type Role } from "@/models/interfaces/roles";

export const useUsarRoles = () => {
  const [rolesData, setRoles] = useState<Role[]>([]);
  const [availablePrivileges, setAvailablePrivileges] = useState<Privilege[]>(
    []
  );

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/roles/`);
      setRoles(res.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error al cargar los roles");
    }
  };

  const fetchAvailablePrivileges = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/servicios/`);
      setAvailablePrivileges(res.data);
    } catch (error) {
      console.error("Error fetching privileges:", error);
      toast.error("Error al cargar los privilegios");
    }
  };

  useEffect(() => {
    fetchAvailablePrivileges();
    fetchRoles();
  }, []);

  return {
    rolesData,
    availablePrivileges,
    fetchRoles,
  };
};

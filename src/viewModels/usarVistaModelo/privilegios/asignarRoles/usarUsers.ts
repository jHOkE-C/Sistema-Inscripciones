import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/viewModels/hooks/useApiRequest";
import { toast } from "sonner";
import { type Role } from "@/models/interfaces/roles";
import { type UserData } from "@/models/interfaces/usuarios";

export const useUsarUsers = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  const fetchAvailableRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/roles/`);
      setAvailableRoles(res.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error al cargar los roles");
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/usuarios/`);
      setUserData(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error al cargar los datos de los usuarios");
    }
  };

  useEffect(() => {
    fetchAvailableRoles();
    fetchUserData();
  }, []);

  return {
    userData,
    availableRoles,
  };
};

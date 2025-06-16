import { useAuth } from "@/viewModels/hooks/auth";

export function useBotonesViewModel() {
  const { user } = useAuth();
  const accesos = user?.accesos;

  function hasAccess(rol: string) {
    if (accesos) {
      return accesos.some((acceso: string) => acceso === rol);
    }
    return false;
  }

  return {
    hasAccess
  };
} 
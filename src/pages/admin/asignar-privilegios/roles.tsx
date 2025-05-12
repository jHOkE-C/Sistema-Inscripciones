"use client";

import { useEffect, useState } from "react";
import { Check, PlusCircle, Shield, ShieldOff, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";

interface Privilege {
  id: number;
  nombre: string;
}

interface Role {
  id: number;
  nombre: string;
  servicios: Privilege[];
}


export default function RolesPage() {
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
  }

  useEffect(() => {
    fetchAvailablePrivileges()
    fetchRoles();
  }, []);

  return (
    <div className="grid gap-6">
      {rolesData.map((role) => (
        <RoleCard
          key={role.id}
          role={role}
          availablePrivileges={availablePrivileges}
          refresh={fetchRoles}
        />
      ))}
    </div>
  );
}

function RoleCard({
  role,
  availablePrivileges,
  refresh,
}: {
  role: Role;
  availablePrivileges: Privilege[];
  refresh: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPrivilegeIds, setSelectedPrivilegeIds] = useState<number[]>(
    []
  );

  const hasPrivileges = role.servicios.length > 0;

  // Get IDs of privileges already assigned to the role
  const assignedPrivilegeIds = role.servicios.map((privilege) => privilege.id);

  // Filter available privileges to exclude already assigned privileges
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
    // In a real app, you would make an API call here to save the privilege assignments
    console.log(
      `Assigning privileges with IDs ${selectedPrivilegeIds} to role ${role.nombre}`
    );

    const privilegesAssigned = {
      rol_id: role.id,
      servicios: selectedPrivilegeIds,
    }

    try {
      await axios.post(`${API_URL}/api/roles/servicios`, privilegesAssigned);
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

  return (
    <>
      <Card className="gap-0 py-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{role.nombre}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={hasPrivileges ? "default" : "destructive"}>
                {hasPrivileges
                  ? `${role.servicios.length} privilegios`
                  : "Sin privilegios"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenDialog}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Asignar privilegio</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {hasPrivileges ? (
            <div className="mt-2">
              <h3 className="text-sm font-medium mb-2">
                Privilegios Asignados:
              </h3>
              <div className="flex flex-wrap gap-2">
                {role.servicios.map((privilege) => (
                  <Badge
                    key={privilege.id}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {privilege.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-start p-2 text-sm text-muted-foreground">
              <ShieldOff className="h-4 w-4 mr-2" />
              <span>Este rol no tiene privilegios asignados</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar privilegios a {role.nombre}</DialogTitle>
            <DialogDescription>
              Selecciona los privilegios que deseas asignar al rol.
            </DialogDescription>
          </DialogHeader>

          {unassignedPrivileges.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No hay privilegios disponibles para asignar a este rol.
            </div>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                {unassignedPrivileges.map((privilege) => (
                  <div
                    key={privilege.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`privilege-${privilege.id}`}
                      checked={selectedPrivilegeIds.includes(privilege.id)}
                      onCheckedChange={() =>
                        handlePrivilegeCheckboxChange(privilege.id)
                      }
                    />
                    <label
                      htmlFor={`privilege-${privilege.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {privilege.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="gap-2"
            >
              <X size={16} />
              <span>Cancelar</span>
            </Button>
            <Button
              type="button"
              onClick={handleSavePrivileges}
              disabled={
                selectedPrivilegeIds.length === 0 ||
                unassignedPrivileges.length === 0
              }
              className="gap-2"
            >
              <Check size={16} />
              <span>Guardar</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

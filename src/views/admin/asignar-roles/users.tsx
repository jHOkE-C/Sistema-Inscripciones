"use client";

import { useEffect, useState } from "react";
import { Check, PlusCircle, User, UserX, X } from "lucide-react";
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
import { API_URL } from "@/viewModels/hooks/useApiRequest";

import { type Role } from '@/models/interfaces/role.interface';

import { type UserData } from '@/models/interfaces/user.interface';

export default function UsersPage() {
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
  },[]);



  return (
    <div className="grid gap-6">
      {userData.map((user) => (
        <UserCard key={user.id} user={user} availableRoles={availableRoles} />
      ))}
    </div>
  );
}

function UserCard({
  user,
  availableRoles,
}: {
  user: UserData;
  availableRoles: Role[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const hasRoles = user.roles.length > 0;

  // Get IDs of roles already assigned to the user
  const assignedRoleIds = user.roles.map((role: Role) => role.id);

  // Filter available roles to exclude already assigned roles
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
    console.log(rolesAssinados);
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

  return (
    <>
      <Card className="gap-0 py-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{user.nombre_usuario}</CardTitle>
            </div>
            <div className="items-center gap-2 grid sm:flex justify-center">
              <Badge variant={hasRoles ? "default" : "destructive"}>
                {hasRoles ? `${user.roles.length} roles` : "Sin roles"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenDialog}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Asignar roles</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {hasRoles ? (
            <div className="mt-2">
              <h3 className="text-sm font-medium mb-2">Roles Asignados:</h3>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role: Role) => (
                  <Badge
                    key={role.id}
                    variant="secondary"
                    className="px-3 py-1 text-sm"
                  >
                    {role.nombre}
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-start p-2 text-sm text-muted-foreground">
              <UserX className="h-4 w-4 mr-2" />
              <span>Este usuario no tiene roles asignados</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar roles a {user.nombre_usuario}</DialogTitle>
            <DialogDescription>
              Selecciona los roles que deseas asignar al usuario.
            </DialogDescription>
          </DialogHeader>

          {unassignedRoles.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No hay roles disponibles para asignar a este usuario.
            </div>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4 py-4">
                {unassignedRoles
                  .filter((role: Role) => role.servicios.length > 0)
                  .map((role: Role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={!!selectedRoleIds.includes(role.id)}
                        onCheckedChange={() => handleRoleCheckboxChange(role.id)}
                      />
                      <label
                        htmlFor={`role-${role.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {role.nombre}
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
              onClick={handleSaveRoles}
              disabled={
                selectedRoleIds.length === 0 || unassignedRoles.length === 0
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

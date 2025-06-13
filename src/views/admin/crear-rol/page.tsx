"use client";

import { ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCrearRolViewModel } from "@/viewModels/admin/useCrearRolViewModel";

export default function CrearRol() {
  const {
    open,
    setOpen,
    roleName,
    error,
    handleSubmit,
    handleRoleNameChange,
    handleClose
  } = useCrearRolViewModel();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-auto py-10 bg-indigo-500 hover:bg-indigo-700 text-white flex flex-col items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg  lg:col-span-1 text-lg relative w-full">
          <ShieldPlus className="size-8 mb-1" />
          Crear Rol
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>
              Ingresa un nombre para el nuevo rol.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="role-name"
                className="flex items-center justify-between"
              />
              Nombre del Rol
              <span
                className={`text-xs ${
                  roleName.length > 30
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {roleName.length}/30
              </span>
              <Input
                id="role-name"
                value={roleName}
                onChange={(e) => handleRoleNameChange(e.target.value)}
                placeholder="Ingresa el nombre del rol"
                className={error ? "border-destructive" : ""}
                maxLength={30}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="gap-2"
            >
              <span>Cancelar</span>
            </Button>
            <Button type="submit" className="gap-2">
              <span>Crear Rol</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

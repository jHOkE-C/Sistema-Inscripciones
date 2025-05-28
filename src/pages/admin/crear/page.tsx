"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CreateUserForm } from "./create-user-form";
import { UserPlus } from "lucide-react";
import ReturnComponent from "@/components/ReturnComponent";

const CrearPage = () => {
  return (
    <>
    <Header />
      <ReturnComponent/>
    <div className="min-h-screen flex flex-col justify-center items-center">
      
      <div className="text-center flex flex-col gap-4 p-10 lg:p-12">
        <div className="flex items-center gap-2  text-2xl md:text-3xl text-center justify-center">
          <UserPlus className="h-8 w-8" />
          <p>Crear Nuevo Usuario</p>
        </div>
        <div className="text-center text-sm text-neutral-500">
          Completa el formulario para crear un nuevo usuario en el sistema
        </div>
        <CreateUserForm />
      </div>
      <Footer />
    </div>
    </>
  );
};

export default CrearPage;

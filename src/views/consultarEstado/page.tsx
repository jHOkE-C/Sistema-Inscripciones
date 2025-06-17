"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ConsultaInscripcion } from "./consultarInscripcion";

const ConsultarEstadoPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header />
        <main className="flex flex-col items-center justify-center p-6 w-full">
          <ConsultaInscripcion />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ConsultarEstadoPage;

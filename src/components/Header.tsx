"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import type { ruta } from "@/types/ruta";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/auth";

interface navigation {
  rutas?: ruta[];
}



const Header = ({ rutas = [] }: navigation) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { user, logOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between w-full px-4 md:px-10">
        <div className="flex items-center gap-1">
          <Link to="/admin">
            <img
              src="/logo-sansimon.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
          </Link>
          <Link to={"/"} className="flex items-center gap-1">
            <div className="flex flex-col justify-center text-center">
              <span className="text-xl font-medium">UNIVERSIDAD</span>
              <span className="text-xs">MAYOR DE SAN SIMON</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-sm font-medium hover:underline">
            Inicio
          </Link>
          {rutas.map((ruta, index) => (
            <Link
              key={index}
              to={ruta.url}
              className="text-sm font-medium hover:underline"
            >
              {ruta.nombre}
            </Link>
          ))}
          {user && <button onClick={logOut} className="text-sm font-medium hover:underline">Cerrar Sesión</button>}
          <ModeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <div
            className={`transition-transform duration-300 transform ${
              isMenuOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`absolute top-16 left-0 right-0 z-50 md:hidden transform ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="px-4 py-3 space-y-3 bg-background border-b shadow-lg rounded-xl border-1 m-3">
          <Link
            to="/"
            className="block py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          {rutas.map((ruta, index) => (
            <Link
              key={index}
              to={ruta.url}
              className="block py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-3 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {ruta.nombre}
            </Link>
          ))}
          <div className="pb-1 flex justify-end">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

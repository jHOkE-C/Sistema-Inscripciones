import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { ruta } from "@/types/ruta";

interface navigation {
  rutas?: ruta[];
}


const Header = ({ rutas = [] }: navigation) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between w-full px-4 md:px-10">
        <div className="flex items-center gap-1">
          <Link to="/admin">
            <img
              src="/logo-sansimon.png"
              alt="Logo"
              className="h-10 w-10  object-contain"
            />
          </Link>
          <Link to={"/"} className="flex items-center gap-1">
            <div className="flex flex-col justify-center text-center">
              <span className="text-xl font-medium"> UNIVERSIDAD</span>
              <span className="text-xs"> MAYOR DE SAN SIMON</span>
            </div>
          </Link>
        </div>
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
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;

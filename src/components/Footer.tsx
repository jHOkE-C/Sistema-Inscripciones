"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t py-6 md:py-0 mt-auto">
      <div className="px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <p className="text-sm text-gray-500 flex gap-1">
          © 2025 Olimpiadas OhSanSi. <span className='hidden sm:block'>Todos los derechos reservados.</span>
        </p>

        <div className="flex gap-4">
          <Link
            to="/terminos"
            className="text-sm text-gray-500 hover:underline"
          >
            Términos
          </Link>
          <Link
            to="/privacidad"
            className="text-sm text-gray-500 hover:underline"
          >
            Privacidad
          </Link>
          <Link
            to="/contacto"
            className="text-sm text-gray-500 hover:underline"
          >
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
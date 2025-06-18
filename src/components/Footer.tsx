"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Music2} from 'lucide-react'; // Assuming 'Tiktok' icon exists or using a generic icon

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t py-5 md:py-0 mt-auto ">
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
          <a
            href="https://www.facebook.com/UmssBolOficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a
            href="https://www.instagram.com/UMSSBolOficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-600"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@UMSSDigital"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-foreground"
            aria-label="TikTok"
          >
            <Music2 size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';
import RolesPage from './roles';

const AsignarPrivilegios: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Header />
      <main className="flex-grow flex-col justify-center p-6 w-full max-w-5xl">
        <div className="text-3xl font-bold pb-6">
          Panel de Administración de Privilegios
        </div>
        <RolesPage />
      </main>
      <Footer />
    </div>
  );
};

export default AsignarPrivilegios;
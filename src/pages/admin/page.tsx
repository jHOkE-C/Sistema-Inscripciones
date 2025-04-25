import Botones from "./botones";
import Footer from "@/components/Footer";

export type Version = {
    id: number;
    nombre: string;
    gestion: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    updated_at: string;
};

const Admin = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full p-4 md:w-4/5 mx-auto">
                <h1 className="text-4xl font-bold text-center py-4">
                    Panel de Administración
                </h1>
                <Botones />
            </div>
            <Footer />
        </div>
    );
};

export default Admin;

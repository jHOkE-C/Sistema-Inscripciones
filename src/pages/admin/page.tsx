import { ModeToggle } from "@/components/mode-toggle";
import Botones from "./botones";
import Footer from "@/components/Footer";

const Admin = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="w-full p-4 md:w-4/5 mx-auto">
            <div className="flex justify-end">
                <ModeToggle/>
                </div>
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

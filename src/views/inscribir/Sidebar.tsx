import { Button } from "@/components/ui/button";
import { Home,Users } from "lucide-react";

import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside className="hidden w-64 flex-col border-r bg-gray-50 md:flex">
            <div className="flex flex-col gap-2 p-4">
                <img
                    alt="Olimpiadas ohSansi"
                    className="h-44 object-cover"
                    src="/logo.png"
                />

                <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/">
                        <Home className="mr-2 h-4 w-4" />
                        Inicio
                    </Link>
                </Button>
                <Button
                    variant="ghost"
                    className="justify-start bg-blue-50 text-blue-700"
                    asChild
                >
                    <Link to="/inscribir">
                        <Users className="mr-2 h-4 w-4" />
                        Mis Postulantes
                    </Link>
                </Button>
            </div>
        </aside>
    );
};

export default Sidebar;

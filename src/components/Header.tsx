
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { ChevronDown, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
    title?: string;
}

const Header = ({ title = "Olimpiadas" }: HeaderProps) => {
    return (
        
            <header className="sticky top-0 z-50 max-w-screen border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                <div className=" flex h-16 items-center justify-between">
                    <Link to={"/"} className="flex items-center gap-1">
                        <span className="text-xl text-blue-700 font-bold">
                            {" "}
                            {title}
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2"
                                >
                                    
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Mi Perfil</span>
                                </DropdownMenuItem>
                                <Link to={"/configuracion"}>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Configuración</span>
                                    </DropdownMenuItem>
                                </Link>
                                <Separator />
                                
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
    );
};

export default Header;

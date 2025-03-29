import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
    return (
        <>
            <div className="w-4/5 mx-auto ">
                <h1 className="text-4xl font-bold text-center py-5">
                    Administración de Sistema Oh!Sansi
                </h1>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center gap-x-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ">
                            <Settings className="h-5 w-5 text-primary" />
                        </div>
                        Gestion de Olimpiada
                        </CardTitle>
                        <CardDescription>
                            Configura la gestion de olimpiadas Oh!Sansi
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        
                        <p className="text-sm text-muted-foreground">
                            Registra a un estudiante para participar en las
                            olimpiadas con todos sus datos personales.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to="/admin/olimpiada/registrar" className="w-full">
                            <Button className="w-full">
                                Registrar Gestion de Olimpiada
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default Admin;

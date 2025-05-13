import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the type for the applicant data
interface Postulante {
  nombres: string;
  apellidos: string;
  ci: string;
  departamento: string;
  olimpiada: string;
  niveles_competencia: string[];
  estado: string;
}

interface PostulanteCardProps {
  postulante: Postulante;
}

export default function PostulanteCard({ postulante }: PostulanteCardProps) {
  // Default data if none is provided
  

  // Use provided data or default
  const data = postulante ;

  // Determine badge color based on estado
  const getBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "preinscrito":
        return "secondary";
      case "inscrito":
        return "default";
      case "pendiente":
        return "outline";
      case "rechazado":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">
            {data.nombres} {data.apellidos}
          </CardTitle>
          <Badge variant={getBadgeVariant(data.estado)}>{data.estado}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">CI</p>
              <p className="font-medium">{data.ci}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departamento</p>
              <p className="font-medium">{data.departamento}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Olimpiada</p>
            <p className="font-medium">{data.olimpiada}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Niveles de Competencia
            </p>
            <div className="space-y-2">
              {data.niveles_competencia.map((nivel, index) => (
                <div
                  key={index}
                  className="bg-slate-100 p-2 rounded-md text-sm"
                >
                  {nivel}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

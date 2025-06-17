import { Button } from "@/components/ui/button"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, FileText, X, CreditCard } from "lucide-react"
import { usePostulanteDetalleViewModel, type Postulante } from "@/viewModels/usarVistaModelo/inscribir/usePostulanteDetalleViewModel"

export default function PostulanteDetalle({ postulante, onClose }: { postulante: Postulante; onClose: () => void }) {
  const { getStatusBadge, handlePagoInscripcion } = usePostulanteDetalleViewModel({
    postulante,
    onClose,
  })

  const statusBadge = getStatusBadge(postulante.estado)

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detalles del Postulante</DialogTitle>
      </DialogHeader>

      <div className="py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{postulante.nombre}</h3>
          <Badge variant={statusBadge.variant} className={statusBadge.className}>
            {statusBadge.children}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Nacimiento</h4>
            <p>{postulante.fechaNacimiento}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha de Registro</h4>
            <p>{postulante.fechaRegistro}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Categoría</h4>
            <p>{postulante.categoria}</p>
          </div>    
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Área</h4>
            <p>{postulante.area}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <h4 className="font-medium mb-2">Información de Contacto</h4>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Correo Electrónico</h4>
            <p>{postulante.email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Teléfono</h4>
            <p>{postulante.telefono}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <h4 className="font-medium mb-2">Documentos Presentados</h4>
        <div className="space-y-2 mb-6">
          {postulante.documentos.map((doc: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>{doc}</span>
            </div>
          ))}
        </div>

        {postulante.estado === "Pendiente" && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <Button
                variant="outline"
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Rechazar
              </Button>
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4" />
                Aprobar
              </Button>
            </div>
          </>
        )}

        {postulante.estado === "Pendiente de Pago" && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-end">
              <Button
                className="gap-2 bg-green-600 hover:bg-green-700"
                onClick={handlePagoInscripcion}
              >
                <CreditCard className="h-4 w-4" />
                Pagar Inscripción
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </>
  )
}


export interface Postulante {
  nombre: string;
  estado: "Aprobado" | "Pendiente" | "Rechazado" | "Pendiente de Pago" | string;
  fechaNacimiento: string;
  fechaRegistro: string;
  categoria: string;
  area: string;
  email: string;
  telefono: string;
  documentos: string[];
}

interface PostulanteDetalleProps {
  postulante: Postulante;
  onClose: () => void;
}

type StatusBadgeType = {
  variant: "default" | "destructive" | "outline" | "secondary";
  className: string;
  children: string;
};

export function usePostulanteDetalleViewModel({ postulante, onClose }: PostulanteDetalleProps) {
  const getStatusBadge = (estado: Postulante["estado"]): StatusBadgeType => {
    switch (estado) {
      case "Aprobado":
        return {
          variant: "default",
          className: "bg-green-500",
          children: "Aprobado",
        };
      case "Pendiente":
        return {
          variant: "default",
          className: "bg-yellow-500",
          children: "Pendiente",
        };
      case "Rechazado":
        return {
          variant: "default",
          className: "bg-red-500",
          children: "Rechazado",
        };
      case "Pendiente de Pago":
        return {
          variant: "default",
          className: "bg-orange-500",
          children: "Pendiente de Pago",
        };
      default:
        return {
          variant: "default",
          className: "bg-gray-500",
          children: estado,
        };
    }
  };

  const handlePagoInscripcion = (): void => {
    // Aquí iría la lógica para procesar el pago
    console.log(`Procesando pago para ${postulante.nombre}`);
    // Por ahora, solo mostraremos una alerta
    alert(`Pago de inscripción procesado para ${postulante.nombre}`);
  };

  return {
    getStatusBadge,
    handlePagoInscripcion,
    onClose,
  };
} 
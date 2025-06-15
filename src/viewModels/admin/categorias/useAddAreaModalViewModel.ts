import { useState } from "react";

interface AddAreaModalProps {
  onClose: () => void;
  onAddArea: (areaId: number) => void;
}

export function useAddAreaModalViewModel({
  onClose,
  onAddArea,
}: AddAreaModalProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (selectedAreaId === null) {
      setError("Debe seleccionar un área");
      return;
    }

    onAddArea(selectedAreaId);
    setSelectedAreaId(null);
    setError("");
  };

  const handleClose = () => {
    setSelectedAreaId(null);
    setError("");
    onClose();
  };

  return {
    selectedAreaId,
    setSelectedAreaId,
    error,
    handleSubmit,
    handleClose,
  };
} 
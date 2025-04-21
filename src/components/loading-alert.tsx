import React from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoadingAlertProps {
  message?: string;
}

export const LoadingAlert: React.FC<LoadingAlertProps> = ({
  message = "Espere por favor, estamos procesando el archivo..."//tal vez pasar el tama;o mas?
}) => {
  return (
    <Alert>
      <AlertDescription className="flex items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <p className="text-sm text-blue-500">
          {message}
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default LoadingAlert; 
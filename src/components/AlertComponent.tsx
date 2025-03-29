import { AlertTriangle, CheckCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
    className?: string;
    title?: string;
    description?: string;
    variant?: "default" | "destructive" | null | undefined;
}
export function AlertComponent(props: Props) {
    return (
        <Alert variant={props.variant}>
            {props.variant === "destructive" ? (
                <AlertTriangle className="h-4 w-4" />
            ) : (
                <CheckCircle className="h-4 w-4" />
            )}
            <AlertTitle>{props.title}</AlertTitle>
            <AlertDescription>{props.description}</AlertDescription>
        </Alert>
    );
}
export default Alert;

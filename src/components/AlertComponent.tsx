import { useEffect } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface Props {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
    onClose?: () => void;
}

export function AlertComponent({
    title,
    description,
    variant = "default",
    onClose,
}: Props) {
    useEffect(() => {
        const timeout = setTimeout(() => {
            onClose?.();
        }, 30000);
        return () => clearTimeout(timeout);
    }, [onClose]);

    return (
        <div
            className={cn(
                "fixed top-5 right-5 z-[51] transition-transform duration-300",
                "bg-white shadow-md p-4 border-1 rounded-lg flex items-start gap-2",
                variant === "destructive"
                    ? "border-red-500 text-red-700"
                    : "border-green-500 text-green-700"
            )}
        >
            <div className="flex items-center gap-2">
                {variant === "destructive" ? (
                    <AlertTriangle className="h-7 w-7 text-red-500" />
                ) : (
                    <CheckCircle className="h-7 w-7 mr-2 text-green-500" />
                )}
                <div>
                    <AlertTitle>{title}</AlertTitle>
                    <AlertDescription>{description}</AlertDescription>
                </div>
            </div>
            <button
                onClick={onClose}
                className="ml-auto text-gray-500 hover:text-gray-700"
            >
                <X className="h-5 w-5" />
            </button>
        </div>
    );
}

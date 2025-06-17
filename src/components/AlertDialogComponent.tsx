import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alertDialog";
import { Button } from "@/components/ui/button";
import type { JSX } from "react";

interface props {
    textButton?: string;
    variantButton?:
        | "link"
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | null
        | undefined;
    title: string;
    description?: JSX.Element;
    cancelButtonText?: string;
    continueButtonText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    typeButton?: "button" | "submit" | "reset" | undefined;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    continueIsDanger?:boolean

}

export function AlertDialogComponent(props: props) {
    return (
        <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
            {props.textButton && (
                <AlertDialogTrigger asChild>
                    <Button
                        type={props.typeButton}
                        variant={props.variantButton}
                    >
                        {props.textButton}
                    </Button>
                </AlertDialogTrigger>
            )}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{props.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {props.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction className={props.continueIsDanger ?"bg-rose-600 hover:bg-rose-600/90":""} onClick={props.onConfirm}>
                        {props.continueButtonText || "Confirmar"}
                    </AlertDialogAction>
                    <AlertDialogCancel onClick={props.onCancel}>
                        {props.cancelButtonText || "Cancelar"}
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
export default AlertDialogComponent;

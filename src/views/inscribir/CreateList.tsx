import { AlertComponent } from "@/components/AlertComponent";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateListViewModel } from "@/viewModels/usarVistaModelo/inscribir/useCreateListViewModel";

interface CreateListProps {
    number?: number;
    refresh?: () => void;
}

export function CreateList({
    number = 1,
    refresh = () => {},
}: CreateListProps) {
    const {
        open,
        error,
        success,
        nombre,
        loading,
        handleSubmit,
        handleOpenChange,
        handleNombreChange,
        handleErrorClose,
        handleSuccessClose,
    } = useCreateListViewModel({
        number,
        refresh,
    });

    return (
        <>
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button variant="default" onClick={() => handleOpenChange(true)}>
                        Crear Lista
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Crear Lista</DialogTitle>
                            <DialogDescription></DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <Label
                                    htmlFor="name"
                                    className="text-nowrap text-right"
                                >
                                    Nombre de la lista
                                </Label>
                                <Input
                                    id="name"
                                    value={nombre}
                                    onChange={handleNombreChange}
                                    placeholder={`Lista ${number}`}
                                    className="w-full"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Creando..." : "Continuar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            {error && (
                <AlertComponent
                    title="Error"
                    description={error}
                    variant="destructive"
                    onClose={handleErrorClose}
                />
            )}
            {success && (
                <AlertComponent
                    title="Éxito"
                    description={success}
                    variant="default"
                    onClose={handleSuccessClose}
                />
            )}
        </>
    );
}

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, PlusCircle } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ReturnComponent from "@/components/ReturnComponent";
import CreateCategoryModal from "../create-category-modal";
import { useCrearPageViewModel } from "@/viewModels/usarVistaModelo/privilegios/categoria/crear/useCrearPageViewModel";

const Page = () => {
    const {
        categories,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleCreateCategory,
        getGradeLabel,
    } = useCrearPageViewModel();

    return (
        <>
            <ReturnComponent to={`..\\..\\`}/>

            <div className="container mx-auto max-w-6xl px-4 py-10">
                <Suspense fallback={<div>Cargando...</div>}></Suspense>
                <Card>
                    <CardContent>
                        <CardTitle>
                            <h2 className="text-2xl text-primary font-bold mb-2 flex items-center gap-3">
                                <PlusCircle/>
                                Agregar Categorías
                            </h2>
                            <p className="mb-4 text-gray-600">
                                Agregar categorías personalizadas para las
                                competiciones de las olimpiadas.
                            </p>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Agregar
                                    Categoría
                                </Button>
                            </div>
                        </CardTitle>
                        <Table className="mb-10 mx-auto">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Categoria</TableHead>
                                    <TableHead>Grado Mínimo</TableHead>
                                    <TableHead>Grado Máximo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">
                                            {category.nombre}
                                        </TableCell>
                                        <TableCell>
                                            {getGradeLabel(
                                                category.minimo_grado
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getGradeLabel(
                                                category.maximo_grado
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1"></div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateCategory={handleCreateCategory}
            />
        </>
    );
};

export default Page;

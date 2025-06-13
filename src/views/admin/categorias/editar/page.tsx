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
import { Edit, EditIcon } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import EditCategoryModal from "../edit-modal";
import ReturnComponent from "@/components/ReturnComponent";
import { useEditarPageViewModel } from "@/viewModels/admin/categorias/editar/useEditarPageViewModel";

const Page = () => {
    const {
        categories,
        isEditModalOpen,
        selectedCategory,
        handleEditCategory,
        getGradeLabel,
        openEditModal,
        closeEditModal,
    } = useEditarPageViewModel();

    return (
        <>
            <ReturnComponent to={`..\\..\\`}/>

            <div className="container mx-auto max-w-6xl px-4 py-10">
                <Suspense fallback={<div>Cargando...</div>}></Suspense>
                <Card>
                    <CardContent>
                        <CardTitle>
                            <h2 className="text-2xl font-bold mb-2 text-amber-600 flex gap-3 items-center">
                                <EditIcon /> Editar Categorías
                            </h2>
                            <p className="mb-4 text-gray-600">
                                Edita categorías para las competiciones de las
                                olimpiadas.
                            </p>
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
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-amber-600 text-white hover:bg-amber-600/90 hover:text-white"
                                                onClick={() =>
                                                    openEditModal(category)
                                                }
                                            >
                                                <Edit className="mr-1 h-3 w-3" />{" "}
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            {selectedCategory && (
                <EditCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    category={selectedCategory}
                    onEditCategory={(updates) =>
                        handleEditCategory(selectedCategory.id, updates)
                    }
                />
            )}
        </>
    );
};

export default Page;

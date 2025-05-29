import { Suspense } from "react";

import { useState, useEffect } from "react";
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

import type { Category } from "../types";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

import EditCategoryModal from "../edit-modal";
import ReturnComponent from "@/components/ReturnComponent";
const Page = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null
    );

    const fetchData = async () => {
        try {
            const categorias = await axios.get<Category[]>(
                `${API_URL}/api/categorias`
            );
            setCategories(categorias.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleEditCategory = async (
        categoria_id: number,
        updates: { minimo_grado: number; maximo_grado: number }
    ) => {
        try {
            await axios.put(
                `${API_URL}/api/categorias/${categoria_id}`,
                updates
            );
            fetchData();
            setIsEditModalOpen(false);
            setSelectedCategory(null);
            toast.success("Categoría editada correctamente.");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error);
            }
            console.error("Error editing category:", error);
        }
    };

    const getGradeLabel = (grade: number) => {
        if (grade <= 6) return `${grade}° Primaria`;
        return `${grade - 6}° Secundaria`;
    };
    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setIsEditModalOpen(true);
    };

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
                        <Table className="mb-10   mx-auto">
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
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedCategory(null);
                    }}
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

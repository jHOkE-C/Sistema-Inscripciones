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
import { Plus, PlusCircle } from "lucide-react";

import type { Category } from "../types";
import axios from "axios";
import { API_URL } from "@/hooks/useApiRequest";
import { toast } from "sonner";
import CreateCategoryModal from "../create-category-modal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import ReturnComponent from "@/components/ReturnComponent";

const Page = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

    const handleCreateCategory = async (
        newCategory: Omit<Category, "id" | "areas">
    ) => {
        try {
            await axios.post<Category>(
                `${API_URL}/api/categorias`,
                newCategory
            );
            console.log("Categoría creada correctamente:", newCategory);
            fetchData();
            toast.success("La categoría se registro correctamente.");
            setIsCreateModalOpen(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data.error);
            }
            console.error("Error creating category:", error);
        }
    };

    const getGradeLabel = (grade: number) => {
        if (grade <= 6) return `${grade}° Primaria`;
        return `${grade - 6}° Secundaria`;
    };

    return (
        <>
                        <ReturnComponent to={`..\\..\\`}/>

            <div className="container mx-auto max-w-6xl px-4 py-10">
                <Suspense fallback={<div>Cargando...</div>}></Suspense>
                <Card>
                    <CardContent>
                        <CardTitle>
                            <h1 className="text-2xl text-primary font-bold mb-2 flex items-center gap-3">
                                <PlusCircle/>
                                Agregar Categorías
                            </h1>
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

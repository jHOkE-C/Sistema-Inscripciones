import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scrollArea";
import { useParams } from "react-router-dom";
import OlimpiadaNoEnCurso from "@/components/OlimpiadaNoEnCurso";
import ReturnComponent from "@/components/ReturnComponent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Plus } from "lucide-react";
import { useAsociarCategoriasViewModel } from "@/viewModels/usarVistaModelo/privilegios/asociarCategorias/useAsociarCategoriasViewModel";

export default function Page() {
  const { olimpiada_id } = useParams();
  const {
    categories,
    selectedArea,
    checked,
    searchArea,
    searchCategory,
    dialogOpen,
    olimpiada,
    filteredAreas,
    selectedCount,
    setSearchArea,
    setSearchCategory,
    setDialogOpen,
    openDialog,
    toggleCategory,
    handleSave
  } = useAsociarCategoriasViewModel(olimpiada_id || "");

  if (!olimpiada_id) return null;

  if (
    olimpiada &&
    (olimpiada?.fase?.fase.nombre_fase !== "Preparación" || !olimpiada.fase)
  )
    return (
      <OlimpiadaNoEnCurso
        olimpiada={olimpiada}
        text={"La olimpiada no esta en Fase de Preparación"}
      />
    );

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <ReturnComponent to="/admin/asociarCategorias" />
      <div className="p-6 space-y-6 justify-center items-center  grid">
        <Card className="w-full overflow-x-auto">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle>Áreas</CardTitle>
              <Badge>{filteredAreas.length}</Badge>
            </div>
            <Input
              placeholder="Buscar área..."
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              className="max-w-xs"
            />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nombre de Área</TableHead>
                  <TableHead className="max-w-xl">Categorias Asociadas</TableHead>
                  <TableHead className="max-w-xl">Asociar Categorias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAreas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell>{area.nombre}</TableCell>
                    <TableCell className="flex flex-wrap w-xl gap-1">
                      {area.categorias?.map((cat) => (
                        <Badge key={cat.id} className=" rounded-xl" variant={"secondary"}>
                          {cat.nombre}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="w-full">
                      <div className="flex justify-center">
                        <Button size="sm" onClick={() => openDialog(area)}>
                          Asociar <Plus />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} >
                    Total: {filteredAreas.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Categorías para {selectedArea?.nombre} (
                <span className="font-semibold">{selectedCount}</span>)
              </DialogTitle>
            </DialogHeader>
            <div className="mb-4 flex items-center space-x-2">
              <Input
                placeholder="Buscar categoría..."
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="flex-1"
              />
              <Badge>{selectedCount} seleccionadas</Badge>
            </div>
            <ScrollArea className="h-80 w-full space-y-2 pr-2">
              <div className="grid grid-cols-2 gap-4">
                {categories
                  .filter((c) =>
                    c.nombre
                      .toLowerCase()
                      .includes(searchCategory.toLowerCase())
                  )
                  .map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={!!checked[Number(cat.id)]}
                        onCheckedChange={() => toggleCategory(Number(cat.id))}
                      />
                      <Label htmlFor={`cat-${cat.id}`}>{cat.nombre}</Label>
                    </div>
                  ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Guardar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
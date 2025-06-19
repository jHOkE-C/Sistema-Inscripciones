import { differenceInCalendarDays } from "date-fns";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/models/interfaces/olimpiada";
import DatePickerPopover from "@/components/DatePickerPopover";
import ReturnComponent from "@/components/ReturnComponent";
import Loading from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import NotFoundPage from "@/views/404";
import { cn } from "@/lib/utils";
import { useFasesOlimpiada } from "@/viewModels/usarVistaModelo/privilegios/fases/useFasesOlimpiada";

export default function Page() {
  const {
    data,
    loading,
    openAdd,
    setOpenAdd,
    openConfirm,
    setOpenConfirm,
    selectedIdFases,
    cronos,
    errors,
    fases,
    onSelectDate,
    onSave,
    toggleTipo,
    parseLocalDate,
    changePhase,
    getTipoPlazoLabel,
    idsFasesActualesPasadas,
    eliminar,
  } = useFasesOlimpiada();

  if (loading) return <Loading />;
  if (!data) return <NotFoundPage />;

  const { olimpiada } = data;

  return (
    <>
      <ReturnComponent />
      <div className="flex justify-center w-full min-h-screen pt-4">
        <div className="w-5/6 mx-auto">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>
                <h2 className="text-2xl font-bold ">
                  Definición de Fases de Version de Olimpiada
                </h2>
              </CardTitle>
              <CardDescription>
                <h2 className="text-xl font-semibold ">
                  {olimpiada.nombre} – {olimpiada.gestion}
                </h2>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-4 bg-background rounded-lg">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de inicio:
                    </p>
                    <p className="font-medium">
                      {formatDate(olimpiada.fecha_inicio)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de finalización:
                    </p>
                    <p className="font-medium">
                      {formatDate(olimpiada.fecha_fin)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                  <DialogTrigger asChild>
                    <Button size="sm">Agregar Fase</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md p-6 rounded-2xl shadow-lg">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevas Fases</DialogTitle>
                      <DialogDescription className="text-sm mt-2">
                        <p className="italic">
                          Las fases en curso o finalizadas están deshabilitadas.
                        </p>
                      </DialogDescription>
                      <div className="text-sm mt-4">
                        <p className="mb-2">
                          Selecciona las fases que deseas añadir o eliminar:
                        </p>
                        <ul className="space-y-1 text-center">
                          <li>
                            <span className="text-blue-600 font-medium">
                              Azul
                            </span>
                            <span className="ml-2">Fases activas</span>
                          </li>
                          <li>
                            <span className="text-green-600 font-medium">
                              Verde
                            </span>
                            <span className="ml-2">Fases a agregar</span>
                          </li>
                          <li>
                            <span className="text-red-600 font-medium">
                              Rojo
                            </span>
                            <span className="ml-2">Fases a eliminar</span>
                          </li>
                        </ul>
                      </div>
                    </DialogHeader>
                    <div className="p-2 space-y-2">
                      {fases.map((tp) => (
                        <div key={tp.id} className="flex items-center">
                          <Checkbox
                            disabled={
                              (tp.id == "1" &&
                                selectedIdFases.includes(tp.id)) ||
                              idsFasesActualesPasadas.includes(tp.id)
                            }
                            id={tp.id}
                            checked={selectedIdFases.includes(tp.id)}
                            onCheckedChange={() => toggleTipo(tp.id)}
                          />
                          <Label
                            htmlFor={tp.id}
                            className={cn(
                              cronos.find(({ id_fase }) => tp.id == id_fase)
                                ? "text-red-600"
                                : "",
                              cronos.find(({ id_fase }) => tp.id != id_fase) &&
                                selectedIdFases.includes(tp.id)
                                ? "text-green-600"
                                : "",
                              cronos.find(({ id_fase }) => tp.id == id_fase) &&
                                selectedIdFases.includes(tp.id)
                                ? "text-blue-600"
                                : "",

                              "ml-4"
                            )}
                          >
                            {tp.nombre_fase}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setOpenAdd(false)}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={() => changePhase(false)}>
                        Guardar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fase</TableHead>
                    <TableHead>Fecha inicio</TableHead>
                    <TableHead>Fecha de finalización</TableHead>
                    <TableHead>Duración</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cronos.map((c, index) => {
                    const hasError = errors[index];
                    return (
                      <TableRow key={c.fase.nombre_fase}>
                        <TableCell>
                          <Badge variant="outline">
                            {getTipoPlazoLabel(c.fase.nombre_fase)}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <DatePickerPopover
                            className={hasError?.start ? "text-red-500" : ""}
                            onSelect={(d) => {
                              if (d) {
                                onSelectDate(
                                  d,
                                  c.fase.nombre_fase,
                                  "fecha_inicio"
                                );
                                // setErrors(
                                //     (
                                //         prevErrors
                                //     ) => {
                                //         const updatedErrors =
                                //             [
                                //                 ...prevErrors,
                                //             ];
                                //         updatedErrors[
                                //             index
                                //         ] = {
                                //             ...updatedErrors[
                                //                 index
                                //             ],
                                //             start: false,
                                //         };
                                //         return updatedErrors;
                                //     }
                                // );
                              }
                            }}
                            selectedDate={
                              c.fecha_inicio
                                ? parseLocalDate(c.fecha_inicio)
                                : null
                            }
                            minDate={
                              index > 0 && cronos[index - 1].fecha_fin
                                ? parseLocalDate(cronos[index - 1].fecha_fin)
                                : parseLocalDate(olimpiada.fecha_inicio)
                            }
                            maxDate={
                              c.fecha_fin
                                ? parseLocalDate(c.fecha_fin)
                                : parseLocalDate(olimpiada.fecha_fin)
                            }
                            //fix temporal
                            disabled={index > 0 && !cronos[index - 1].fecha_fin}
                          />
                        </TableCell>
                        <TableCell>
                          <DatePickerPopover
                            className={hasError?.end ? "text-red-500" : ""}
                            onSelect={(d) => {
                              if (d) {
                                onSelectDate(
                                  d,
                                  c.fase.nombre_fase,
                                  "fecha_fin"
                                );
                                // setErrors(
                                //     (
                                //         prevErrors
                                //     ) => {
                                //         const updatedErrors =
                                //             [
                                //                 ...prevErrors,
                                //             ];
                                //         updatedErrors[
                                //             index
                                //         ] = {
                                //             ...updatedErrors[
                                //                 index
                                //             ],
                                //             end: false,
                                //         };
                                //         return updatedErrors;
                                //     }
                                // );
                              }
                            }}
                            selectedDate={
                              c.fecha_fin ? parseLocalDate(c.fecha_fin) : null
                            }
                            minDate={
                              c.fecha_inicio
                                ? parseLocalDate(c.fecha_inicio)
                                : parseLocalDate(olimpiada.fecha_inicio)
                            }
                            maxDate={parseLocalDate(olimpiada.fecha_fin)}
                            //fix temporal
                            disabled={!c.fecha_inicio}
                          />
                        </TableCell>
                        <TableCell>
                          {c.fecha_inicio && c.fecha_fin
                            ? differenceInCalendarDays(
                                new Date(c.fecha_fin),
                                new Date(c.fecha_inicio)
                              ) + 1
                            : "N/A"}{" "}
                          días
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="">
                <Button onClick={onSave}>Guardar Cambios</Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>¿Estas seguro?</DialogTitle>
            <DialogDescription>
              Se eliminarán las siguientes fases y toda su información
              relacionada:{" "}
              <span className="font-bold">
                {eliminar
                  .map((id) => fases.find((f) => f.id === id)?.nombre_fase)
                  .join(", ")}
              </span>
            </DialogDescription>
          </DialogHeader>

          <p className="text-sm ">¿Desea continuar?</p>

          <DialogFooter>
            <Button variant={"default"} onClick={() => changePhase(true)}>
              Continuar
            </Button>
            <Button
              variant={"secondary"}
              onClick={() => {
                setOpenConfirm(false);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

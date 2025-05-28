import { FeatureCard } from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import {
    Atom,
    Beaker,
    BookOpen,
    Calculator,
    Calendar,
    ExternalLink,
    Medal,
    Microscope,
    Star,
    TriangleAlert,
    Trophy,
    Users,
    Zap,
} from "lucide-react";
import { OlimpiadasCarousel } from "./carousel";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PageHome = () => {
    const [open, setOpen] = useState(true);

    const handleOfficialSite = () => {
        window.open("https://ohsansi.umss.edu.bo/", "_blank");
    };
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            {/* Main */}
            <main className="flex-1">
                <section className="relative  flex items-center overflow-hidden bg-background mt-8">
                    {/* Background decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Floating scientific icons */}
                        <div className="absolute top-20 left-10 text-muted-foreground/20 animate-pulse">
                            <Atom className="w-16 h-16" />
                        </div>
                        <div className="absolute top-40 right-20 text-muted-foreground/20 animate-pulse delay-1000">
                            <Microscope className="w-12 h-12" />
                        </div>
                        <div className="absolute bottom-40 left-20 text-muted-foreground/20 animate-pulse delay-2000">
                            <Calculator className="w-14 h-14" />
                        </div>
                        <div className="absolute bottom-20 right-10 text-muted-foreground/20 animate-pulse delay-500">
                            <Beaker className="w-10 h-10" />
                        </div>
                        <div className="absolute top-60 left-1/4 text-muted-foreground/20 animate-pulse delay-1500">
                            <Zap className="w-8 h-8" />
                        </div>

                        {/* Sparkle effects */}
                        <div className="absolute top-1/4 left-1/2 text-primary/60 animate-ping">
                            <Star className="w-4 h-4" />
                        </div>
                        <div className="absolute top-3/4 right-1/3 text-primary/60 animate-ping delay-700">
                            <Star className="w-3 h-3" />
                        </div>
                        <div className="absolute top-1/2 left-1/4 text-primary/60 animate-ping delay-1400">
                            <Star className="w-2 h-2" />
                        </div>
                    </div>

                    <div className="container px-6 md:px-10 mx-auto relative z-10">
                        <div className="text-center space-y-12">
                            <div className="space-y-6">
                                {/* Main title */}
                                <div className="space-y-4">
                                    <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-foreground">
                                        Oh!SanSi
                                    </h1>

                                    {/* Subtitle */}
                                    <div className="relative">
                                        <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-muted-foreground">
                                            Olimpiada de Ciencia y Tecnología
                                        </span>
                                    </div>
                                </div>

                                {/* Enhanced description */}
                                <div className="relative max-w-4xl mx-auto">
                                    <Card className="backdrop-blur-sm bg-card/50 border-border/50 shadow-lg">
                                        <CardContent className="p-6">
                                            <p className="text-muted-foreground md:text-lg lg:text-xl leading-relaxed">
                                                El Comité de la Olimpiadas
                                                Científica Nacional San Simón
                                                <span className="font-semibold text-primary">
                                                    {" "}
                                                    Oh!SanSi
                                                </span>
                                                , a través de la Facultad de
                                                Ciencias y Tecnología de la
                                                Universidad Mayor de San Simón,
                                                convoca a los estudiantes del
                                                Sistema de Educación Regular a
                                                participar en las Olimpiadas
                                                Oh!SanSi{" "}
                                                <span className="font-bold text-primary">
                                                    {new Date().getFullYear()}
                                                </span>
                                                .
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Enhanced buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link to="/consultar-estado">
                                    <Button
                                        size="lg"
                                        className="text-base px-10 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-full"
                                        variant={"outline"}
                                    >
                                        <Users className="w-5 h-5 mr-3" />
                                        Consultar Inscripción
                                    </Button>
                                </Link>
                                <a href="#olimpiadas">
                                    <Button
                                        size="lg"
                                        className="text-base px-10 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-full"
                                    >
                                        <BookOpen className="w-5 h-5 mr-3" />
                                        ¡Incribete ahora!
                                    </Button>
                                </a>
                            </div>

                            {/* Categories */}
                            <div className="flex justify-center items-center space-x-2 md:space-x-8 mt-12">
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                    <Atom className="w-6 h-6" />
                                    <span className="text-sm font-medium">
                                        Ciencias
                                    </span>
                                </div>
                                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                    <Zap className="w-6 h-6" />
                                    <span className="text-sm font-medium">
                                        Tecnología
                                    </span>
                                </div>
                                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                <div className="flex items-center space-x-2 text-muted-foreground">
                                    <Calculator className="w-6 h-6" />
                                    <span className="text-sm font-medium">
                                        Matemáticas
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <h2
                    className="text-3xl tracking-tighter md:text-5xl text-center md:p-10 text-foreground  font-bold scroll-mt-20 md:scroll-mt-12 mt-12 sm:mt-4"
                    id="olimpiadas"
                >
                    Olimpiadas Nacionales <br className="md:hidden"></br>San
                    Simón {new Date().getFullYear()}
                </h2>
                <OlimpiadasCarousel />

                {/* Características */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="px-6 md:px-6 text-center">
                        <h2 className="text-3xl font-bold sm:text-5xl">
                            Todo lo que necesitas para tus olimpiadas
                        </h2>
                        <p className="max-w-[900px] text-gray-500 md:text-xl mx-auto">
                            Nuestro sistema facilita la gestión completa de las
                            olimpiadas, desde la inscripción hasta la
                            premiación.
                        </p>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
                            <FeatureCard
                                icon={
                                    <Users className="h-6 w-6 text-blue-600" />
                                }
                                title="Inscripciones"
                                description="Proceso sencillo para inscribir participantes y equipos en múltiples categorías."
                            />
                            <FeatureCard
                                icon={
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                }
                                title="Calendario"
                                description="Organiza y visualiza todos los eventos programados durante las olimpiadas."
                            />
                            <FeatureCard
                                icon={
                                    <Trophy className="h-6 w-6 text-blue-600" />
                                }
                                title="Competencias"
                                description="Gestión de competencias, resultados y clasificaciones en tiempo real."
                            />
                            <FeatureCard
                                icon={
                                    <Medal className="h-6 w-6 text-blue-600" />
                                }
                                title="Resultados"
                                description="Seguimiento de medalleros, puntuaciones y estadísticas de todos los participantes."
                            />
                        </div>
                    </div>
                </section>
            </main>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold flex items-center justify-around text-yellow-600">
                            Oh!SanSi
                        </DialogTitle>
                        <DialogDescription className="text-center text-base mt-4">
                            <Alert className="text-yellow-600">
                                <TriangleAlert />
                                <AlertTitle>Pagina en Construccion</AlertTitle>
                                <AlertDescription className="">
                                    Esta es una página en construcción del
                                    sistema Oh!Sansi.
                                    <br />
                                    Para acceder a la versión oficial, haz clic
                                    en el botón de abajo.
                                </AlertDescription>
                            </Alert>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-6">
                        <Button
                            onClick={handleOfficialSite}
                            className="w-full"
                            size="lg"
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ir a la página oficial
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="w-full"
                        >
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default PageHome;

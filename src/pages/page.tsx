import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Calendar, Medal, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";

const PageHome = () => {
    const uuid = localStorage.getItem("uuid");
    return (
        <div className="flex min-h-screen flex-col ">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-16 items-center justify-between w-full px-4 md:px-10">
                    <Link to={"/"} className="flex items-center gap-1">
                        <img
                            alt="Olimpiadas ohSansi"
                            className="h-16 "
                            src="/logo.png"
                        />
                        <span className="text-xl text-blue-700 font-bold">
                            {" "}
                            Olimpiadas
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6 items-center">
                        <Link
                            to="/"
                            className="text-sm font-medium hover:underline"
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/eventos"
                            className="text-sm font-medium hover:underline"
                        >
                            Eventos
                        </Link>
                        <Link
                            to="/categorias"
                            className="text-sm font-medium hover:underline"
                        >
                            Categorías
                        </Link>
                        <Link
                            to="/contacto"
                            className="text-sm font-medium hover:underline"
                        >
                            Contacto
                        </Link>
                    </nav>
                    <Button asChild>
                        <Link to="/login">Iniciar Sesión</Link>
                    </Button>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
                    <div className="px-6 md:px-10">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                            <div className="space-y-4">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Sistema de Inscripciones para las Olimpiadas
                                    ohSansi
                                </h1>
                                <p className="max-w-[600px] text-gray-500 md:text-xl">
                                    Regístrate, sigue los eventos y participa en
                                    las competencias más emocionantes del año.
                                </p>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link to={`/inscribir/${uuid ? uuid : ""}`}>
                                    <Button
                                        size="lg"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        >
                                        {uuid
                                            ? "Continua la Inscripcion"
                                            : "Inscríbete Ahora"}
                                    </Button>
                                            </Link>

                                    <Button size="lg" variant="outline">
                                        Conoce Más
                                    </Button>
                                </div>
                            </div>
                            <div className="mx-auto lg:mr-0 w-full max-w-[500px] h-[350px] aspect-video rounded-xl overflow-hidden">
                                <img
                                    alt="Olimpiadas ohSansi"
                                    className="object-cover w-full h-full"
                                    src="/o!sansi.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </section>

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

            {/* Footer */}
            <footer className="w-full border-t py-6 md:py-0">
                <div className="px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
                    <p className="text-sm text-gray-500">
                        © 2025 Olimpiadas O!Sansi. Todos los derechos
                        reservados.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            to="/terminos"
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Términos
                        </Link>
                        <Link
                            to="/privacidad"
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Privacidad
                        </Link>
                        <Link
                            to="/contacto"
                            className="text-sm text-gray-500 hover:underline"
                        >
                            Contacto
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PageHome;

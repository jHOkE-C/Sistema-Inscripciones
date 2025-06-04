import { Card } from "@/components/ui/card";

const SectionVideoTutorial = () => {
  return (
    <section className="container mx-auto px-6 md:px-10 my-12">
      <h2
        className="
           text-3xl sm:text-5xl font-bold mb-8 text-center text-foreground tracking-tighter"
      >
        Video-tutoriales de Inscripción
      </h2>
      <div className="flex w-full flex-col lg:flex-row gap-6 md:gap-12">
        <Card className="p-6 shadow-lg rounded-xl w-full transition-all duration-300 transform  hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-foreground">
            Inscripción Normal
          </h2>
          <div className="aspect-video w-full ">
            <iframe
              src="https://www.youtube.com/embed/bA7SbGU50lM"
              title="Videotutorial Inscripción Normal"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </Card>

        <Card className="p-6 shadow-lg rounded-xl w-full transition-all duration-300 transform  hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-foreground">
            Inscripción por Excel
          </h2>
          <div className="aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/fvbmzJjmkqo"
              title="Videotutorial Inscripción por Excel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SectionVideoTutorial;

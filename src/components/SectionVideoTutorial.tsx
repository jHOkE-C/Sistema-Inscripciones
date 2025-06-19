import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Play } from "lucide-react";

const LOGO_SRC = "/cutieLogo.png";

interface VideoCardProps {
  title: string;
  videoId: string;
}

const VideoCard = ({ title, videoId }: VideoCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePlayClick = () => {
    setIsLoaded(true);
  };

  return (
    <Card className="p-6 shadow-lg rounded-xl w-full transition-all duration-300 transform hover:shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-center text-foreground">
        {title}
      </h2>
      <div className="aspect-video w-full relative max-w-2xl mx-auto">
        {!isLoaded ? (
          <div className="relative w-full h-full flex items-center justify-center bg-white aspect-video rounded-lg overflow-hidden">
            <img
              src={LOGO_SRC}
              alt="Logo SanSi"
              className="w-200 h-200 object-contain z-10"
              style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              draggable={false}
            />
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center group z-20"
              aria-label={`Play ${title}`}
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:bg-opacity-100 transition-all duration-300 shadow-lg">
                <Play className="w-8 h-8 text-black ml-1" fill="black" />
              </div>
            </button>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
            loading="lazy"
          />
        )}
      </div>
    </Card>
  );
};

const SectionVideoTutorial = () => {
  return (
    <section className="container mx-auto px-6 md:px-10 my-12">
      <h2 className="text-3xl sm:text-5xl font-bold mb-8 text-center text-foreground tracking-tighter">
        Video-tutoriales de Inscripción
      </h2>
      <div className="flex w-full flex-col lg:flex-row gap-6 md:gap-12">
        <VideoCard
          title="Inscripción Normal"
          videoId="bA7SbGU50lM"
        />
        <VideoCard
          title="Inscripción por Excel"
          videoId="fvbmzJjmkqo"
        />
      </div>
    </section>
  );
};

export default SectionVideoTutorial;

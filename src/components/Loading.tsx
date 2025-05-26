import { useEffect, useState } from "react";

export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      className={`fixed flex z-100 h-screen w-full items-center justify-center flex-col space-y-3 pointer-events-none transition-opacity duration-2000 dark:bg-black  bg-white ${
        visible ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-3 md:gap-5">
        <img
          src="/logo-sansimon.png"
          alt="Logo"
          className="h-14 md:h-24 object-contain"
        />
        <div className="flex flex-col justify-center text-center">
          <span className="text-4xl md:text-7xl  font-medium">UNIVERSIDAD</span>
          <span className="text-xl md:text-4xl">MAYOR DE SAN SIMON</span>
        </div>
      </div>
    </div>
  );
}

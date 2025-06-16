import { useState } from "react";

export const usePageViewModel = () => {
    const [open, setOpen] = useState(true);

    const handleOfficialSite = () => {
        window.open("https://ohsansi.umss.edu.bo/", "_blank");
    };

    return {
        open,
        setOpen,
        handleOfficialSite
    };
}; 
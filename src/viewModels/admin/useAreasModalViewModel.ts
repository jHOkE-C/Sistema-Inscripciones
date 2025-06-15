import { useState } from "react";

export function useAreasModalViewModel() {
    const [open, setOpen] = useState(false);

    return {
        open,
        setOpen
    };
} 
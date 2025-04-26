import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

interface ReturnComponentProps {
    to?: string;
}

export default function ReturnComponent({ to }: ReturnComponentProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            navigate(-1);
        }
    };

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            className="flex items-center gap-1 mb-4"
        >
            <ChevronLeft className="w-4 h-4" />
            Volver
        </Button>
    );
}

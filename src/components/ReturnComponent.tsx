import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

interface ReturnComponentProps {
    to?: string;
}

export default function ReturnComponent({ to }: ReturnComponentProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
            const currentPath = location.pathname;
            const segments = currentPath.split('/').filter(segment => segment !== '');
            if (segments.length > 1) {
                segments.pop();
                const parentPath = `/${segments.join('/')}`;
                navigate(parentPath);
            } else {
                navigate('/'); 
            }
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

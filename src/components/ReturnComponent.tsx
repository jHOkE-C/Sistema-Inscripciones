import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

const ReturnComponent = ({ to }: { to: string }) => {
    return (
        <Link to={to}>
            <Button variant="ghost" className="flex items-center gap-1 mb-4">
                <ChevronLeft className="h" />
                Volver
            </Button>
        </Link>
    );
};

export default ReturnComponent;

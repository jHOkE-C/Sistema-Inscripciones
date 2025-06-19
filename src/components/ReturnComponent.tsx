import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

interface ReturnComponentProps {
    to?: string;
}

export default function ReturnComponent({ to }: ReturnComponentProps) {
    const navigate = useNavigate();
    const [hasHeader, setHasHeader] = useState(true);

    useEffect(() => {
        const checkHeader = () => {
            const header = document.querySelector('header');
            setHasHeader(!!header);
        };

        checkHeader();

        const observer = new MutationObserver(checkHeader);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        if (to) {
            navigate(to);
        } else {
           navigate('..\\')
        }
    };

    return (
        <div className={`sticky ${hasHeader ? 'top-19' : 'top-4'}  ml-[8%] z-40 mb-2`}>
            <div className="container">
                <Button
                    variant="secondary"
                    onClick={handleClick}
                    className="text-md"
                >
                    <ChevronLeft className="size-4" />
                    <span> {`Volver`}</span>
                </Button>
            </div>
        </div>
    );
}
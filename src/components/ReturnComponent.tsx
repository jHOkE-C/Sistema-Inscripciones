import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

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
        <div className={`sticky ${hasHeader ? 'top-16' : 'top-0'} z-40 w-auto`}>
            <div className="container">
                <Button
                    variant="link"
                    onClick={handleClick}
                    className="text-md"
                >
                    <span> {`< Volver`}</span>
                </Button>
            </div>
        </div>
    );
}
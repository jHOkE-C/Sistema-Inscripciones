import { generarOrden } from "@/utils/pdf";

const Page = () => {
    generarOrden()
    return (
        <div className="h-screen">
            <iframe id="pdf" className="w-full h-full"></iframe>
        </div>
    );
};

export default Page;

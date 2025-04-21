import { Toaster } from "sonner";
import FormCI from "../FormCI";

const Page = () => {
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-background p-4">
                <Toaster />
                <FormCI/> 
               
            </div>
        </>
    );
};

export default Page;

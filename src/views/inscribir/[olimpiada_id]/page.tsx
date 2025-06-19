
import { useNavigate } from "react-router-dom";
import FormCI from "../formularioCI";
import { useEffect } from "react";

const Page = () => {
    const navigate = useNavigate()
    const ci = sessionStorage.getItem("ci")
    console.log(ci)
    useEffect(()=>{
        if(ci){
            navigate(`./${ci}`)
        }
    },[ci])
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-background p-4">
                <FormCI/> 
            </div>
        </>
    );
};

export default Page;

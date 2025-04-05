import { useParams } from "react-router-dom";

const Page = () => {
    const { uuid, codigo } = useParams();
    return (
        <>
            <p>uuid: {uuid}</p>
            <p>codigo: {codigo}</p>
        </>
    );
};

export default Page;
